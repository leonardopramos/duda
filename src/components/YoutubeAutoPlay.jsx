import { useEffect, useRef, useState } from "react";

/**
 * Props:
 * - videoId, play
 * - renderButton?: ({ onUnmute, visible }) => ReactNode
 *   Se passado, usa este render para desenhar o botão onde você quiser.
 */
export default function YouTubeAutoplay({ videoId, play, renderButton }) {
  const hostRef = useRef(null);
  const playerRef = useRef(null);
  const [showUnmute, setShowUnmute] = useState(false);

  useEffect(() => {
    const tagId = "youtube-iframe-api";
    if (!document.getElementById(tagId)) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      tag.id = tagId;
      document.body.appendChild(tag);
    }
  }, []);

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
        },
        events: {
          onReady: (e) => {
            const p = e.target;
            try {
              p.unMute?.();
              p.setVolume?.(100);
              p.playVideo?.();
            } catch {}
            setTimeout(() => {
              try {
                const state = p.getPlayerState?.(); // 1 = PLAYING
                const muted = p.isMuted?.();
                if (state !== 1 || muted) {
                  p.mute?.();
                  p.playVideo?.();
                  setShowUnmute(true);
                } else {
                  setShowUnmute(false);
                }
              } catch {
                try { p.mute?.(); p.playVideo?.(); } finally { setShowUnmute(true); }
              }
            }, 500);
          },
          onStateChange: () => {
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
  }, [play, videoId]);

  useEffect(() => {
    const p = playerRef.current;
    if (!p) return;
    try {
      if (play) p.playVideo?.();
      else p.pauseVideo?.();
    } catch {}
  }, [play]);

  useEffect(() => {
    const p = playerRef.current;
    if (!p) return;
    const iframe = p.getIframe?.();
    if (iframe) {
      try {
        const prev = iframe.getAttribute("allow") || "";
        if (!/autoplay/.test(prev)) {
          iframe.setAttribute("allow", (prev ? prev + "; " : "") + "autoplay; encrypted-media");
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
      p.playVideo?.();
      setShowUnmute(false);
    } catch {}
  };

  return (
    <>
      {/* iframe fora da tela, só para o áudio */}
      <div className="fixed -bottom-96 left-0 w-[320px] h-[180px] opacity-0 pointer-events-none select-none">
        <div ref={hostRef} className="w-full h-full" />
      </div>

      {/* botão customizável via render prop */}
      {play && showUnmute && (
        renderButton
          ? renderButton({ onUnmute: handleUnmute, visible: showUnmute })
          : (
            <button
              onClick={handleUnmute}
              className="fixed bottom-4 right-4 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 shadow-lg backdrop-blur z-50"
            >
              🔊
            </button>
          )
      )}
    </>
  );
}
