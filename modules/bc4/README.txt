SEVEN.AM – BẢNG XẾP HẠNG BÁN TÚI TOÀN HỆ THỐNG – V4

CÁCH DÙNG
1. Giải nén ZIP.
2. Giữ index.html, styles.css, app.js cùng thư mục.
3. Mở index.html bằng Chrome hoặc Edge.
4. Dán bảng dữ liệu.
5. Chọn ngày chốt nếu muốn đổi; mặc định lấy ngày trên máy.
6. Bấm “Phân tích & tạo Dashboard”.
7. Xuất PNG nếu cần.

INPUT TỐI THIỂU
- SR
- TỔNG: số túi đã bán lũy kế tháng.
- TG Tháng: target túi tháng.

Tool có thể nhận bảng có thêm Còn thiếu và % Hoàn thành nhưng không phụ thuộc hai cột này. Tool tự tính lại.

16 SHOWROOM CỐ ĐỊNH
HP, TB, TĐT/TDT, HOB, VI, VP, HĐ/HD, THO, LLQ, NB, VT, LH, HAD, NĐ/ND, TN, TDH.

NGÀY CHỐT
- Mặc định = ngày hiện tại trên máy lúc mở/làm báo cáo.
- Có thể chọn ngày thủ công.
- Tiến độ thời gian = ngày chốt / tổng số ngày trong tháng.
- Số ngày còn lại = tổng ngày tháng - ngày chốt.

LOGIC
% Hoàn thành = TỔNG / TG Tháng × 100.
+/- so với TG = % Hoàn thành - % tiến độ thời gian.

Trạng thái:
- Chưa phát sinh: TỔNG = 0 → xám.
- Chậm nhiều: < -10 điểm % → đỏ.
- Chậm: -10 đến < 0 điểm % → cam.
- Kịp: 0 đến +10 điểm % → xanh dương.
- Vượt nhiều: > +10 điểm % → xanh lá.

Cần bán TB/ngày = MAX(Target - Thực đạt,0) / số ngày còn lại.
Forecast cuối tháng = (Thực đạt / số ngày đã qua × tổng số ngày tháng) / Target × 100.

TOP 4 ƯU TIÊN
Lấy trong nhóm Chậm / Chậm nhiều / Chưa phát sinh, ưu tiên cửa hàng có mức tăng pace cần thiết cao nhất:
- Pace hiện tại = Thực đạt / ngày đã qua.
- Pace cần từ nay = Còn thiếu / ngày còn lại.
- Mức cần tăng = Pace cần - Pace hiện tại.

SẮP XẾP
- Tự sort % hoàn thành giảm dần.
- Top 1/2/3 dùng huy chương vàng/bạc/đồng.
- Trạng thái và màu đồng bộ với quy ước tiến độ V9.

BỐ CỤC
- 4 KPI đầu trang: % hoàn thành, thực đạt, +/- tiến độ TG, cần bán TB/ngày.
- Bảng 16 cửa hàng: BXH, cửa hàng, % đạt, thanh tiến độ, +/- TG, cần TB/ngày, trạng thái.
- Donut phân loại theo nhóm.
- Tiến độ thời gian.
- Forecast cuối tháng.
- Top 4 cửa hàng ưu tiên.
- Action nhanh cuối dashboard.

TOOL CHẠY OFFLINE, KHÔNG DÙNG BACKEND.


CẬP NHẬT V2 – BÁM SÁT ẢNH MẪU
- Khóa design canvas 1536 × 1024; toàn dashboard scale đồng bộ.
- Tăng visual weight nhưng khóa Canvas chỉ dùng Arial 400/700; không dùng 800/900.
- KPI card cao 147 px; vòng KPI lớn hơn, icon navy nét dày đồng bộ.
- Bảng trái rộng hơn, row cao ~32 px, tên cửa hàng và số liệu dễ đọc hơn.
- Header bảng gọn; progress 9 px, marker thời gian 2 px.
- Donut/legend tăng độ dày và size chữ.
- Panel tiến độ thời gian cao 158 px, % thời gian/icon/ngày lớn hơn.
- Forecast cao 205 px, gauge dày và số forecast lớn hơn.
- Top 4 ưu tiên tăng icon + font.
- ACTION NHANH tăng size icon, số và caption; main content kéo sát footer như mẫu.


