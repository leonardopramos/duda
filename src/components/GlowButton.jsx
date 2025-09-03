export default function GlowButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="relative px-10 py-4 text-lg font-semibold text-white rounded-full bg-gradient-to-r from-sky-400 to-sky-600 focus:outline-none transition"
      style={{
        boxShadow:
          "0 0 40px rgba(56,189,248,0.6), inset 0 0 12px rgba(255,255,255,0.25)",
      }}
    >
      <span className="relative z-10 tracking-wide drop-shadow-md">
        Clique aqui!
      </span>

      {/* halo suave atrás do botão */}
      <span className="pointer-events-none absolute -inset-10 rounded-full bg-sky-500/30 blur-3xl" />
    </button>
  );
}
