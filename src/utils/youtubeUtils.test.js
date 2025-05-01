// src/utils/youtubeUtils.test.js
import { describe, it, expect } from "vitest"; // Import các hàm test từ vitest
import getYoutubeVideoId from "./youtubeUtils"; // Import hàm của bạn

describe("Hàm getYoutubeVideoId", () => {
  // Test case 1: URL chuẩn watch?v=
  it("nên trả về ID từ URL chuẩn (watch?v=)", () => {
    const url = "http://www.youtube.com/watch?v=dQw4w9WgXcQ";
    const expectedId = "dQw4w9WgXcQ";
    expect(getYoutubeVideoId(url)).toBe(expectedId); // Khẳng định kết quả phải bằng expectedId
  });

  // Test case 2: URL embed
  it("nên trả về ID từ URL nhúng (embed)", () => {
    const url = "http://www.youtube.com/embed/abcdefghijk";
    const expectedId = "abcdefghijk";
    expect(getYoutubeVideoId(url)).toBe(expectedId);
  });

  // Test case 3: URL có tham số khác
  it("nên trả về ID từ URL có tham số khác", () => {
    const url = "http://www.youtube.com/watch?v=xyz789&feature=youtu.be&t=10s";
    const expectedId = "xyz789";
    expect(getYoutubeVideoId(url)).toBe(expectedId);
  });

  // Test case 4: URL rút gọn (youtu.be) - Lưu ý quan trọng!
  it("nên trả về ID từ URL rút gọn (youtu.be)", () => {
    const url = "http://youtu.be/12345678901";
    const expectedId = "12345678901";
    // !!! Ghi chú: Regex hiện tại trong file youtubeUtils.js của bạn có thể chưa xử lý được dạng youtu.be này.
    // Nếu test case này FAIL, đó là dấu hiệu tốt cho thấy test đã phát hiện ra điểm cần cải thiện trong hàm gốc!
    // Bạn có thể sửa lại regex trong youtubeUtils.js rồi chạy lại test.
    // Hoặc nếu chưa muốn sửa, bạn có thể tạm mong đợi kết quả là null:
    // expect(getYoutubeVideoId(url)).toBeNull();
    // Nhưng lý tưởng nhất là sửa regex và mong đợi ID:
    expect(getYoutubeVideoId(url)).toBe(expectedId); // Giả sử bạn sẽ sửa regex
  });

  // Test case 5: URL không hợp lệ
  it("nên trả về null nếu URL không phải YouTube hoặc sai định dạng", () => {
    const url = "http://google.com/watch?v=dQw4w9WgXcQ";
    expect(getYoutubeVideoId(url)).toBeNull(); // Khẳng định kết quả phải là null
  });

  // Test case 6: URL không có video ID
  it("nên trả về null nếu URL không chứa video ID", () => {
    const url = "http://www.youtube.com/feed/subscriptions";
    expect(getYoutubeVideoId(url)).toBeNull();
  });

  // Test case 7: Input không phải string
  it("nên trả về null nếu đầu vào không phải là chuỗi", () => {
    expect(getYoutubeVideoId(null)).toBeNull();
    expect(getYoutubeVideoId(undefined)).toBeNull();
    expect(getYoutubeVideoId(12345)).toBeNull();
    expect(getYoutubeVideoId({})).toBeNull();
    expect(getYoutubeVideoId([])).toBeNull();
  });
});