CẬP NHẬT V3 – CANVAS + ARIAL 400/700
- Quay lại engine Canvas của V2.
- Toàn bộ chữ trong app.js khóa font-family = Arial.
- Chỉ cho phép font-weight 400 hoặc 700.
- Mọi tham số 600/800/900 trong Canvas được loại bỏ/chuyển về 700.
- Không dùng Inter fallback, tránh trình duyệt tự giả lập ExtraBold làm chữ bè/dày sai mẫu.
- Hàm setCanvasFont() là điểm duy nhất tạo ctx.font, giúp kiểm soát font tập trung và triệt để.
- Bố cục, logic dữ liệu, màu trạng thái và công thức của V2 giữ nguyên.


CẬP NHẬT V4 – KPI / DONUT / BXH RÕ NÉT
- 4 KPI đầu bám ảnh mẫu: % Hoàn thành / Thực đạt / Còn thiếu / Cần bán trung bình ngày.
- KPI CÒN THIẾU dùng số túi còn thiếu thực tế = max(Target - Thực đạt, 0).
- Donut phân nhóm tăng độ dày và có vạch trắng mỏng ngăn từng đoạn.
- Số 16 cửa hàng ở giữa donut tăng size, dùng Arial Bold 700.
- Thanh tiến độ từng showroom tăng độ dày; % đạt, tên showroom và trạng thái tăng size để đọc nhanh.
- Màu tiến độ đồng bộ quy ước tool gốc: xanh lá / xanh dương / cam / đỏ / xám.
- Huy chương Top 1-2-3 chuyển sang 2D phẳng, bỏ bóng/điểm sáng tròn.
- Time / Forecast / Top 4 / Action nhanh đều tăng visual weight và giảm khoảng trống thừa.
- Font Canvas vẫn khóa tuyệt đối ở Arial Regular 400 / Arial Bold 700.


CẬP NHẬT V5
- Ngày cập nhật mặc định lấy theo máy; ngày chốt số liệu = ngày cập nhật - 1 ngày.
- Số ngày trong tháng được tính tự động theo dương lịch của tháng chứa ngày chốt.
- 4 KPI căn giữa giá trị trong vùng từ mép phải icon đến cạnh phải card.
- Track 100% của toàn bộ progress bar đổi sang xám đậm hơn để dễ nhận biết mức 100%.
- ACTION NHANH dùng câu hành động thực tế, chữ lớn/đậm hơn.
- TOP 4 ưu tiên tách vùng tên và vùng +túi/ngày, tránh LLQ chèn chữ.
- Huy chương Top 1-2-3 tối giản còn vòng tròn 2D + số.


CẬP NHẬT V6
- Ngày CẬP NHẬT hiển thị xanh lá đậm, ngày CHỐT hiển thị đỏ đậm; riêng dd/mm/yyyy tăng khoảng 20%.
- Cột +/- TG dùng cùng màu với trạng thái tiến độ của từng cửa hàng.
- Ô ĐÃ QUA nền đỏ nhạt; CÒN LẠI nền xanh lá nhạt.
- ACTION NHANH tăng font mô tả và tự ngắt tối đa 2 dòng theo từ hoàn chỉnh.


CẬP NHẬT V7 – MỞ RỘNG BẢNG XẾP HẠNG
- Viền 4 KPI rõ hơn.
- Bảng xếp hạng rộng thêm 60 px; phần tăng thêm dồn vào cột TIẾN ĐỘ để thanh progress dài hơn.
- Cụm bên phải thu gọn đồng bộ còn 564 px.
- Donut giữ nguyên kích thước; legend nhóm được nén và dịch phải.
- Tiến độ thời gian giữ nguyên 2 ô ngày, thanh progress mỏng và ngắn hơn.
- Dự báo bỏ chữ FORECAST, gauge bán nguyệt thu nhỏ.
- Top 4 ưu tiên căn lại theo phần phải mới.


CẬP NHẬT V8
- Đổi vị trí 2 block bên phải: TIẾN ĐỘ THỜI GIAN lên trên, PHÂN LOẠI THEO NHÓM xuống dưới.
- Giữ nguyên toàn bộ kích thước, logic và nội dung V7.
