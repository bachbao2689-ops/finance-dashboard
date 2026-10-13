# 💎 Finance Dashboard — Cyber-Organic Liquid Glass Edition

Ứng dụng quản lý tài chính cá nhân hiện đại với giao diện **Cyber-Organic Liquid Glass** (Kính lỏng công nghệ giao thoa phong cách doanh nghiệp và hiện đại).

---

## 🌐 Link Trực Tuyến (Live Deployments)

* **GitHub Pages:** [https://bachbao2689-ops.github.io/finance-dashboard/](https://bachbao2689-ops.github.io/finance-dashboard/)
* **Vercel Production:** [https://finance-dashboard-murex-tau.vercel.app/](https://finance-dashboard-murex-tau.vercel.app/)

---

## ✨ Điểm Nổi Bật & Chuẩn Thiết Kế UX/UI

Dự án áp dụng hệ thống thiết kế **Cyber-Organic Liquid Glass Design System**:
1. **Liquid Glassmorphism**:
   - Sử dụng hiệu ứng thấu kính ánh sáng khúc xạ `backdrop-filter: blur(28px) saturate(190%)` kết hợp gradient 135 độ và bóng đổ đa tầng.
   - Viền 1px bán trong suốt tinh tế, nói không với viền đặc thô kệch.
2. **Magnetic Physics & Cursor Spotlight**:
   - Các thẻ KPI (Số dư, Tổng thu, Tổng chi) và thẻ báo cáo phản hồi theo tọa độ chuột với hiệu ứng rọi sáng (Spotlight radial gradient) và độ đàn hồi vật lý `cubic-bezier(0.22, 1, 0.36, 1)`.
3. **Chế độ Sáng / Tối Độc lập (Light & Dark Themes)**:
   - Hỗ trợ cả hai chế độ với nút chuyển đổi trực quan (☀️ Light / 🌙 Dark).
   - Tự động lưu sở thích người dùng vào `localStorage`.
4. **Nút Điều Hướng Liquid Glass & Mobile Floating Bar**:
   - Desktop: Nút điều hướng Liquid Glass với đèn neon chỉ báo trạng thái đang chọn.
   - Mobile: Thanh điều hướng nổi dạng pill theo chuẩn `UI Button.md` với hiệu ứng `mobile-liquid-glass` và lớp Depth Mask.
5. **Cơ chế Cuộn Không Viền (Zero-width Invisible Scrollbars)**:
   - Cuộn siêu mượt mà không để thanh cuộn vật lý thô phá vỡ bố cục.
6. **Đồng bộ Dữ liệu Thời gian Thực (Real-time Cloud Sync)**:
   - Tích hợp Firebase Firestore (`v4_sync`) đảm bảo dữ liệu luôn được lưu trữ và cập nhật trên mọi thiết bị.
   - Hỗ trợ xuất dữ liệu ra file `.csv` và kết nối Webhook (Google Sheets, Zapier).

---

## 📁 Cấu Trúc Mã Nguồn

```
finance-dashboard/
├── index.html                 # Entrypoint ứng dụng chính
├── css/
│   ├── liquid-glass.css       # Core Design System styles & tokens
│   └── dashboard.css          # Giao diện chi tiết các components & responsive
├── js/
│   ├── magnetic-physics.js    # Engine vật lý từ tính & rọi sáng con trỏ
│   └── app.js                 # Xử lý logic nghiệp vụ & Firebase Cloud Sync
├── src/
│   └── design-system/         # Bộ components & tokens TypeScript/React tái sử dụng
└── README.md
```

---

## 🚀 Quy Trình Phát Triển & Triển Khai (Deployment Rules)

* **Nhánh Phát triển (Develop):** `codex/develop-dashboard`
* **Nhánh Chính thức (Production):** `main`