import { useState } from "react";
import {apiFetch} from "../utils/api";

function CodeReview() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("Java");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const reviewCode = async () => {
    if (!code.trim()) {
      setError("Please enter some code first.");
      return;
    }

    setLoading(true);
    setResult(null);
    setError("");

    try {
      const data = await apiFetch("/review", {
        method: "POST",
        body: JSON.stringify({
          code,
          language,
        }),
      });

      setResult(data);
    } catch (error) {
      console.error("Error:", error);
      setError(error.message || "Unable to connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  const clearCode = () => {
    setCode("");
    setResult(null);
    setError("");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 py-8 sm:px-6 lg:px-10">

      {/* Main Container */}
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-sm text-indigo-300">
              <span>✨</span>
              AI Powered
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              AI Code Review
            </h1>

            <p className="mt-2 max-w-2xl text-slate-400">
              Analyze your code for bugs, security issues, complexity,
              quality and possible improvements.
            </p>
          </div>

          {/* Language */}
          <div className="w-full md:w-48">
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Programming Language
            </label>

            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            >
              <option>Java</option>
              <option>JavaScript</option>
              <option>Python</option>
              <option>C</option>
              <option>C++</option>
            </select>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid gap-6 lg:grid-cols-2">

          {/* ================= CODE EDITOR ================= */}
          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">

            {/* Editor Header */}
            <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">

              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-red-400"></span>
                  <span className="h-3 w-3 rounded-full bg-yellow-400"></span>
                  <span className="h-3 w-3 rounded-full bg-green-400"></span>
                </div>

                <span className="text-sm font-semibold text-slate-200">
                  Your Code
                </span>
              </div>

              <span className="rounded-md bg-slate-800 px-2.5 py-1 text-xs text-slate-400">
                {language}
              </span>
            </div>

            {/* Editor */}
            <div className="flex min-h-[500px] bg-slate-950">

              {/* Line Numbers */}
              <div className="w-12 shrink-0 select-none border-r border-slate-800 bg-slate-900/60 px-3 py-5 text-right font-mono text-sm leading-6 text-slate-600">
                {code.split("\n").map((_, index) => (
                  <div key={index}>{index + 1}</div>
                ))}
              </div>

              {/* Textarea */}
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="// Paste your code here..."
                spellCheck="false"
                className="min-h-[500px] flex-1 resize-none bg-transparent px-5 py-5 font-mono text-sm leading-6 text-slate-200 outline-none placeholder:text-slate-600"
              />
            </div>

            {/* Editor Footer */}
            <div className="flex flex-col gap-3 border-t border-slate-800 bg-slate-900 p-4 sm:flex-row sm:items-center sm:justify-between">

              <button
                onClick={clearCode}
                className="rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800"
              >
                Clear
              </button>

              <button
                onClick={reviewCode}
                disabled={loading}
                className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></span>
                    Analyzing...
                  </span>
                ) : (
                  "✨ Analyze Code"
                )}
              </button>

            </div>
          </div>

          {/* ================= AI REVIEW ================= */}
          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">

            {/* Review Header */}
            <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">

              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10 text-lg">
                  🤖
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-slate-200">
                    AI Review
                  </h2>

                  <p className="text-xs text-slate-500">
                    Powered by Gemini
                  </p>
                </div>
              </div>

              {result && (
                <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400">
                  ● Complete
                </span>
              )}
            </div>

            {/* Empty State */}
            {!result && !loading && !error && (
              <div className="flex min-h-[550px] flex-col items-center justify-center px-8 text-center">

                <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-500/10 text-4xl">
                  🤖
                </div>

                <h3 className="text-lg font-semibold text-slate-200">
                  Ready to review your code
                </h3>

                <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                  Paste your code on the left and click
                  <span className="text-slate-300"> Analyze Code </span>
                  to receive an AI-powered review.
                </p>

              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="flex min-h-[550px] flex-col items-center justify-center px-8 text-center">

                <div className="mb-5 h-12 w-12 animate-spin rounded-full border-4 border-slate-700 border-t-indigo-500"></div>

                <h3 className="text-lg font-semibold text-slate-200">
                  Analyzing your code...
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Gemini is reviewing your code.
                </p>

              </div>
            )}

            {/* Error */}
            {error && !loading && (
              <div className="p-6">

                <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-5">

                  <div className="flex gap-3">
                    <span className="text-xl">❌</span>

                    <div>
                      <h3 className="font-semibold text-red-400">
                        Review failed
                      </h3>

                      <p className="mt-1 text-sm text-red-300/80">
                        {error}
                      </p>
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* Results */}
            {result && !loading && (
              <div className="max-h-[650px] space-y-4 overflow-y-auto p-5">

                {/* Summary */}
                <section className="rounded-xl border border-slate-800 bg-slate-950/50 p-5">

                  <h3 className="mb-3 flex items-center gap-2 font-semibold">
                    📝 Summary
                  </h3>

                  <p className="text-sm leading-6 text-slate-400">
                    {result.summary}
                  </p>

                </section>

                {/* Bugs */}
                <section className="rounded-xl border border-slate-800 bg-slate-950/50 p-5">

                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="flex items-center gap-2 font-semibold">
                      🐛 Bugs
                    </h3>

                    <span className="rounded-full bg-slate-800 px-2.5 py-1 text-xs text-slate-400">
                      {result.bugs.length}
                    </span>
                  </div>

                  {result.bugs.length === 0 ? (
                    <div className="rounded-lg bg-green-500/10 p-3 text-sm text-green-400">
                      ✅ No bugs found.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {result.bugs.map((bug, index) => (
                        <div
                          key={index}
                          className="rounded-lg border border-slate-800 bg-slate-900 p-4"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">

                            <strong className="text-sm text-slate-200">
                              {bug.title}
                            </strong>

                            <SeverityBadge severity={bug.severity} />

                          </div>

                          <p className="mt-2 text-sm leading-6 text-slate-400">
                            {bug.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                </section>

                {/* Security */}
                <section className="rounded-xl border border-slate-800 bg-slate-950/50 p-5">

                  <h3 className="mb-4 flex items-center gap-2 font-semibold">
                    🔐 Security
                  </h3>

                  {result.security.length === 0 ? (
                    <div className="rounded-lg bg-green-500/10 p-3 text-sm text-green-400">
                      ✅ No major security issues found.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {result.security.map((issue, index) => (
                        <div
                          key={index}
                          className="rounded-lg border border-slate-800 bg-slate-900 p-4"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">

                            <strong className="text-sm text-slate-200">
                              {issue.title}
                            </strong>

                            <SeverityBadge severity={issue.severity} />

                          </div>

                          <p className="mt-2 text-sm leading-6 text-slate-400">
                            {issue.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                </section>

                {/* Complexity */}
                <section className="rounded-xl border border-slate-800 bg-slate-950/50 p-5">

                  <h3 className="mb-4 flex items-center gap-2 font-semibold">
                    ⏱ Complexity
                  </h3>

                  <div className="grid grid-cols-2 gap-3">

                    <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
                      <p className="text-xs text-slate-500">
                        Time Complexity
                      </p>

                      <p className="mt-2 font-mono text-xl font-bold text-indigo-400">
                        {result.complexity.time}
                      </p>
                    </div>

                    <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
                      <p className="text-xs text-slate-500">
                        Space Complexity
                      </p>

                      <p className="mt-2 font-mono text-xl font-bold text-indigo-400">
                        {result.complexity.space}
                      </p>
                    </div>

                  </div>

                  <p className="mt-4 text-sm leading-6 text-slate-400">
                    {result.complexity.explanation}
                  </p>

                </section>

                {/* Code Quality */}
                <section className="rounded-xl border border-slate-800 bg-slate-950/50 p-5">

                  <div className="flex items-center justify-between">

                    <h3 className="flex items-center gap-2 font-semibold">
                      ⭐ Code Quality
                    </h3>

                    <div>
                      <span className="text-3xl font-bold text-indigo-400">
                        {result.codeQuality.score}
                      </span>

                      <span className="text-sm text-slate-500">
                        /10
                      </span>
                    </div>

                  </div>

                  {/* Progress */}
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">

                    <div
                      className="h-full rounded-full bg-indigo-500 transition-all duration-700"
                      style={{
                        width: `${result.codeQuality.score * 10}%`,
                      }}
                    ></div>

                  </div>

                  <p className="mt-4 text-sm leading-6 text-slate-400">
                    {result.codeQuality.comment}
                  </p>

                </section>

                {/* Suggestions */}
                <section className="rounded-xl border border-slate-800 bg-slate-950/50 p-5">

                  <h3 className="mb-4 flex items-center gap-2 font-semibold">
                    💡 Suggestions
                  </h3>

                  <ul className="space-y-3">

                    {result.suggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        className="flex gap-3 text-sm leading-6 text-slate-400"
                      >
                        <span className="mt-1 text-indigo-400">
                          →
                        </span>

                        <span>{suggestion}</span>
                      </li>
                    ))}

                  </ul>

                </section>

              </div>
            )}

          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-slate-600">
          DevMind • AI-powered code analysis
        </div>

      </div>
    </div>
  );
}

/* Severity Badge */
function SeverityBadge({ severity }) {
  const styles = {
    High: "bg-red-500/10 text-red-400 border-red-500/20",
    Medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    Low: "bg-green-500/10 text-green-400 border-green-500/20",
  };

  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-xs font-medium ${
        styles[severity] || styles.Low
      }`}
    >
      {severity}
    </span>
  );
}

export default CodeReview;