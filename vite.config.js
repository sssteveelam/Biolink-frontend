import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // --- THÊM CẤU HÌNH TEST Ở ĐÂY ---
  test: {
    globals: true, // Cho phép dùng describe, it, expect toàn cục như Jest
    environment: "jsdom", // Sử dụng môi trường giả lập DOM
    setupFiles: "./src/setupTests.js", // Chỉ định file chạy setup trước khi test (bước tiếp theo)
    // Bạn có thể thêm cấu hình coverage nếu muốn xem test bao phủ bao nhiêu % code
    // coverage: {
    //   provider: 'v8', // hoặc 'istanbul'
    //   reporter: ['text', 'json', 'html'],
    // },
  },
});
