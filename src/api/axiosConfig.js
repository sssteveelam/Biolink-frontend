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

/*
// --- PHẦN NÂNG CAO: TỰ ĐỘNG GẮN TOKEN ---
// Mình sẽ làm phần này sau khi mọi thứ chạy ổn đã nhé!
// Đoạn code này (interceptor) sẽ tự động lấy token từ localStorage
// và gắn vào header 'Authorization' cho các request cần bảo vệ.
// Sau khi có nó, bạn sẽ không cần tạo `config` thủ công trong mỗi lần gọi API nữa.

api.interceptors.request.use(
    (config) => {
        // Chỉ thêm token nếu request không phải là tới trang login/register
        const nonAuthRoutes = ['/api/auth/login', '/api/auth/register'];
        const requiresAuth = !nonAuthRoutes.some(route => config.url.includes(route));

        if (requiresAuth) {
            const token = localStorage.getItem('authToken');
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
                console.log('>>> Token added to request header for:', config.url);
            } else {
                 console.log('>>> No token found for protected route:', config.url);
            }
        } else {
             console.log('>>> Public route, no token added for:', config.url);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
*/

export default api; // Xuất ra instance đã cấu hình
