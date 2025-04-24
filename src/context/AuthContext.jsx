import React, { createContext, useState, useEffect } from "react";
import api from "../api/axiosConfig";
// 1. Tạo Context Object
// Giá trị mặc định là null hoặc một object có cấu trúc tương tự state ban đầu
export const AuthContext = createContext(null);

// 2. Tạo Provider Component
export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: null,
    user: null, // Sẽ lưu thông tin user ở đây
    isAuthenticated: false,
    isLoading: true, // Ban đầu sẽ kiểm tra trạng thái đăng nhập
  });

  const verifyTokenOnLoad = async () => {
    console.log("AuthProvider mounted, checking local storage...");
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      console.log("Token found in local storage:", storedToken);
      // *** Tạm thời: Nếu có token thì coi như đã đăng nhập ***
      // Lý tưởng nhất là phải gửi token này lên backend để xác thực
      // và lấy lại thông tin user mới nhất (sẽ làm sau)
      // Ở đây mình chưa có thông tin user, chỉ biết là có token
      // ---------------------------------
      // *** Bước quan trọng: Gửi token lên backend để xác thực ***
      try {
        // cấu hình để gửi tokenb trong header Authorization
        const config = {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        };

        // Gọi API GET /api/auth/me
        console.log("AuthProvider: Verifying token with /api/auth/me...");
        // URL API backend
        const response = await api.get("/api/auth/me", config);

        // Nếu request thành công (backend trả về 200 OK và user data)
        setAuthState({
          token: storedToken,
          user: response.data, // Tạm thời chưa có thông tin user khi chỉ load từ token
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
        // Nếu request lỗi (token hết hạn, không hợp lệ, lỗi mạng...)
        console.error(
          "AuthProvider: Token verification failed:",
          error.response ? error.response.data : error.message
        );
        localStorage.removeItem("authToken"); // Xóa token không hợp lệ khỏi localStorage
        setAuthState({
          // Đặt lại trạng thái chưa đăng nhập
          token: null,
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } else {
      console.log("No token found in local storage.");
      // Nếu không có token, set trạng thái chưa đăng nhập
      setAuthState({
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false, // Đã kiểm tra xong
      });
    }
  };

  // useEffect này sẽ chạy 1 lần duy nhất khi component mount
  // Mục đích: Kiểm tra xem có token trong localStorage không khi tải lại trang
  useEffect(() => {
    // Định nghĩa một hàm async bên trong để có thể dùng await
    verifyTokenOnLoad();
  }, []); // Mảng dependency rỗng đảm bảo chỉ chạy 1 lần

  // Hàm để gọi khi đăng nhập thành công
  const login = (token, userData) => {
    console.log("Login function called in AuthContext");
    localStorage.setItem("authToken", token); // Lưu token
    setAuthState({
      // Cập nhật state
      token: token,
      user: userData,
      isAuthenticated: true,
      isLoading: false,
    });
  };

  // Hàm để gọi khi đăng xuất
  const logout = () => {
    console.log("Logout function called in AuthContext");
    localStorage.removeItem("authToken"); // Xóa token
    setAuthState({
      // Reset state
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    // Có thể thêm navigate về trang login ở đây nếu muốn
  };

  // Giá trị mà Context Provider sẽ cung cấp cho các component con
  const value = {
    authState, // Trạng thái hiện tại (token, user, isAuthenticated, isLoading)
    login, // Hàm để thực hiện login
    logout, // Hàm để thực hiện logout
  };

  // Chỉ render children khi không còn trong trạng thái loading ban đầu
  // Điều này tránh việc trang bị "nháy" giữa trạng thái chưa đăng nhập và đã đăng nhập
  return (
    <AuthContext.Provider value={value}>
      {!authState.isLoading && children}
    </AuthContext.Provider>
  );
};
