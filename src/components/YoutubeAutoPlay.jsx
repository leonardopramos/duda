import { useEffect, useMemo, useRef, useState } from "react";

/** Converte "mm:ss" | "hh:mm:ss" | number -> segundos */
function toSeconds(v) {
  if (v == null) return 0;
  if (typeof v === "number") return Math.max(0, Math.floor(v));
  const parts = String(v).split(":").map(n => parseInt(n || "0", 10));
  if (parts.some(isNaN)) return 0;
  if (parts.length === 1) return Math.max(0, parts[0]);
  if (parts.length === 2) return Math.max(0, parts[0] * 60 + parts[1]);
  return Math.max(0, parts[0] * 3600 + parts[1] * 60 + parts[2]); // hh:mm:ss
}

/**
 * Props:
 * - videoId: string
 * - play: boolean
 * - startAt?: number | "mm:ss" | "hh:mm:ss" (default "1:11")
 * - renderButton?: ({ onUnmute, visible }) => ReactNode
 */
export default function YouTubeAutoplay({
  videoId,
  play,
  startAt = "1:11", // ✅ começa em 1:11 por padrão
  renderButton,
}) {
  const hostRef = useRef(null);
  const playerRef = useRef(null);
  const [showUnmute, setShowUnmute] = useState(false);
  const startSeconds = useMemo(() => toSeconds(startAt), [startAt]);

  // Carrega a IFrame API do YouTube uma vez
  useEffect(() => {
    const tagId = "youtube-iframe-api";
    if (!document.getElementById(tagId)) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      tag.id = tagId;
      document.body.appendChild(tag);
    }
  }, []);

  // Cria o player somente depois do clique (play=true)
  useEffect(() => {
    if (!play) return;
    if (!hostRef.current) return;
    if (playerRef.current) return;

    const create = () => {
      if (playerRef.current) return;
      // eslint-disable-next-line no-undef
      playerRef.current = new YT.Player(hostRef.current, {
        videoId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          start: startSeconds, // 👉 pede ao YouTube iniciar no ponto
        },
        events: {
          onReady: (e) => {
            const p = e.target;
            try {
              // tenta iniciar com som
              p.unMute?.();
              p.setVolume?.(100);
              p.seekTo?.(startSeconds, true); // garante o ponto
              p.playVideo?.();
            } catch {}

            // após ~500ms, se não estiver tocando com som, força mute+play e mostra botão
            setTimeout(() => {
              try {
                const state = p.getPlayerState?.(); // 1 = PLAYING
                const muted = p.isMuted?.();
                const ct = p.getCurrentTime?.() || 0;
                if (state !== 1 || muted) {
                  p.mute?.();
                  p.seekTo?.(startSeconds, true);
                  p.playVideo?.();
                  setShowUnmute(true);
                } else {
                  // se tocou com som, só garante o ponto
                  if (Math.abs(ct - startSeconds) > 1) {
                    p.seekTo?.(startSeconds, true);
                  }
                  setShowUnmute(false);
                }
              } catch {
                try {
                  p.mute?.();
                  p.seekTo?.(startSeconds, true);
                  p.playVideo?.();
                } finally {
                  setShowUnmute(true);
                }
              }
            }, 500);
          },
          onStateChange: () => {
            // se estiver tocando com som, esconde botão
            try {
              const p = playerRef.current;
              if (!p) return;
              const muted = p.isMuted?.();
              const state = p.getPlayerState?.();
              if (state === 1 && !muted) setShowUnmute(false);
            } catch {}
          },
        },
      });
    };

    const onAPIReady = () => {
      if (window.YT && window.YT.Player) create();
    };

    if (window.YT && window.YT.Player) create();
    else window.onYouTubeIframeAPIReady = onAPIReady;
  }, [play, videoId, startSeconds]);

  // Pausa/retoma conforme `play`; ao retomar, volta exatamente ao ponto
  useEffect(() => {
    const p = playerRef.current;
    if (!p) return;
    try {
      if (play) {
        p.seekTo?.(startSeconds, true);
        p.playVideo?.();
      } else {
        p.pauseVideo?.();
      }
    } catch {}
  }, [play, startSeconds]);

  // Garante allow=autoplay no iframe
  useEffect(() => {
    const p = playerRef.current;
    if (!p) return;
    const iframe = p.getIframe?.();
    if (iframe) {
      try {
        const prev = iframe.getAttribute("allow") || "";
        if (!/autoplay/.test(prev)) {
          iframe.setAttribute(
            "allow",
            (prev ? prev + "; " : "") + "autoplay; encrypted-media"
          );
        }
      } catch {}
    }
  });

  const handleUnmute = () => {
    try {
      const p = playerRef.current;
      if (!p) return;
      p.unMute?.();
      p.setVolume?.(100);
      p.seekTo?.(startSeconds, true);
      p.playVideo?.();
      setShowUnmute(false);
    } catch {}
  };

  return (
    <>
      {/* iframe fora da tela, apenas para o áudio */}
      <div className="fixed -bottom-96 left-0 w-[320px] h-[180px] opacity-0 pointer-events-none select-none">
        <div ref={hostRef} className="w-full h-full" />
      </div>

      {/* botão customizável via render prop (aparece só se necessário) */}
      {play && showUnmute && (
        renderButton
          ? renderButton({ onUnmute: handleUnmute, visible: showUnmute })
          : (
            <button
              onClick={handleUnmute}
              className="fixed bottom-4 right-4 bg-white/20 hover:bg-white/30 text-white rounded-full p-2.5 shadow-lg backdrop-blur border border-white/20 z-50"
              aria-label="Ativar som"
              title="Ativar som"
            >
              Ativar som
            </button>
          )
      )}
    </>
  );
}
