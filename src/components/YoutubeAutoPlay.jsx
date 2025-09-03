import { useEffect, useRef } from "react";

/**
 * Autoplay do YouTube vinculado ao gesto do usuário:
 * - Cria o player apenas quando `play` for true
 * - Tenta tocar com som; se o navegador bloquear, faz fallback para mute + play
 * - Não exibe nenhum botão de "ativar som"
 */
export default function YouTubeAutoplay({ videoId, play }) {
  const hostRef = useRef(null);
  const playerRef = useRef(null);

  // Carrega a API uma vez
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
    if (!play) return;                // ❗ só depois do clique
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
              // 1) tenta tocar COM som
              p.unMute?.();
              p.setVolume?.(100);
              p.playVideo?.();
            } catch {
              /* ignore */
            }

            // 2) checa após 400–600ms; se bloqueou, toca MUTED
            setTimeout(() => {
              try {
                const state = p.getPlayerState?.(); // 1=PLAYING
                const muted = p.isMuted?.();
                if (state !== 1 || muted) {
                  // garante que pelo menos toca em mute
                  p.mute?.();
                  p.playVideo?.();
                }
              } catch {
                // fallback mudo mesmo assim
                try {
                  p.mute?.();
                  p.playVideo?.();
                } catch {}
              }
            }, 500);
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

  // Se `play` voltar a false, pausa
  useEffect(() => {
    const p = playerRef.current;
    if (!p) return;
    try {
      if (play) {
        // reforça o play (caso tenha recriado o player)
        p.playVideo?.();
      } else {
        p.pauseVideo?.();
      }
    } catch {}
  }, [play]);

  // Ajuda alguns navegadores: garante 'allow=autoplay' no iframe assim que existir
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
  }, [playerRef.current]);

  return (
    <div className="fixed -bottom-96 left-0 w-[320px] h-[180px] opacity-0 pointer-events-none select-none">
      <div ref={hostRef} className="w-full h-full" />
    </div>
  );
}
