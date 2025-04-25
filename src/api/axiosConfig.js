// src/api/axiosConfig.js
import axios from "axios";

// Lấy URL gốc của API backend từ biến môi trường VITE_API_BASE_URL
// Có fallback về localhost:3001 nếu biến môi trường không được set (dùng khi chạy dev local)
const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

// Log ra để kiểm tra xem nó lấy đúng URL không (quan trọng khi debug)
console.log(">>> API Base URL being used:", baseURL);

// Tạo một instance axios với cấu hình mặc định
const api = axios.create({
  baseURL: baseURL, // Đặt URL gốc cho mọi request dùng instance 'api' này
  headers: {
    "Content-Type": "application/json", // Mặc định gửi JSON
  },
  // Bạn có thể thêm các cấu hình mặc định khác ở đây nếu cần
});

// --- PHẦN NÂNG CAO: TỰ ĐỘNG GẮN TOKEN ---
// Mình sẽ làm phần này sau khi mọi thứ chạy ổn đã nhé!
// Đoạn code này (interceptor) sẽ tự động lấy token từ localStorage
// và gắn vào header 'Authorization' cho các request cần bảo vệ.
// Sau khi có nó, bạn sẽ không cần tạo `config` thủ công trong mỗi lần gọi API nữa.

api.interceptors.request.use(
  (config) => {
    // Xác định các route không cần token
    const publicRoutes = [
      "/api/auth/login",
      "/api/auth/register",
      "/api/profiles/",
    ]; // Thêm /api/profiles/ để trang public không cần token
    
    const isPublicRoute = publicRoutes.some((route) =>
      config.url.startsWith(route)
    );

    console.log(
      `>>> Interceptor: Request to ${config.url}. Is public? ${isPublicRoute}`
    );

    // Nếu không phải public route thì mới gắn token
    if (!isPublicRoute) {
      const token = localStorage.getItem("authToken");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
        console.log(">>> Interceptor: Token added for", config.url);
      } else {
        console.warn(
          ">>> Interceptor: No token found for protected route:",
          config.url
        );
      }
    }
    return config; // Luôn trả về config để request được đi tiếp
  },
  (error) => {
    // Xử lý lỗi trong quá trình chuẩn bị request (ít xảy ra)
    console.error(">>> Axios Interceptor Request Error:", error);
    return Promise.reject(error);
  }
);

export default api; // Xuất ra instance đã cấu hình
