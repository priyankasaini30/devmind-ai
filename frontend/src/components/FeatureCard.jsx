function FeatureCard({
    icon,
    title,
    description,
    buttonText,
    onClick,
    disabled = false,
    accent = "indigo",
  }) {
    const accentStyles = {
      indigo: "bg-indigo-500/10 hover:border-indigo-500/50",
      purple: "bg-purple-500/10 hover:border-purple-500/50",
      green: "bg-green-500/10 hover:border-green-500/50",
    };
  
    return (
      <div
        className={`rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:-translate-y-1 ${
          accentStyles[accent]
        }`}
      >
        <div
          className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${
            accentStyles[accent].split(" ")[0]
          }`}
        >
          {icon}
        </div>
  
        <h3 className="text-xl font-semibold text-white">
          {title}
        </h3>
  
        <p className="mt-3 min-h-[72px] text-sm leading-6 text-slate-400">
          {description}
        </p>
  
        {disabled ? (
          <button
            disabled
            className="mt-6 cursor-not-allowed rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-500"
          >
            {buttonText}
          </button>
        ) : (
          <button
            onClick={onClick}
            className="mt-6 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
          >
            {buttonText}
          </button>
        )}
      </div>
    );
  }
  
  export default FeatureCard;