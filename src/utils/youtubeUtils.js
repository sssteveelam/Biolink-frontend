export default function getYoutubeVideoId(url) {
  if (!url || typeof url !== "string") return null;

  // --- THAY THẾ REGEX CŨ BẰNG REGEX NÀY ---
  const regExp =
    /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  // ---------------------------------------

  const match = url.match(regExp);

  // ID video YouTube thường có 11 ký tự (chữ cái, số, gạch dưới, gạch ngang)
  // Thay vì kiểm tra độ dài, mình sẽ trả về nhóm ký tự thứ 1 bắt được (chính là ID)
  return match ? match[1] : null;
}
