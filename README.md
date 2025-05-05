# Biolink App - Backend

Phần backend cho ứng dụng Biolink, xây dựng bằng Node.js, Express và MongoDB. Cung cấp API để quản lý người dùng, profile, liên kết và hiển thị trang profile công khai.

## Tính năng chính

* **Xác thực người dùng:** Đăng ký, đăng nhập bằng JWT (JSON Web Token), lấy thông tin người dùng hiện tại (`/me`).
* **Quên/Đặt lại mật khẩu:** Hỗ trợ quy trình đặt lại mật khẩu qua email xác thực.
* **Quản lý Profile:** Cập nhật thông tin cá nhân (bio), tùy chỉnh giao diện (màu nền, màu chữ, kiểu nút, theme có sẵn).
* **Upload Avatar:** Tải ảnh đại diện lên Cloudinary.
* **Quản lý Liên kết:** Thêm, sửa, xóa, lấy danh sách liên kết.
* **Sắp xếp Liên kết:** Thay đổi thứ tự hiển thị các liên kết (Drag and Drop ở frontend).
* **Theo dõi Click:** Ghi nhận số lượt click cho mỗi liên kết.
* **API Public Profile:** Cung cấp dữ liệu cần thiết để hiển thị trang profile công khai dựa trên username.

## Công nghệ sử dụng

* **Node.js:** Môi trường chạy JavaScript phía server.
* **Express:** Framework web cho Node.js.
* **MongoDB:** Cơ sở dữ liệu NoSQL để lưu trữ dữ liệu.
* **Mongoose:** ODM (Object Data Modeling) cho MongoDB, giúp định nghĩa schema và tương tác DB dễ dàng hơn.
* **JSON Web Token (jsonwebtoken):** Tạo và xác thực token cho việc đăng nhập.
* **bcrypt:** Thư viện mã hóa mật khẩu.
* **dotenv:** Quản lý biến môi trường.
* **Nodemailer:** Gửi email (ví dụ: cho chức năng đặt lại mật khẩu).
* **Cloudinary:** Dịch vụ lưu trữ và quản lý hình ảnh (cho avatar).
* **Multer:** Middleware xử lý file upload (cho avatar).
* **cors:** Xử lý Cross-Origin Resource Sharing.
* **express-rate-limit:** Giới hạn số lượng request để bảo vệ API.
* **Jest & Supertest:** Thư viện kiểm thử (testing) API (cơ bản).

## Bắt đầu

Hướng dẫn cài đặt và chạy backend trên máy local.

**Yêu cầu:**

* Node.js (phiên bản được ghi trong `package.json`, ví dụ: v18 hoặc v20)
* npm hoặc yarn
* MongoDB Server đang chạy (local hoặc trên cloud như MongoDB Atlas)
* Tài khoản Cloudinary (để lấy API keys)
* Tài khoản Email (ví dụ: Gmail với App Password) để gửi mail (nếu dùng Nodemailer với Gmail)

**Các bước cài đặt:**

1.  **Clone Repository (Nếu có):**
    ```bash
    git clone <your-repo-url>
    cd Biolink-backend
    ```
2.  **Cài đặt Dependencies:**
    ```bash
    npm install
    # hoặc
    yarn install
    ```
3.  **Tạo file `.env`:**
    Tạo một file tên là `.env` ở thư mục gốc (`Biolink-backend`) và thêm các biến môi trường cần thiết. Tham khảo ví dụ sau:

    ```dotenv
    # Server Port
    PORT=3001

    # MongoDB Connection String
    DATABASE_URL=mongodb://localhost:27017/biolink_db # Thay bằng URL MongoDB của bạn

    # JSON Web Token
    JWT_SECRET=your_super_secret_jwt_key_here # Thay bằng một chuỗi bí mật mạnh
    # JWT_EXPIRES_IN=1h # (Tùy chọn) Thời gian hết hạn token

    # Frontend URL (Quan trọng cho CORS và Link Reset Password)
    FRONTEND_URL=http://localhost:5173 # Địa chỉ frontend của bạn

    # Cloudinary Credentials (Cho Avatar Upload)
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret

    # Email Configuration (Ví dụ dùng Gmail - Xem hướng dẫn lấy App Password)
    # Nên dùng dịch vụ chuyên nghiệp cho production
    EMAIL_HOST=smtp.gmail.com
    EMAIL_PORT=587
    EMAIL_USERNAME=your_email@gmail.com
    EMAIL_PASSWORD=your_gmail_app_password_16_chars # Mật khẩu ứng dụng, không phải mật khẩu Gmail
    EMAIL_FROM_NAME="Tên ứng dụng Biolink"
    EMAIL_FROM_ADDRESS=your_email@gmail.com
    ```

