import { useEffect, useState } from "react";

export default function Carousel({ images = [] }) {
  const [index, setIndex] = useState(0);
  const len = images.length;

  const next = () => setIndex((i) => (i + 1) % len);
  const prev = () => setIndex((i) => (i - 1 + len) % len);

  useEffect(() => {
    if (len <= 1) return;
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [len]);

  if (!len) return null;

  return (
    <div className="w-full max-w-[780px] mx-auto select-none">
      {/* A borda arredondada e o overflow-hidden estão NO MESMO ELEMENTO */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-black/20">
        {/* Altura para foto em pé */}
        <div className="relative w-full h-[80vh] max-h-[960px] min-h-[520px]">
          {images.map((src, i) => (
            <div
              key={src + i}
              className={`absolute inset-0 transition-opacity duration-700 ${
                i === index ? "opacity-100" : "opacity-0"
              } pointer-events-none overflow-hidden rounded-3xl`}
              // reforço para Safari/WebKit: clip-path com mesmo raio ~ rounded-3xl (1.5rem)
              style={{ clipPath: "inset(0 round 1.5rem)" }}
            >
              {/* Fundo borrado – fica CLIPADO pelo overflow/clip-path acima */}
              <img
                src={src}
                alt=""
                className="absolute inset-0 w-full h-full object-cover blur-2xl scale-110 opacity-30"
                aria-hidden
                draggable={false}
              />

              {/* Foto principal SEM recorte/corte, sempre dentro da moldura */}
              <div className="relative z-10 w-full h-full flex items-center justify-center">
                <img
                  src={src}
                  alt="memória"
                  className="max-h-full max-w-full object-contain drop-shadow-2xl"
                  draggable={false}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Controles sobre o slide (com z-index alto e pointer-events) */}
        {len > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur px-3 py-2 text-white text-lg z-40 pointer-events-auto"
              aria-label="Anterior"
            >
              ‹
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur px-3 py-2 text-white text-lg z-40 pointer-events-auto"
              aria-label="Próxima"
            >
              ›
            </button>
          </>
        )}
      </div>

      {/* Dots */}
      {len > 1 && (
        <div className="flex items-center justify-center gap-2 mt-3 z-40">
          {images.map((_, i) => (
            <div
              key={i}
              onClick={() => setIndex(i)}
              className={`h-2 w-2 rounded-full cursor-pointer transition-all ${
                i === index ? "bg-white/90 w-4" : "bg-white/40"
              }`}
              aria-label={`Ir para slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
