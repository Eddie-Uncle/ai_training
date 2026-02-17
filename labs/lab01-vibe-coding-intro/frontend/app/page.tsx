"use client";

import { useState, useEffect } from "react";

interface ShortenResponse {
  short_code: string;
  short_url: string;
  original_url: string;
}

interface URLHistory {
  short_code: string;
  short_url: string;
  original_url: string;
  created_at: string;
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");
  const [history, setHistory] = useState<URLHistory[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Fetch history on mount
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const response = await fetch("/api/urls");
      if (response.ok) {
        const data = await response.json();
        setHistory(data);
      }
    } catch (err) {
      console.error("Failed to fetch history:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setShortUrl("");

    if (!url.trim()) {
      setError("PLEASE ENTER A URL");
      return;
    }

    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      setError("URL MUST START WITH http:// OR https://");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "FAILED TO SHORTEN URL");
      }

      const data: ShortenResponse = await response.json();
      setShortUrl(data.short_url);
      
      // Refresh history after successful creation
      fetchHistory();
    } catch (err) {
      setError(err instanceof Error ? err.message.toUpperCase() : "AN ERROR OCCURRED");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied(""), 2000);
    } catch (err) {
      setError("FAILED TO COPY TO CLIPBOARD");
    }
  };

  const truncateUrl = (url: string, maxLength: number = 50) => {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + "...";
  };

  return (
    <div className="min-h-screen bg-[#0d0208] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-6xl font-bold matrix-glow mb-4">
            &gt; URL_SHORTENER.EXE
          </h1>
          <p className="text-[--matrix-text-dim] text-sm md:text-base tracking-wider">
            [SYSTEM INITIALIZED] :: TRANSFORM_URLS_TO_COMPACT_FORM
          </p>
        </div>

        {/* Main Form */}
        <div className="matrix-border matrix-box-glow bg-[--matrix-bg-secondary] rounded-lg p-6 md:p-8 mb-8">
          <div className="mb-6">
            <div className="text-[--matrix-green-bright] text-xs md:text-sm mb-2 font-mono">
              &gt; INPUT_LONG_URL:
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/very/long/url/path"
              className="w-full px-4 py-3 matrix-input rounded font-mono text-sm md:text-base"
              disabled={loading}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full matrix-button py-3 px-6 rounded font-mono text-sm md:text-base uppercase tracking-wider"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <span className="animate-pulse">[PROCESSING...]</span>
                </span>
              ) : (
                "[EXECUTE_SHORTEN]"
              )}
            </button>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 border border-red-500 bg-red-900/20 rounded">
              <div className="flex items-center">
                <span className="text-red-500 mr-2">[ERROR]</span>
                <p className="text-red-400 font-mono text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Success Result */}
          {shortUrl && (
            <div className="mt-4 p-4 matrix-border bg-green-900/10 rounded">
              <div className="text-[--matrix-green-bright] text-xs mb-2 font-mono">
                [SUCCESS] :: URL_SHORTENED
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={shortUrl}
                  readOnly
                  className="flex-1 px-3 py-2 matrix-input rounded font-mono text-sm"
                />
                <button
                  onClick={() => handleCopy(shortUrl, "main")}
                  className="matrix-button px-4 py-2 rounded font-mono text-sm whitespace-nowrap"
                >
                  {copied === "main" ? "[COPIED!]" : "[COPY]"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* History Section */}
        <div className="matrix-border matrix-box-glow bg-[--matrix-bg-secondary] rounded-lg p-6 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-[--matrix-green-bright]">
              &gt; Latest Short Links
            </h2>
            <button
              onClick={fetchHistory}
              disabled={loadingHistory}
              className="matrix-button px-4 py-2 rounded font-mono text-xs md:text-sm"
            >
              {loadingHistory ? "[...]" : "[REFRESH]"}
            </button>
          </div>

          {history.length === 0 ? (
            <div className="text-center text-[--matrix-text-dim] py-8 font-mono">
              [NO_DATA] :: Create your first short URL above
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full font-mono text-xs md:text-sm">
                <thead>
                  <tr className="border-b border-[--matrix-border]">
                    <th className="text-left py-3 px-2 text-[--matrix-text-dim] font-bold uppercase tracking-wider">
                      Original URL
                    </th>
                    <th className="text-left py-3 px-2 text-[--matrix-text-dim] font-bold uppercase tracking-wider">
                      Short URL
                    </th>
                    <th className="text-center py-3 px-2 text-[--matrix-text-dim] font-bold uppercase tracking-wider">
                      Code
                    </th>
                    <th className="text-center py-3 px-2 text-[--matrix-text-dim] font-bold uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item) => (
                    <tr
                      key={item.short_code}
                      className="border-b border-[--matrix-border] hover:bg-green-900/10 transition-colors"
                    >
                      <td className="py-3 px-2 text-[--matrix-text]">
                        <span className="block md:hidden">
                          {truncateUrl(item.original_url, 30)}
                        </span>
                        <span className="hidden md:block">
                          {truncateUrl(item.original_url, 60)}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <a
                          href={item.short_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[--matrix-green-bright] hover:underline flex items-center gap-2"
                        >
                          <span className="hidden sm:inline">
                            {truncateUrl(item.short_url, 40)}
                          </span>
                          <span className="sm:hidden">
                            {truncateUrl(item.short_url, 25)}
                          </span>
                          <svg
                            className="w-3 h-3 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                        </a>
                      </td>
                      <td className="py-3 px-2 text-center">
                        <span className="inline-block px-3 py-1 bg-[--matrix-green-dark] text-black rounded font-bold">
                          {item.short_code}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-center">
                        <button
                          onClick={() => handleCopy(item.short_url, item.short_code)}
                          className="matrix-button px-3 py-1 rounded text-xs inline-flex items-center gap-1"
                        >
                          {copied === item.short_code ? (
                            <>
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </>
                          ) : (
                            <>
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                />
                              </svg>
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-[--matrix-text-dim] text-xs font-mono">
          <p>[SYSTEM_STATUS] :: ONLINE :: ALL_SYSTEMS_OPERATIONAL</p>
        </div>
      </div>
    </div>
  );
}
