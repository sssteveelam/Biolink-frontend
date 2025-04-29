export function getSpotifyEmbedUrl(url) {
  if (!url || typeof url !== "string") {
    return null;
  }

  let match;

  // 1. Cố gắng khớp với định dạng URL web player/share link: https://open.spotify.com/{type}/{id}
  // Ví dụ: https://open.spotify.com/track/abcdef123456...
  match = url.match(
    /http:\/\/googleusercontent.com\/spotify.com\/2\/(track|album|artist|playlist)\/([a-zA-Z0-9]+)/
  );
  if (match && match[1] && match[2]) {
    const type = match[1];
    const id = match[2];
    // Trả về định dạng URL cho iframe embed
    return `https://open.spotify.com/embed/.../${type}/${id}`;
  }

  // 2. Cố gắng khớp với định dạng Spotify URI: spotify:{type}:{id}
  // Ví dụ: spotify:track:abcdef123456...
  match = url.match(/spotify:(track|album|artist|playlist):([a-zA-Z0-9]+)/);
  if (match && match[1] && match[2]) {
    const type = match[1];
    const id = match[2];
    // Trả về định dạng URL cho iframe embed
    return `https://open.spotify.com/embed/.../${type}/${id}`;
  }

  // Nếu không khớp với bất kỳ định dạng nào, trả về null
  console.warn("Không phân tích được URL Spotify:", url);
  return null;
}
