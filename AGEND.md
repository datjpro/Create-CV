# AGEND - Kế hoạch sửa lỗi xuất PDF lệch mẫu

## 1) Mục tiêu
- Đồng bộ hiển thị giữa bản thiết kế xem trước và file PDF xuất từ trình duyệt.
- Sửa lỗi xuống dòng sai ở các chuỗi liền mạch (ví dụ: Gmail/email, URL, số điện thoại).
- Đảm bảo bố cục ổn định khi in/xuất PDF trên Chrome/Edge.

## 2) Hiện trạng lỗi
- Bản preview trên màn hình đúng mẫu đã chọn.
- Khi dùng `Print -> Save as PDF`, một số đoạn text bị ngắt dòng không mong muốn.
- Trường hợp điển hình: `gmail` đang liền mạch thì bị rớt xuống dòng giữa chừng.

## 3) Giả thuyết nguyên nhân
- CSS cho chế độ in (`@media print`) chưa đồng nhất với CSS preview.
- Khác biệt kích thước vùng render giữa preview và print (A4, margin, scale).
- Thuộc tính ngắt dòng chưa phù hợp:
  - `word-break`, `overflow-wrap`, `white-space`, `hyphens`, `line-break`.
- Font khi in bị fallback khác font preview, làm lệch độ rộng ký tự.
- Thành phần flex/grid bị co giãn khác ở print dẫn đến wrap text sớm.

## 4) Kế hoạch thực hiện

### Bước 1: Khảo sát luồng render CV
- Xác định component render preview CV.
- Xác định stylesheet đang áp cho preview và cho print/PDF.
- Ghi lại cách hiện tại người dùng xuất PDF (nút app hay in trực tiếp trình duyệt).

### Bước 2: Chuẩn hoá khung in A4
- Thiết lập rõ `@page` (size A4, margin cố định).
- Khoá chiều rộng khung CV theo A4 tại cùng đơn vị (mm/px quy đổi nhất quán).
- Tránh để trình duyệt tự scale bằng layout không cố định.

### Bước 3: Sửa quy tắc xuống dòng cho dữ liệu liền mạch
- Với email/URL/text liền mạch:
  - ưu tiên `word-break: normal`.
  - dùng `overflow-wrap: break-word` chỉ khi cần chống tràn.
  - cân nhắc `white-space: nowrap` cho field ngắn bắt buộc liền mạch.
- Giữ quy tắc riêng theo class thay vì áp toàn cục.

### Bước 4: Đồng bộ font và line-height khi in
- Ép cùng `font-family`, `font-size`, `line-height`, `letter-spacing` giữa preview và print.
- Bảo đảm font đã load trước khi trigger in/export.

### Bước 5: Chống vỡ layout khi phân trang
- Kiểm tra các block dễ vỡ: header, contact, item kinh nghiệm, kỹ năng.
- Dùng `break-inside: avoid` cho block quan trọng.
- Tránh margin/padding gây đẩy dòng ngoài ý muốn ở print.

### Bước 6: Kiểm thử hồi quy
- Test trên Chrome + Edge với cùng dữ liệu mẫu.
- Test các mẫu CV khác nhau (ít nhất 2 mẫu).
- Đối chiếu preview và PDF theo checklist nghiệm thu.

## 5) Checklist nghiệm thu
- Email/Gmail không bị xuống dòng sai ở vị trí bất thường.
- Font, cỡ chữ, khoảng cách dòng khớp preview.
- Header/contact không xô lệch sau xuất PDF.
- Không xuất hiện tràn khung ngang.
- Sai khác bố cục giữa preview và PDF <= mức chấp nhận trực quan.

## 6) Ưu tiên kỹ thuật (đề xuất)
1. Sửa CSS print và quy tắc xuống dòng trước.
2. Khoá lại kích thước A4 + margin.
3. Tối ưu font loading cho thời điểm in.
4. Sau cùng mới can thiệp logic render nếu còn lệch.

## 7) Đầu ra mong đợi
- Một bản CV xuất PDF khớp gần như tuyệt đối với mẫu preview.
- Bộ quy tắc CSS print rõ ràng, dễ bảo trì.
- Tài liệu hoá ngắn trong repo về cách kiểm thử xuất PDF.
