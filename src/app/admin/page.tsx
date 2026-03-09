"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";

interface Combination {
  theme: string;
  subRole: string;
  themeName: string;
  subRoleName: string;
}

interface GeneratedImage {
  theme: string;
  subRole: string;
  imageUrl: string;
}

interface FailedImage {
  theme: string;
  subRole: string;
  error: string;
}

type JobStatus = "pending" | "generating" | "done" | "failed";

interface Job extends Combination {
  status: JobStatus;
  imageUrl?: string;
  error?: string;
}

function AuthImage({ src, alt, className, authHeaders }: {
  src: string;
  alt: string;
  className?: string;
  authHeaders: () => Record<string, string>;
}) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(src, { headers: authHeaders() })
      .then(r => r.blob())
      .then(blob => {
        if (!cancelled) setBlobUrl(URL.createObjectURL(blob));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  if (!blobUrl) {
    return <div className={`${className} bg-zinc-800 animate-pulse`} />;
  }

  /* eslint-disable-next-line @next/next/no-img-element */
  return <img src={blobUrl} alt={alt} className={className} />;
}

export default function AdminPage() {
  const [secret, setSecret] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [batchId, setBatchId] = useState<string | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef(false);

  const authHeaders = useCallback(() => ({
    Authorization: `Bearer ${secret}`,
  }), [secret]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const f = acceptedFiles[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
      setBatchId(null);
      setJobs([]);
      setError(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif"] },
    maxFiles: 1,
    multiple: false,
  });

  const handleAuth = () => {
    if (secret.trim().length > 0) {
      setAuthenticated(true);
      sessionStorage.setItem("admin_secret", secret);
    }
  };

  // Restore secret from sessionStorage on mount
  useState(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("admin_secret");
      if (stored) {
        setSecret(stored);
        setAuthenticated(true);
      }
    }
  });

  const runGenerationQueue = async (currentBatchId: string, jobList: Job[]) => {
    setGenerating(true);
    abortRef.current = false;

    const queue = [...jobList.filter(j => j.status === "pending" || j.status === "failed")];
    const CONCURRENCY = 2;
    const STAGGER_DELAY_MS = 500;
    let active = 0;
    let idx = 0;

    const updateJob = (theme: string, subRole: string, updates: Partial<Job>) => {
      setJobs(prev => prev.map(j =>
        j.theme === theme && j.subRole === subRole ? { ...j, ...updates } : j
      ));
    };

    const delay = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

    await new Promise<void>((resolve) => {
      const runNext = async () => {
        if (abortRef.current) {
          if (active === 0) resolve();
          return;
        }

        while (active < CONCURRENCY && idx < queue.length) {
          const job = queue[idx++];
          active++;
          updateJob(job.theme, job.subRole, { status: "generating" });

          // Stagger concurrent requests to avoid burst rate limiting
          if (active > 1) await delay(STAGGER_DELAY_MS);

          fetch(`/api/admin/batch/${currentBatchId}/generate`, {
            method: "POST",
            headers: { ...authHeaders(), "Content-Type": "application/json" },
            body: JSON.stringify({ theme: job.theme, subRole: job.subRole }),
          })
            .then(async (res) => {
              if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || `Generation failed (${res.status})`);
              }
              const data = await res.json();
              updateJob(job.theme, job.subRole, {
                status: "done",
                imageUrl: data.imageUrl,
              });
            })
            .catch((err) => {
              updateJob(job.theme, job.subRole, {
                status: "failed",
                error: err instanceof Error ? err.message : "Failed",
              });
            })
            .finally(() => {
              active--;
              if (active === 0 && idx >= queue.length) {
                resolve();
              } else {
                runNext();
              }
            });
        }
      };

      runNext();
    });

    setGenerating(false);
  };

  const handleGo = async () => {
    if (!file) return;
    setAnalyzing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("photo", file);

      const res = await fetch("/api/admin/batch", {
        method: "POST",
        headers: authHeaders(),
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Upload failed");
      }

      const data = await res.json();
      const newBatchId = data.batchId;
      const newJobs: Job[] = data.combinations.map((c: Combination) => ({ ...c, status: "pending" as JobStatus }));
      setBatchId(newBatchId);
      setJobs(newJobs);
      setAnalyzing(false);

      // Immediately start generation
      await runGenerationQueue(newBatchId, newJobs);

      // Auto-retry failed jobs once after a short delay
      const failedJobs = await new Promise<Job[]>((resolve) => {
        setJobs(prev => {
          resolve(prev.filter(j => j.status === "failed"));
          return prev;
        });
      });
      if (failedJobs.length > 0 && !abortRef.current) {
        console.log(`[admin] Auto-retrying ${failedJobs.length} failed jobs...`);
        await new Promise<void>(r => setTimeout(r, 3000));
        await runGenerationQueue(newBatchId, failedJobs.map(j => ({ ...j, status: "failed" as JobStatus })));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setAnalyzing(false);
    }
  };

  const handleRetryFailed = async () => {
    if (!batchId || jobs.length === 0) return;
    await runGenerationQueue(batchId, jobs);
  };

  const handleDownloadZip = async () => {
    if (!batchId) return;
    const res = await fetch(`/api/admin/batch/${batchId}/download`, {
      headers: authHeaders(),
    });
    if (!res.ok) return;
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pictapet-batch-${batchId.slice(0, 8)}.zip`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadImage = async (job: Job) => {
    if (!job.imageUrl) return;
    const res = await fetch(job.imageUrl, { headers: authHeaders() });
    if (!res.ok) return;
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${job.theme}-${job.subRole}.png`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const completedCount = jobs.filter(j => j.status === "done").length;
  const failedCount = jobs.filter(j => j.status === "failed").length;
  const totalCount = jobs.length;

  // Group jobs by theme
  const themes = ["royal", "cowboy", "beach", "portrait"];
  const jobsByTheme = themes.reduce((acc, theme) => {
    acc[theme] = jobs.filter(j => j.theme === theme);
    return acc;
  }, {} as Record<string, Job[]>);

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 max-w-sm w-full">
          <h1 className="text-xl font-bold text-white mb-4">Admin Access</h1>
          <input
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAuth()}
            placeholder="Enter admin secret"
            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 mb-4"
          />
          <button
            onClick={handleAuth}
            className="w-full py-3 bg-white text-black font-semibold rounded-lg hover:bg-zinc-200 transition-colors"
          >
            Authenticate
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Batch Marketing Generator</h1>
          <button
            onClick={() => { setAuthenticated(false); setSecret(""); sessionStorage.removeItem("admin_secret"); }}
            className="text-sm text-zinc-500 hover:text-zinc-300"
          >
            Logout
          </button>
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-800 text-red-300 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Upload Section */}
        {!batchId && (
          <div className="space-y-6">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
                isDragActive ? "border-white bg-zinc-800/50" : "border-zinc-700 hover:border-zinc-500"
              }`}
            >
              <input {...getInputProps()} />
              {preview ? (
                <div className="flex flex-col items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={preview} alt="Preview" className="w-48 h-48 object-cover rounded-lg" />
                  <p className="text-zinc-400">Click or drag to replace</p>
                </div>
              ) : (
                <div>
                  <p className="text-lg text-zinc-300 mb-2">Drop a pet photo here</p>
                  <p className="text-sm text-zinc-500">JPEG, PNG, WebP, or HEIC</p>
                </div>
              )}
            </div>

            <button
              onClick={handleGo}
              disabled={!file || analyzing}
              className="w-full py-4 bg-white text-black font-semibold rounded-lg hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-lg"
            >
              {analyzing ? "Analyzing pet photo..." : "Go"}
            </button>
          </div>
        )}

        {/* Generation Section */}
        {batchId && (
          <div className="space-y-6">
            {/* Progress */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-zinc-400">
                  {completedCount}/{totalCount} complete
                  {failedCount > 0 && <span className="text-red-400 ml-2">({failedCount} failed)</span>}
                </span>
                <div className="flex gap-3">
                  {completedCount > 0 && (
                    <button
                      onClick={handleDownloadZip}
                      className="px-4 py-2 bg-zinc-800 border border-zinc-700 text-white rounded-lg hover:bg-zinc-700 text-sm font-medium transition-colors"
                    >
                      Download ZIP ({completedCount})
                    </button>
                  )}
                  {generating && (
                    <button
                      onClick={() => { abortRef.current = true; }}
                      className="px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-red-600 hover:bg-red-700 text-white"
                    >
                      Stop
                    </button>
                  )}
                  {!generating && failedCount > 0 && (
                    <button
                      onClick={handleRetryFailed}
                      className="px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-white text-black hover:bg-zinc-200"
                    >
                      Retry Failed ({failedCount})
                    </button>
                  )}
                </div>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-2">
                <div
                  className="bg-white h-2 rounded-full transition-all duration-300"
                  style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Results Grid — 4 columns, one per theme */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {themes.map(theme => (
                <div key={theme} className="space-y-3">
                  <h2 className="text-lg font-semibold capitalize border-b border-zinc-800 pb-2">
                    {theme}
                  </h2>
                  <div className="space-y-3">
                    {jobsByTheme[theme]?.map(job => (
                      <div
                        key={`${job.theme}-${job.subRole}`}
                        className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden"
                      >
                        {job.status === "done" && job.imageUrl ? (
                          <div className="relative group">
                            <AuthImage
                              src={job.imageUrl}
                              alt={`${job.themeName} ${job.subRoleName}`}
                              className="w-full aspect-[9/16] object-cover"
                              authHeaders={authHeaders}
                            />
                            <button
                              onClick={() => handleDownloadImage(job)}
                              className="absolute top-2 right-2 p-2 bg-black/70 hover:bg-black rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Download image"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                            </button>
                            <div className="p-2 text-center">
                              <span className="text-xs text-zinc-400">{job.subRoleName}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="aspect-[9/16] flex items-center justify-center">
                            {job.status === "generating" ? (
                              <div className="text-center">
                                <div className="w-8 h-8 border-2 border-zinc-600 border-t-white rounded-full animate-spin mx-auto mb-2" />
                                <span className="text-xs text-zinc-500">Generating...</span>
                              </div>
                            ) : job.status === "failed" ? (
                              <div className="text-center p-3">
                                <span className="text-xs text-red-400">Failed</span>
                                <p className="text-xs text-zinc-600 mt-1">{job.subRoleName}</p>
                                {job.error && <p className="text-xs text-red-400/70 mt-1 break-words">{job.error}</p>}
                              </div>
                            ) : (
                              <div className="text-center">
                                <span className="text-xs text-zinc-600">{job.subRoleName}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Reset */}
            <button
              onClick={() => { setBatchId(null); setJobs([]); setFile(null); setPreview(null); }}
              className="text-sm text-zinc-500 hover:text-zinc-300"
            >
              Start over with a new photo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
