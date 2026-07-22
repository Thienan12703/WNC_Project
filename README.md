# 🏸 SMASHPRO - E-Commerce Badminton Shop (MERN Stack)

> **Đồ Án Môn Học:** Lập Trình Web Nâng Cao  
> **Kiến trúc ứng dụng:** MERN Stack (MongoDB, ExpressJS, ReactJS, NodeJS)  
> **Phong cách thiết kế:** Modern Dark / Neon Green Accent (Tối ưu hóa UI/UX cho cả PC & Mobile)

---

## 📌 1. Giới Thiệu Dự Án

**SMASHPRO** là một hệ thống thương mại điện tử chuyên cung cấp dụng cụ thể thao cầu lông (vợt, giày, phụ kiện, balo/túi vợt) kết hợp với trang tin tức tin tức thể thao. Dự án đáp ứng đầy đủ yêu cầu cho cả người dùng mua sắm lẫn quản trị viên (Admin) quản lý cửa hàng.

---

## 🔥 2. Các Tính Năng Chính

### 🛒 Dành cho Người Dùng (Client / Customer):
- **Trang chủ tĩnh & động:** Banner slider thương hiệu, sản phẩm nổi bật (Hot Products), hiệu ứng cầu lông rơi sinh động.
- **Danh mục & Lọc sản phẩm:** Lọc theo loại sản phẩm (Vợt, Giày...), thương hiệu, mức giá, hỗ trợ hiển thị phân trang.
- **Chi tiết sản phẩm:** Xem bộ sưu tập hình ảnh, thông số kỹ thuật, đánh giá & nhận xét (Review/Rating).
- **Giỏ hàng & Thanh toán:** Quản lý số lượng giỏ hàng realtime, áp dụng **Mã giảm giá (Coupon)**, đặt hàng với địa chỉ giao hàng và phương thức thanh toán.
- **Quản lý đơn hàng:** Theo dõi trạng thái đơn hàng (Đang xử lý, Đã giao, Hủy đơn...).
- **Trang bài viết / Tin tức:** Đọc bài viết chia sẻ kinh nghiệm chọn vợt, kỹ thuật chơi cầu lông.

### 🛡️ Dành cho Quản Trị Viên (Admin Panel):
- **Dashboard Tổng quan:** Thống kê doanh thu, tổng số đơn hàng, sản phẩm và khách hàng.
- **Quản lý Sản phẩm (CRUD):** Thêm/Sửa/Xóa sản phẩm, tải lên nhiều ảnh (upload), đánh dấu sản phẩm Hot.
- **Quản lý Danh mục (CRUD):** Thêm và quản lý các danh mục hàng hóa.
- **Quản lý Đơn hàng:** Cập nhật trạng thái đơn hàng (Pending, Processing, Completed, Cancelled).
- **Quản lý Bài viết (Blog Admin):** Soạn thảo bài viết Rich Text với công cụ tạo định dạng văn bản & chèn ảnh inline trực tiếp vào nội dung.
- **Quản lý Banner & Mã giảm giá:** Tùy biến các slide quảng cáo trang chủ và tạo mã voucher giảm giá theo %.

---

## 🛠️ 3. Công Nghệ Sử Dụng

### 🔹 Front-End:
- **ReactJS (Vite)** + React Router DOM v6
- **Zustand** (Quản lý State giỏ hàng & thông tin người dùng)
- **Tailwind CSS v4** + Custom Design Tokens (Neon Green `#39ff14`, Surface Dark `#111111`)
- **Lucide React** (Bộ icon tối giản)
- **Axios** (Hỗ trợ Interceptor gắn JWT Token tự động)

### 🔹 Back-End:
- **NodeJS & ExpressJS Framework**
- **MongoDB & Mongoose ODM** (Schema, Validation, Indexing)
- **JWT (JSON Web Token)** & **BcryptJS** (Bảo mật & Phân quyền Auth / Admin Middleware)
- **Multer** (Xử lý Upload hình ảnh)

---

## 🗂️ 4. Cấu Trúc Thư Mục Dự Án

```text
badminton-shop-mern/
├── backend/
│   ├── config/          # Cấu hình kết nối DB (db.js)
│   ├── controllers/     # Xử lý logic từng tính năng (Product, Order, Post...)
│   ├── middleware/      # Auth & Admin authorization middleware
│   ├── models/          # Mongoose Schema (User, Product, Order, Post, Category...)
│   ├── routes/          # Express API endpoints
│   ├── uploads/         # Lưu trữ ảnh upload
│   ├── seeder.js        # File seed dữ liệu mẫu & khởi tạo tài khoản Admin
│   └── server.js        # Entry point của Backend server
└── frontend/
    ├── src/
    │   ├── api/         # Axios instance cấu hình baseURL
    │   ├── components/  # Header, Footer, ProtectedRoute, ToastProvider...
    │   ├── pages/       # Các trang Client & Admin (Home, ProductList, AdminPosts...)
    │   ├── stores/      # Zustand store (cartStore, userStore)
    │   ├── App.jsx      # Định tuyến chính
    │   └── index.css    # Design System & Tailwind import
    └── vite.config.js
```

---

## 🚀 5. Hướng Dẫn Cài Đặt & Chạy Môi Trường Local

### Yêu cầu tiên quyết:
- **Node.js** (Phiên bản 18+)
- **MongoDB** (Local MongoDB Server hoặc MongoDB Atlas URI)

### Các bước cài đặt:

1. **Clone repository:**
   ```bash
   git clone https://github.com/Thienan12703/WNC_Project.git
   cd WNC_Project/badminton-shop-mern
   ```

2. **Cài đặt & Khởi chạy Backend:**
   ```bash
   cd backend
   npm install
   ```
   *Tạo file `.env` trong thư mục `backend`:*
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/badminton-shop
   JWT_SECRET=badminton_secret_key_2026
   ```
   *Seed dữ liệu mẫu & Tạo tài khoản Admin:*
   ```bash
   node seeder.js
   ```
   *Khởi chạy server backend:*
   ```bash
   node server.js
   ```
   *(Backend sẽ chạy tại: `http://localhost:5000`)*

3. **Cài đặt & Khởi chạy Frontend:**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```
   *(Frontend sẽ chạy tại: `http://localhost:5173`)*

---

## 🔑 6. Tài Khoản Thử Nghiệm (Default Credentials)

- **Quyền Admin (Quản trị viên):**
  - **Email:** `admin@badminton.com`
  - **Password:** `admin123`

---

## 🌐 7. Hướng Dẫn Deploy (Triển Khai Online)

- **Backend:** Triển khai lên [Render.com](https://render.com) (Root Directory: `backend`, Build Command: `npm install`, Start Command: `node server.js`).
- **Database:** Triển khai Cluster miễn phí trên [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
- **Frontend:** Triển khai lên [Vercel.com](https://vercel.com) (Root Directory: `frontend`, Environment Variable: `VITE_API_URL=<URL_Backend_Render>`).
