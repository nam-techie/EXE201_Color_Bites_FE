# 📸 Challenge Images

Thư mục này chứa các hình ảnh cho tính năng Challenge của ứng dụng Color Bites.

## 📁 Cấu trúc thư mục

```
challenges/
├── covers/          # Ảnh cover cho các challenge
├── submissions/     # Ảnh bài đăng tham gia challenge
└── README.md        # File này
```

## 🎯 Các loại ảnh cần thiết

### 1. Cover Images (Ảnh bìa challenge)
- **Kích thước**: 600x400px
- **Format**: PNG/JPG
- **Mục đích**: Hiển thị trên challenge card
- **Tên file**: `challenge-{id}-cover.{ext}`

### 2. Submission Images (Ảnh bài đăng)
- **Kích thước**: 600x400px
- **Format**: PNG/JPG
- **Mục đích**: Ảnh bài đăng tham gia challenge
- **Tên file**: `submission-{id}.{ext}`

## 🍽️ Các challenge hiện tại

1. **Món Ăn An Ủi Cuối Tuần** - Comfort food
2. **Săn Món Ăn Màu Đỏ** - Red food hunt
3. **Khám Phá Ẩm Thực Châu Á** - Asian cuisine
4. **Món Ăn Xanh & Healthy** - Green healthy food
5. **Phiêu Lưu Ẩm Thực Đường Phố** - Street food
6. **Món Ăn Truyền Thống Việt Nam** - Traditional Vietnamese

## 📝 Hướng dẫn thêm ảnh

1. Tải ảnh từ Pinterest hoặc nguồn khác
2. Đặt tên file theo format: `challenge-{id}-cover.jpg`
3. Đặt vào thư mục `covers/` hoặc `submissions/`
4. Cập nhật mock data trong `data/challengeData.tsx`

## 🎨 Yêu cầu ảnh

- **Chất lượng cao**: Ảnh rõ nét, đẹp mắt
- **Phù hợp chủ đề**: Ảnh liên quan đến ẩm thực
- **Đa dạng**: Nhiều loại món ăn khác nhau
- **Hấp dẫn**: Ảnh thu hút người dùng tham gia

## 🔗 Liên kết

- **Pinterest**: Tìm ảnh ẩm thực đẹp
- **Unsplash**: Ảnh miễn phí chất lượng cao
- **Pexels**: Ảnh ẩm thực miễn phí 