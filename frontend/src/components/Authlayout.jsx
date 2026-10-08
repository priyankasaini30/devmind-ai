import { useState } from "react";

/* ---------- tiny inline icons (no icon library needed) ---------- */
const ICONS = {
  mail: (
    <>
      <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </>
  ),
  lock: (
    <>
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </>
  ),
  user: (
    <>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </>
  ),
  eye: (
    <>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  eyeOff: (
    <>
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </>
  ),
};

function Icon({ name }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICONS[name]}
    </svg>
  );
}

/* ---------- reusable form pieces ---------- */
export function AuthField({
  id,
  label,
  type = "text",
  icon,
  value,
  onChange,
  placeholder,
  autoComplete,
  minLength,
}) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-300">
        {label}
      </label>

      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-500">
          <Icon name={icon} />
        </span>

        <input
          id={id}
          type={isPassword && show ? "text" : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          minLength={minLength}
          required
          className={`w-full rounded-lg border border-white/10 bg-slate-950/60 py-2.5 pl-10 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-indigo-400/70 focus:ring-4 focus:ring-indigo-500/15 ${
            isPassword ? "pr-11" : "pr-3"
          }`}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "Hide password" : "Show password"}
            className="absolute inset-y-0 right-1.5 my-auto flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition hover:text-slate-200 focus-visible:outline-2 focus-visible:outline-indigo-400"
          >
            <Icon name={show ? "eyeOff" : "eye"} />
          </button>
        )}
      </div>
    </div>
  );
}

export function AuthError({ message }) {
  return (
    <div
      role="alert"
      className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
    >
      {message}
    </div>
  );
}

export function AuthSubmit({ loading, loadingText, children }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition duration-200 hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:brightness-100"
    >
      {loading ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </button>
  );
}

/* ---------- left-hand product intro ---------- */
const FEATURES = [
  { icon: "🤖", title: "AI Code Reviews", text: "Bugs, security and complexity in one pass." },
  { icon: "🎙️", title: "Mock Technical Interviews", text: "Questions that adapt to your answers." },
  { icon: "📈", title: "Developer Progress Tracking", text: "Watch your scores improve over time." },
];

function IntroPanel() {
  return (
    <section className="hidden md:block">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-lg font-bold text-white shadow-lg shadow-indigo-600/30">
          D
        </div>
        <span className="text-xl font-semibold tracking-tight text-white">DevMind</span>
      </div>

      <p className="text-3xl font-bold leading-tight tracking-tight text-white lg:text-4xl">
        Build. Review. Improve.
      </p>
      <p className="mt-4 max-w-md text-base leading-7 text-slate-400">
        Your AI-powered workspace for writing better code and preparing for technical interviews.
      </p>

      <ul className="mt-8 space-y-4">
        {FEATURES.map((f) => (
          <li key={f.title} className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-base">
              {f.icon}
            </span>
            <div>
              <p className="text-sm font-medium text-slate-200">{f.title}</p>
              <p className="text-sm text-slate-500">{f.text}</p>
            </div>
          </li>
        ))}
      </ul>

      {/* decorative terminal snippet */}
      <div
        aria-hidden="true"
        className="mt-10 max-w-md overflow-hidden rounded-xl border border-white/10 bg-slate-950/60 font-mono text-[13px] shadow-xl shadow-black/20"
      >
        <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
          <span className="ml-3 text-xs text-slate-500">review.js</span>
        </div>
        <pre className="overflow-x-auto px-4 py-4 leading-6 text-slate-300">
          <code>
            <span className="text-violet-400">const</span> review ={" "}
            <span className="text-violet-400">await</span> devMind.
            <span className="text-blue-400">analyze</span>(code);{"\n"}
            <span className="text-slate-500">// 2 bugs found, 0 security issues, quality 8/10</span>
          </code>
        </pre>
      </div>
    </section>
  );
}

/* ---------- page shell ---------- */
export default function AuthLayout({ title, subtitle, footer, children }) {
  return (
    <div className="relative isolate flex min-h-[calc(100vh-4rem)] items-center overflow-hidden bg-[#050816] px-4 py-10 sm:px-6 lg:px-10">
      {/* background: two soft glows + a faint grid, all behind content */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-40 -top-40 h-[28rem] w-[28rem] rounded-full bg-violet-600/20 blur-3xl animate-drift motion-reduce:animate-none" />
        <div className="absolute -bottom-48 -right-32 h-[30rem] w-[30rem] rounded-full bg-blue-600/15 blur-3xl animate-drift-slow motion-reduce:animate-none" />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage: "radial-gradient(ellipse at center, black 25%, transparent 75%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, black 25%, transparent 75%)",
          }}
        />
      </div>

      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 md:grid-cols-2 lg:gap-20">
        <IntroPanel />

        <div className="mx-auto w-full max-w-md animate-fade-up motion-reduce:animate-none">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-indigo-950/40 backdrop-blur-xl sm:p-8">
            <h1 className="text-2xl font-semibold tracking-tight text-white">{title}</h1>
            <p className="mb-7 mt-1.5 text-sm text-slate-400">{subtitle}</p>

            {children}

            <p className="mt-6 text-center text-sm text-slate-500">{footer}</p>
          </div>
        </div>
      </div>
    </div>
  );
}