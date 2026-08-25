# Seven.AM – Internal Reporting Hub

Bộ công cụ nội bộ tổng hợp 5 dashboard báo cáo Seven.AM trong **một link duy nhất**, chia thành 5 tab độc lập.

## 5 tab báo cáo

1. **BC1 – Doanh số theo khung giờ**  
   Theo dõi doanh số ngày của 16 showroom, so với tiến độ thời gian trong ngày; tự nhận mốc giờ và xuất PNG 2K/4K.

2. **BC2 – BXH doanh số showroom**  
   Xếp hạng 16 showroom theo HTTG; so sánh tiến độ doanh số toàn hệ thống với tiến độ thời gian; xuất PNG 2K/4K.

3. **BC3 – KPI hệ thống bán lẻ**  
   Theo dõi Target tháng, Thực đạt, % hoàn thành, schedule, GAP KPI, doanh số cần chạy/ngày, forecast và nhóm trạng thái showroom; xuất PNG 2K/4K.

4. **BC4 – BXH bán túi toàn hệ thống**  
   Theo dõi KPI túi theo tháng, % hoàn thành, tiến độ thời gian, forecast, Top cửa hàng ưu tiên và action nhanh; xuất PNG 2X/3X.

5. **BC5 – Dashboard điều hành hệ thống bán lẻ**  
   Tổng hợp KPI toàn hệ thống, cơ cấu doanh thu theo nguồn, Top/Bottom Store, hiệu quả nhân sự, điểm sáng quản trị, thiếu/thừa nhân sự và insight; xuất PNG 2K/4K.

## Cấu trúc

```text
/
├─ index.html          # Hub 5 tab
├─ hub.css
├─ hub.js
├─ .nojekyll
└─ modules/
   ├─ bc1/             # Tool gốc BC1
   ├─ bc2/             # Tool gốc BC2
   ├─ bc3/             # Tool gốc BC3 + assets/icons
   ├─ bc4/             # Tool gốc BC4
   └─ bc5/             # Dashboard điều hành hệ thống + Excel mẫu + assets
```

Mỗi báo cáo chạy trong vùng độc lập để CSS/JS/Canvas không xung đột. Dữ liệu của 5 tool vẫn lưu cục bộ trên trình duyệt bằng các `localStorage` key riêng biệt.

## Đưa lên GitHub Pages

1. Tạo repository mới trên GitHub, ví dụ `sevenam-reporting`.
2. Upload **toàn bộ nội dung trong thư mục này** lên nhánh `main`.
3. Vào **Settings → Pages**.
4. Ở **Build and deployment**, chọn **Deploy from a branch**.
5. Chọn **Branch: main** và thư mục **/(root)** → **Save**.
6. GitHub sẽ cung cấp một URL Pages. Mở URL đó là vào Hub 5 tab.

Có thể mở trực tiếp từng tab bằng hash:
- `#bc1`
- `#bc2`
- `#bc3`
- `#bc4`
- `#bc5`

Ví dụ: `https://<username>.github.io/<repo>/#bc3`

## Lưu ý nội bộ

- Đây là web tĩnh, không có backend và không tự gửi dữ liệu lên máy chủ.
- Dữ liệu đã dán được lưu trong `localStorage` của trình duyệt đang dùng.
- GitHub Pages là URL có thể truy cập nếu người khác biết đường dẫn. Nhãn “DÙNG NỘI BỘ” chỉ là nhận diện giao diện, **không phải lớp xác thực**.
- Nếu dữ liệu kinh doanh cần giới hạn truy cập thực sự, nên dùng repository/hosting có cơ chế xác thực riêng thay vì coi URL Pages là bí mật.

## Bảo trì

Muốn cập nhật một báo cáo riêng, chỉ cần thay các file trong thư mục tương ứng `modules/bc1`, `modules/bc2`, `modules/bc3`, `modules/bc4` hoặc `modules/bc5`. Không cần sửa Hub nếu tên đường dẫn không đổi.
