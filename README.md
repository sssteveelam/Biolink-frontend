### Frontend (`Biolink-frontend/README.md`)


# Biolink App - Frontend

Giao diện người dùng cho ứng dụng Biolink, xây dựng bằng React, Vite và Tailwind CSS. Cho phép người dùng đăng ký, đăng nhập, quản lý trang Biolink cá nhân và xem trang public của người khác.

## Live demo : https://biolink-fast.vercel.app/


## Hình ảnh các trang :
* **Trang chủ:**
![image](https://github.com/user-attachments/assets/51bc7654-65c5-4a19-acff-8f042536327e)
* **Dashboard:**
![image](https://github.com/user-attachments/assets/44d85fbe-176e-42af-8a6d-30a688a3cca5)

* **Test User:**
![image](https://github.com/user-attachments/assets/0af297b2-87d0-4276-97dd-dc07b08f6226)

## Tính năng chính

* **Giao diện Hiện đại:** Sử dụng Tailwind CSS với các hiệu ứng gradient, thủy tinh mờ (glassmorphism).
* **Responsive Design:** Giao diện được tối ưu hóa để hiển thị tốt trên nhiều kích thước màn hình (mobile, tablet, desktop).
* **Routing:** Điều hướng giữa các trang bằng `react-router-dom`.
* **Xác thực:** Các trang Đăng nhập, Đăng ký, Quên/Đặt lại mật khẩu. Có `ProtectedRoute` để bảo vệ trang Dashboard.
* **Quản lý State:** Sử dụng `AuthContext` để quản lý trạng thái đăng nhập global.
* **Trang chủ (Landing Page):** Giới thiệu ứng dụng, tính năng và kêu gọi hành động, có hiệu ứng nền 3D (Three.js).
* **Dashboard:**
    * **Cài đặt Profile:** Form chỉnh sửa Bio, chọn Màu nền, Màu chữ, Kiểu nút, chọn Theme có sẵn (với preview), Upload Avatar.
    * **Quản lý Links:** Form thêm link mới (hỗ trợ link thường, nhúng YouTube/Spotify, chọn icon nền tảng), danh sách link hiện có, hỗ trợ **kéo thả (Drag & Drop)** để sắp xếp, sửa/xóa từng link.
* **Trang Public Profile:** Hiển thị thông tin người dùng (avatar, tên, bio), danh sách link (có icon/nhúng nội dung), áp dụng **theme (màu/gradient/ảnh nền) và màu chữ** do người dùng tùy chỉnh.
* **Chức năng Chia sẻ:** Tích hợp trên trang Public Profile, cho phép xem/sao chép link, xem/tải mã QR.
* **Thông báo:** Sử dụng `react-hot-toast` để hiển thị thông báo feedback cho người dùng.
* **Icons:** Sử dụng `lucide-react` cho bộ icon nhất quán.

## Công nghệ sử dụng

* **React:** Thư viện JavaScript để xây dựng giao diện người dùng.
* **Vite:** Công cụ build frontend thế hệ mới, nhanh và hiệu quả.
* **Tailwind CSS:** Framework CSS utility-first để xây dựng giao diện nhanh chóng.
* **React Router DOM:** Thư viện routing cho ứng dụng React.
* **Axios:** Thư viện để thực hiện các request API đến backend.
* **React Context API:** Quản lý trạng thái đăng nhập global.
* **@dnd-kit:** Bộ thư viện kéo thả hiện đại cho React (dùng trong LinkManager).
* **qrcode.react:** Thư viện tạo mã QR code.
* **react-hot-toast:** Thư viện hiển thị thông báo toast đẹp mắt.
* **lucide-react:** Bộ thư viện icon SVG.
* **Three.js, @react-three/fiber, @react-three/drei:** Tích hợp và hiển thị đồ họa 3D (cho background trang chủ).
* **Vitest:** Framework kiểm thử cho Vite (thiết lập cơ bản).

## Bắt đầu

Hướng dẫn cài đặt và chạy frontend trên máy local.

**Yêu cầu:**

* Node.js (phiên bản tương thích với Vite, ví dụ: v18 hoặc v20)
* npm hoặc yarn
* **Backend Server phải đang chạy** (vì frontend cần gọi API).

**Các bước cài đặt:**

1.  **Clone Repository (Nếu có):**
    ```bash
    git clone <your-repo-url>
    cd Biolink-frontend
    ```
2.  **Cài đặt Dependencies:**
    ```bash
    npm install
    # hoặc
    yarn install
    ```
3.  **Tạo file `.env` (Tùy chọn nhưng khuyến khích):**
    Tạo một file tên là `.env` ở thư mục gốc (`Biolink-frontend`) để định nghĩa địa chỉ API backend.

    ```dotenv
    # Địa chỉ API Backend (Trỏ đến server backend đang chạy)
    VITE_API_BASE_URL=http://localhost:3001

    # (Tùy chọn) Địa chỉ cơ sở cho trang Public Profile nếu khác domain
    # VITE_PUBLIC_PROFILE_BASE_URL=http://yourdomain.com
    ```
    *(File `axiosConfig.js` đã có fallback về `http://localhost:3001` nếu biến này không được đặt)*

4.  **Chạy Development Server:**
    ```bash
    npm run dev
    ```
    Ứng dụng React sẽ khởi động (thường ở cổng 5173) và tự động cập nhật khi bạn sửa code.

5.  **Chạy Tests (Nếu có):**
    ```bash
    npm run test
    # hoặc
    npm run test -- --ui # Để mở giao diện Vitest UI
    ```

## Cấu trúc thư mục:
![image](https://github.com/user-attachments/assets/fe91031b-0f67-4112-b88d-61ececddfd84)

