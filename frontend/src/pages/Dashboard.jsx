import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FeatureCard from "../components/FeatureCard";
import { apiFetch } from "../utils/api";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await apiFetch("/dashboard/stats");
        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white lg:px-10">
    <div className="mx-auto max-w-[1400px]">
  
      {/* Welcome */}
      <section className="mb-10 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-sm text-indigo-300">
          ✨ AI-powered developer workspace
        </div>
  
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Welcome to DevMind 👋
        </h1>
  
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-400">
          Your AI-powered coding assistant for reviewing code,
          learning programming, and managing your knowledge.
        </p>
      </section>

        {/* Stats Row */}
        {!loading && stats && stats.totalReviews > 0 && (
          <section className="mb-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <p className="text-sm text-slate-500">Total Reviews</p>
              <p className="mt-1 text-3xl font-bold">{stats.totalReviews}</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <p className="text-sm text-slate-500">Avg. Quality Score</p>
              <p className="mt-1 text-3xl font-bold text-indigo-400">
                {stats.averageScore}/10
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <p className="text-sm text-slate-500">Bugs Found</p>
              <p className="mt-1 text-3xl font-bold text-amber-400">
                {stats.totalBugs}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <p className="text-sm text-slate-500">Security Issues</p>
              <p className="mt-1 text-3xl font-bold text-red-400">
                {stats.totalSecurityIssues}
              </p>
            </div>
          </section>
        )}

        {/* Language Breakdown */}
        {!loading && stats && stats.languageBreakdown?.length > 0 && (
          <section className="mb-10 rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="mb-4 text-lg font-semibold">Reviews by Language</h2>

            <div className="space-y-3">
              {stats.languageBreakdown.map((entry) => {
                const percentage = Math.round((entry.count / stats.totalReviews) * 100);
                return (
                  <div key={entry.language}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="capitalize text-slate-300">{entry.language}</span>
                      <span className="text-slate-500">
                        {entry.count} review{entry.count !== 1 ? "s" : ""} ({percentage}%)
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-indigo-500 transition-all duration-700"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Feature Cards */}
        <section className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            icon="🤖"
            title="AI Code Review"
            description="Analyze your code for bugs, security issues, complexity, quality, and improvements."
            buttonText="Review Code →"
            onClick={() => window.location.href = "/review"}
            accent="indigo"
          />

          <FeatureCard
            icon="🎙️"
            title="AI Interviewer"
            description="Practice technical interview questions with real-time AI feedback."
            buttonText="Start Interview →"
            onClick={() => window.location.href = "/interview"}
            accent="purple"
          />

          <FeatureCard
            icon="📊"
            title="Review History"
            description="Browse and revisit all your past code reviews in detail."
            buttonText="View History →"
            onClick={() => window.location.href = "/history"}
            accent="green"
          />
          <FeatureCard
  icon="🧠"
  title="My Notes"
  description="Save programming notes, concepts, code snippets, and useful learning resources."
  buttonText="View Notes →"
  onClick={() => window.location.href = "/notes"}
  accent="purple"
/>
        </section>

        {/* Recent Reviews */}
        <section className="mt-10 rounded-2xl border border-slate-800 bg-slate-900">
          <div className="border-b border-slate-800 px-6 py-5">
            <h2 className="text-xl font-semibold">Recent Code Reviews</h2>
            <p className="mt-1 text-sm text-slate-500">
              Your recently analyzed code appears here.
            </p>
          </div>

          {loading ? (
            <div className="flex min-h-[180px] items-center justify-center">
              <p className="text-slate-500">Loading...</p>
            </div>
          ) : error ? (
            <div className="flex min-h-[180px] items-center justify-center px-6 text-center">
              <p className="text-red-400">{error}</p>
            </div>
          ) : !stats || stats.recentReviews.length === 0 ? (
            <div className="flex min-h-[180px] flex-col items-center justify-center px-6 text-center">
              <div className="mb-3 text-4xl">📋</div>
              <p className="font-medium text-slate-300">No code reviews yet</p>
              <p className="mt-1 text-sm text-slate-500">
                Start by submitting your first piece of code.
              </p>
              <Link
                to="/review"
                className="mt-5 text-sm font-medium text-indigo-400 hover:text-indigo-300"
              >
                Start your first review →
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-800">
              {stats.recentReviews.map((review) => (
                <Link
                  key={review._id}
                  to="/history"
                  className="flex items-center justify-between px-6 py-4 transition hover:bg-slate-800/50"
                >
                  <div>
                    <span className="text-xs uppercase text-slate-500">
                      {review.language}
                    </span>
                    <p className="text-slate-200">{review.summary}</p>
                  </div>
                  <span className="whitespace-nowrap text-sm text-slate-400">
                    {review.codeQuality?.score}/10
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>

      </div>
    </main>
  );
}

export default Dashboard;