4.  **Chạy Development Server:**
    ```bash
    npm run dev
    ```
    Server sẽ khởi động (thường ở cổng 3001) và tự khởi động lại khi có thay đổi code nhờ `nodemon`.

5.  **Chạy Tests (Nếu có):**
    ```bash
    npm test
    ```

## API Endpoints chính

* **Auth:**
    * `POST /api/auth/register`: Đăng ký người dùng mới.
    * `POST /api/auth/login`: Đăng nhập, trả về token.
    * `GET /api/auth/me`: (Protected) Lấy thông tin người dùng đang đăng nhập.
    * `POST /api/auth/forgot-password`: Gửi yêu cầu đặt lại mật khẩu.
    * `POST /api/auth/reset-password/:token`: Đặt lại mật khẩu bằng token.
* **Profile:**
    * `GET /api/user/profile/me`: (Protected) Lấy profile của người dùng đang đăng nhập.
    * `PUT /api/user/profile/me`: (Protected) Cập nhật/tạo profile (bio, theme, style...).
* **User:**
    * `PUT /api/user/avatar`: (Protected) Upload ảnh đại diện.
* **Links:**
    * `GET /api/user/links`: (Protected) Lấy tất cả link của người dùng.
    * `POST /api/user/links`: (Protected) Tạo link mới.
    * `PUT /api/user/links/reorder`: (Protected) Cập nhật thứ tự links.
    * `PUT /api/user/links/:linkId`: (Protected) Cập nhật một link cụ thể.
    * `DELETE /api/user/links/:linkId`: (Protected) Xóa một link.
    * `POST /api/user/links/:linkId/click`: (Public) Ghi nhận lượt click cho link.
* **Public Profile:**
    * `GET /api/profiles/:username`: (Public) Lấy thông tin công khai (user, profile, links) của một username.

## Cấu trúc thư mục (Ví dụ)

Biolink-backend/
├── tests/          # Chứa các file test
├── middleware/        # Chứa các middleware (vd: authMiddleware.js)
├── models/            # Định nghĩa Mongoose Schemas (User.js, Profile.js, Link.js)
├── routes/            # Định nghĩa các API routes
│   └── api/           # Routes cho API (auth.js, profile.js, links.js, ...)
├── utils/             # Các hàm tiện ích (vd: email.js)
├── .env               # File biến môi trường (QUAN TRỌNG: Không commit!)
├── .gitignore         # Các file/folder bỏ qua khi commit
├── index.js           # Điểm khởi chạy server (chỉ gọi app từ server.js)
├── server.js          # Khởi tạo Express app, middleware, routes, kết nối DB
├── package.json       # Thông tin dự án và dependencies
└── package-lock.json  # Khóa phiên bản dependencies


---

### README cho Frontend (`Biolink-frontend/README.md`)

```markdown
# Biolink App - Frontend

Giao diện người dùng cho ứng dụng Biolink, xây dựng bằng React, Vite và Tailwind CSS. Cho phép người dùng đăng ký, đăng nhập, quản lý trang Biolink cá nhân và xem trang public của người khác.

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

## Cấu trúc thư mục :
![image](https://github.com/user-attachments/assets/20496ad3-5d5d-48a1-af93-4a57ce03b8be)
