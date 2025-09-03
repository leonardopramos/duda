// src/config.js

// Carrega automaticamente todas as imagens .jpg/.jpeg/.png em src/assets/photos
// Dica: em Linux o sistema é case-sensitive; se tiver .JPG/.PNG, inclua as variações:
const images = Object.values(
  import.meta.glob("/src/assets/photos/*.{jpg,jpeg,png,JPG,JPEG,PNG}", {
    eager: true,
    import: "default",
  })
);

export const CONFIG = {
  // 👉 data/horário da primeira vez que ficaram (com fuso)
  startDate: "2025-04-10T23:50:00-03:00",

  // título fixo
  title: "Nossa história começou há",

  // frase personalizada (estilo diferente)
message: `Eu te amo com toda minha verdade, Duda. Ao teu lado descobri não só a melhor versão de mim, mas também o quanto a vida pode ser leve, doce e cheia de sentido. 
Cada instante contigo é um presente, cada sorriso teu ilumina meus dias e cada abraço me faz sentir que encontrei meu lugar no mundo. 
Quero caminhar contigo em todos os capítulos que ainda vamos escrever, porque nada faz mais sentido do que viver essa história de amor contigo.`,

  // ✅ Agora as fotos entram no CONFIG
  images,

  // música
  youtubeVideoId: "4zAThXFOy2c",
};
