export default function getYoutubeVideoId(url) {
  if (!url || typeof url !== "string") return null;
  // Regular expression magic
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  // YouTube ID usually has 11 characters
  return match && match[2].length === 11 ? match[2] : null;
}
