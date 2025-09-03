import { useEffect, useState } from "react";
import GlowButton from "./components/GlowButton.jsx";
import Carousel from "./components/Carousel.jsx";
import YouTubeAutoplay from "./components/YoutubeAutoPlay.jsx";
import { CONFIG } from "./config.js";
import { useTicker } from "./lib/time.js";

export default function App() {
  const [started, setStarted] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const diff = useTicker(CONFIG.startDate);

  const handleStart = () => {
    setFadeOut(true);
    setTimeout(() => setStarted(true), 350);
  };

  useEffect(() => {
    document.body.style.touchAction = "manipulation";
    return () => (document.body.style.touchAction = "");
  }, []);

  if (!started) {
    return (
      <div className="min-h-screen w-full bg-[#0d141a] text-white flex items-center justify-center p-6 animate-fadeIn">
        <div className="text-center space-y-10">
          <h1 className="text-3xl md:text-4xl font-semibold">
            Pronta para começar Duda? ✨
          </h1>
          <GlowButton onClick={handleStart} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d141a] text-white flex items-center justify-center p-6 animate-fadeIn">
      {/* Música começa após o clique */}
      <YouTubeAutoplay videoId={CONFIG.youtubeVideoId} play={started} />

      <main className="w-full max-w-6xl mx-auto flex flex-col items-center">
        {/* Carrossel central */}
        <Carousel images={CONFIG.images} />

        {/* Título fixo */}
        <h1 className="mt-8 text-2xl md:text-3xl font-semibold text-center">
          {CONFIG.title}
        </h1>

        {/* Contador */}
        <div className="mt-4 inline-flex items-center justify-center text-sm md:text-base px-5 py-3 rounded-2xl bg-white/5 border border-white/10 text-white/90">
          {diff.months} meses, {diff.days} dias, {diff.hours} horas,{" "}
          {diff.minutes} minutos e {diff.seconds} segundos
        </div>

        {/* Frase — tipografia diferente */}
        <p className="max-w-3xl text-center mt-8 text-white/80 leading-relaxed italic">
          {CONFIG.message}
        </p>
      </main>
    </div>
  );
}
