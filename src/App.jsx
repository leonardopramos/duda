import { useEffect, useState } from "react";
import GlowButton from "./components/GlowButton.jsx";
import Carousel from "./components/Carousel.jsx";
import YouTubeAutoplay from "./components/YoutubeAutoPlay.jsx";
import { CONFIG } from "./config.js";
import { useTicker } from "./lib/time.js";
import { Volume2 } from "lucide-react";

export default function App() {
  const [started, setStarted] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [track, setTrack] = useState(null);
  const diff = useTicker(CONFIG.startDate);

  const handleStart = () => {
    const list = CONFIG.youtubePlaylist || [];
    if (list.length > 0) {
      const pick = list[Math.floor(Math.random() * list.length)];
      setTrack(pick);
    }
    setFadeOut(true);
    setTimeout(() => setStarted(true), 350);
  };

  useEffect(() => {
    document.body.style.touchAction = "manipulation";
    return () => (document.body.style.touchAction = "");
  }, []);

  if (!started) {
    return (
      <div
        className={`min-h-screen w-full bg-[#0d141a] text-white flex items-center justify-center p-6 transition-opacity ${
          fadeOut ? "opacity-0" : "opacity-100"
        }`}
      >
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
      <main className="w-full max-w-6xl mx-auto flex flex-col items-center">
        <div className="w-full max-w-[780px] mx-auto relative">
          <Carousel images={CONFIG.images} />
          {track && (
            <YouTubeAutoplay
              videoId={track.id}
              play={started}
              startAt={track.startAt}
              renderButton={({ onUnmute }) => (
                <button
                  onClick={onUnmute}
                  className="absolute top-3 right-3 z-50 bg-white/20 hover:bg-white/30 text-white rounded-full p-2.5 shadow-lg backdrop-blur border border-white/20"
                  aria-label="Ativar som"
                  title="Ativar som"
                >
                  <Volume2 size={20} />
                </button>
              )}
            />
          )}
        </div>
        <h1 className="mt-8 text-2xl md:text-3xl font-semibold text-center">
          {CONFIG.title}
        </h1>
        <div className="mt-4 inline-flex items-center justify-center text-sm md:text-base px-5 py-3 rounded-2xl bg-white/5 border border-white/10 text-white/90">
          {diff.months} meses, {diff.days} dias, {diff.hours} horas, {diff.minutes} minutos e {diff.seconds} segundos
        </div>
        <p className="max-w-3xl text-center mt-8 text-white/80 leading-relaxed italic">
          {CONFIG.message}
        </p>
      </main>
    </div>
  );
}
