# Cắt gác hàng ngày – V2

## 1. Cấu trúc
- `index.html`: giao diện và thuật toán cắt gác.
- `api/data.js`: lưu Danh sách Tổng + trạng thái vào MongoDB.
- `api/history.js`: lưu lịch sử cắt gác theo từng ngày và đọc 5 ngày gần nhất.
- `api/_mongo.js`: kết nối MongoDB Atlas dùng biến môi trường.
- `package.json`: thư viện MongoDB Node.js Driver.

## 2. Biến môi trường trên Vercel
Tạo:
- `MONGODB_URI` = connection string MongoDB Atlas.
- `MONGODB_DB` = `cat_gac` (hoặc tên database anh muốn).

Không đưa `MONGODB_URI` vào GitHub hay viết trực tiếp trong HTML.

## 3. Deploy
Push toàn bộ thư mục này lên GitHub, import repository vào Vercel, cài dependency rồi Redeploy sau khi thêm Environment Variables.

## 4. Quy tắc Nghỉ tranh thủ V2
- Thứ 6: chỉ được phân Ca 1–3; tuyệt đối không Ca 4–7.
- Thứ 7: không phân bất kỳ ca nào.
- Chủ nhật: tuyệt đối không Ca 1–4; Ca 5–7 ưu tiên nhóm Nghỉ tranh thủ trước.


## Gắn logo để “Thêm vào màn hình chính”

V2 đã có hỗ trợ PWA. Anh chỉ cần sửa **một dòng** ở đầu file `index.html`:

```js
const LOGO_URL = "https://YOUR-DOMAIN.COM/logo.png";
```

Thay `https://YOUR-DOMAIN.COM/logo.png` bằng **link ảnh logo trực tiếp** của anh.

### Khuyến nghị
- Ảnh PNG hoặc JPG.
- Ảnh vuông, tốt nhất **512x512 px** hoặc lớn hơn.
- Link phải mở trực tiếp ra file ảnh, ví dụ `https://tenmien.vn/logo.png`.
- Nên dùng link HTTPS.
- Không dùng link trang Google Drive/Facebook chứa trang xem ảnh; phải là URL trả về trực tiếp hình ảnh.

### Sau khi đổi logo
1. Lưu `index.html`.
2. Commit/push toàn bộ thư mục lên GitHub.
3. Chờ Vercel deploy xong.
4. Mở **đường link Vercel** trên điện thoại.
5. Chọn **Chia sẻ → Thêm vào Màn hình chính** (iPhone) hoặc **Thêm vào màn hình chính / Cài đặt ứng dụng** (Android, tùy trình duyệt).
6. Icon sử dụng ảnh ở `LOGO_URL`.

### Nếu muốn thay logo sau này
Chỉ cần đổi `LOGO_URL`, push GitHub và chờ Vercel deploy lại. Nếu điện thoại vẫn hiện logo cũ, hãy xóa shortcut/app cũ rồi thêm lại để trình duyệt lấy manifest/icon mới.

### Lưu ý về PWA
PWA cần chạy qua HTTPS. Domain Vercel đáp ứng điều kiện HTTPS. File `manifest.json` và `sw.js` đã được thêm sẵn trong bộ V2.
