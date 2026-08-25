# Seven.AM Dashboard Điều Hành Hệ Thống Bán Lẻ — Patch 6

Tool nội bộ tạo dashboard Canvas từ dữ liệu Excel copy/paste.

## Logic chính
- Model tiền tệ chuẩn: nghìn đồng; hỗ trợ header `(đồng)` và tự quy đổi.
- Top 5/Bottom 5 Store luôn sort từ toàn bộ danh sách theo Doanh thu thực đạt.
- Biểu đồ và bảng Top/Bottom dùng cùng một danh sách đã sort.
- Hai biểu đồ SR dùng cùng lề trái, cùng `maxBarWidth`, cùng `valueX` và cùng thang doanh thu = doanh thu lớn nhất trong 10 SR hiển thị.
- KPI màu theo một `STATUS_RULES`: Tốt ≥110%; Đạt 100–<110%; Cần cải thiện 70–<100%; Cần đẩy mạnh 50–<70%; Rủi ro cao <50%.
- Growth chuẩn `(current - previous) / previous × 100`; previous = 0 trả về trạng thái trung tính 0,0%.
- Tất cả tỷ lệ hiển thị 1 số sau dấu phẩy.
- Ảnh quản lý upload riêng từng slot và được vẽ trực tiếp lên Canvas/export.

## Export
- Preview logical: 1536 × 1024 (3:2).
- PNG 2K: 2048 × 1365, trực tiếp từ Canvas.
- PNG 4K: 4096 × 2731.

## GitHub Pages
Upload toàn bộ thư mục này lên repository và bật GitHub Pages.
