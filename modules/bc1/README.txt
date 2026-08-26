SEVEN.AM – BẢNG XẾP HẠNG DOANH SỐ NGÀY 16 SHOWROOM – OFFLINE TOOL – V8

1. CÁCH DÙNG
- Giải nén file ZIP.
- Giữ index.html, styles.css, app.js và README.txt cùng một thư mục.
- Mở index.html bằng Chrome hoặc Microsoft Edge.
- Copy bảng từ Excel / Google Sheets rồi dán vào ô dữ liệu.
- Bấm “Phân tích & tạo BXH”.
- Có thể xuất PNG 2K hoặc PNG 4K trực tiếp từ Canvas.

2. 16 SHOWROOM CỐ ĐỊNH
HĐ, TĐT, TB, VP, VI, TDH, LH, HP, NĐ, THO, NB, HAD, TN, LLQ, HOB, VT.
Tool tự sắp xếp giảm dần theo % Hoàn thành TG ngày.

3. INPUT LINH ĐỘNG
Tool nhận bảng Excel, Google Sheets, Markdown, tab, dấu |, dấu ; hoặc khoảng trắng.
Tên cột có thể viết khác nhẹ. Mỗi dòng showroom chỉ cần nhận ra mã showroom và giá trị hoàn thành.
Có thể thiếu dấu %, ví dụ:
HĐ    50,00
TĐT   60
VT    136

Dòng Tổng là bắt buộc để đảm bảo % toàn hệ thống đúng theo dữ liệu gốc.

4. MỐC THỜI GIAN
Ngày vận hành: 08:00–21:30 = 13,5 giờ.
- 12:00 = 4 / 13,5 giờ = 29,6%
- 17:00 = 9 / 13,5 giờ = 66,7%
- 19:00 = 11 / 13,5 giờ = 81,5%

Tool tự nhận dòng “Khung giờ”, “Mốc giờ”, “Giờ báo cáo”, “Cập nhật”...
Có ô nhập thủ công. Khi nhập thủ công, mốc này được ưu tiên.
Tool cũng nhận giờ linh động như 17:30.

5. QUY ƯỚC MÀU – GIỐNG TOOL GỐC
Chênh lệch = % Hoàn thành TG ngày − % Tiến độ thời gian.
- CHƯA PHÁT SINH DOANH THU: 0% → xám.
- CHẬM NHIỀU: chênh lệch < −10 điểm % → đỏ (#EE1717).
- CHẬM: từ −10 đến < 0 điểm % → cam nhạt (#F59E0B), tách biệt rõ với màu đỏ.
- KỊP: từ 0 đến +10 điểm % → xanh dương (#188BD8).
- VƯỢT NHIỀU: > +10 điểm % → xanh lá (#55B52C).

Font dashboard dùng Arial giống tool gốc.

6. BỐ CỤC V3
- Giữ tỷ lệ ảnh dọc 1023 × 1537 (xấp xỉ 2:3).
- Header: icon tăng trưởng doanh số hiện đại, ngày cập nhật, mốc giờ và tiến độ thời gian.
- Block TIẾN ĐỘ TOÀN HỆ THỐNG đặt phía trên.
  + Dòng 1: % Tiến độ hệ thống + thanh tiến độ.
  + Dòng 2: % Tiến độ thời gian + thanh tiến độ song song.
  + Card bên phải hiển thị chênh lệch điểm %.
- Hai block quản trị:
  + Cửa hàng ĐẠT TIẾN ĐỘ = Kịp + Vượt nhiều, hiển thị số cửa hàng và %.
  + Cửa hàng CHẬM TIẾN ĐỘ = Chậm + Chậm nhiều, hiển thị số cửa hàng và %.
- Bảng 16 showroom kéo dài toàn bộ chiều ngang ảnh.
  + Tên showroom và % hiển thị lớn, rõ.
  + Thanh tiến độ được thu ngắn cân đối và vẫn có vạch mốc tiến độ thời gian.
  + Màu thanh đúng theo quy ước trạng thái.
- Đã bỏ toàn bộ phần NHẬN XÉT QUẢN TRỊ.
- Chú thích màu được chuyển xuống sát cuối dashboard.
- Footer mục tiêu chung ở cuối.

7. VALIDATION
Tool cảnh báo / chặn xuất ảnh khi:
- Thiếu showroom;
- Trùng showroom;
- Thiếu dòng Tổng;
- Không đọc được giá trị hoàn thành;
- Mốc giờ thủ công không hợp lệ.

Nếu không có “Khung giờ”, tool tạm dùng giờ hiện tại trên máy và cảnh báo.

8. KÍCH THƯỚC
- Logic dashboard: 1023 × 1537 px.
- PNG 2K: 2046 × 3074 px.
- PNG 4K: 4092 × 6148 px.

9. OFFLINE
Tool chạy hoàn toàn offline, không backend và không gửi dữ liệu ra ngoài.
Dữ liệu gần nhất được lưu bằng localStorage trên trình duyệt.

CẬP NHẬT GIAO DIỆN V3
- Thay logo cúp lớn bằng icon tăng trưởng doanh số gọn và hiện đại hơn.
- Sửa card CẬP NHẬT để chữ, giờ và ngày tự căn theo độ rộng, không chồng lên nhau.
- Màu trạng thái chỉ dùng làm màu thanh progress và trong phần chú thích; số %, tên cửa hàng và chữ trạng thái dùng xanh đen để đọc rõ trên nền trắng.
- Top 1 / 2 / 3 dùng huy chương vàng / bạc / đồng có số thứ hạng ở giữa.
- Cột NHÓM đổi thành TRẠNG THÁI và mở rộng; thanh progress từng cửa hàng được thu ngắn để cân bố cục.
- Tên showroom và số % trong bảng được tăng kích thước.
- Chú thích dùng luật chung theo chênh lệch điểm %, không hiển thị ngưỡng tính ra theo từng mốc giờ.
- Hai card Đạt tiến độ / Chậm tiến độ dùng giao diện trung tính; % hiển thị xanh đen.


CẬP NHẬT GIAO DIỆN V4
- Hai block Cửa hàng đạt tiến độ / Chậm tiến độ trở lại sắc thái xanh lá và đỏ rõ ràng như V2.
- Donut tổng hệ thống tự đổi màu theo trạng thái Tổng: xanh lá / xanh dương / cam / đỏ / xám.
- Block chênh lệch Tổng tự đổi nền theo trạng thái và tự chọn màu chữ tương phản; câu chữ tự đổi theo Vượt nhiều / Kịp / Chậm / Chậm nhiều / Chưa phát sinh, kèm dấu + hoặc - đúng giá trị điểm %.
- Bỏ dòng giải thích công thức chênh lệch ở cuối block chú thích.
- Chữ cột TRẠNG THÁI đổi màu cùng trạng thái từng cửa hàng.
- Huy chương Top 1-2-3 đổi sang dạng 2D gọn, không đổ bóng, số 1-2-3 rõ ở giữa.
- % ở dòng TỔNG HỆ THỐNG đổi màu theo trạng thái Tổng và đặt thẳng trong cột % của bảng, cỡ chữ lớn hơn các cửa hàng.


CẬP NHẬT GIAO DIỆN V5
- Card trạng thái Tổng chỉ hiển thị tên trạng thái (Vượt nhiều / Kịp / Chậm / Chậm nhiều / Chưa phát sinh) và chênh lệch +/- điểm %, không lặp câu “so với thời gian”.
- Hai block Đạt tiến độ / Chậm tiến độ ưu tiên hiển thị số cửa hàng dạng x/16 thật lớn; dòng “Kịp + Vượt nhiều” và “Chậm + Chậm nhiều” được tách xuống dưới.
- Giãn chiều cao 16 dòng showroom để dễ đọc và dễ gióng hơn.
- Thanh tiến độ mỗi showroom được rút ngắn thêm 20% và căn giữa trong vùng tiến độ.
- Chữ TRẠNG THÁI tăng kích thước/độ đậm.
- Block Chú thích màu được giảm chiều cao đáng kể để nhường không gian cho bảng 16 showroom.

CẬP NHẬT V6 – LAYOUT + SO SÁNH HỆ THỐNG
- % ở dòng TỔNG HỆ THỐNG trong bảng luôn màu trắng trên nền navy.
- Hai block Cửa hàng đạt tiến độ / Chậm tiến độ chuyển xuống ngay dưới bảng xếp hạng 16 cửa hàng.
- Số cửa hàng và tỷ lệ % trong hai block dùng cùng kích thước lớn để đọc nhanh.
- Tăng rõ kích thước chữ và % của TIẾN ĐỘ HỆ THỐNG / TIẾN ĐỘ THỜI GIAN.
- Bỏ thanh tiến độ thời gian ở card góc trên; card chỉ giữ mốc giờ, số giờ đã chạy và % thời gian.
- Tăng lại chiều cao block CHÚ THÍCH MÀU TIẾN ĐỘ.
- Chữ cột TRẠNG THÁI được tăng độ nổi bằng viền xanh đen mảnh, giữ màu trạng thái bên trong.


CẬP NHẬT V7 – HEADER + CHÚ THÍCH
- Bỏ viền chữ ở cột TRẠNG THÁI; chữ giữ màu theo trạng thái.
- Card góc trên cạnh ngày cập nhật bỏ % thời gian; chỉ còn mốc báo cáo và số giờ đã chạy.
- Tăng toàn bộ cỡ chữ trong block CHÚ THÍCH MÀU TIẾN ĐỘ để đọc nhanh hơn.
- Dòng CẬP NHẬT được tăng cỡ chữ và hạ thấp nhẹ để cân giữa card.


CẬP NHẬT V8 – CỘT +/- + CÂN LẠI BXH
- Hạ tiêu đề “BẢNG XẾP HẠNG DOANH SỐ NGÀY” xuống nhẹ để thoáng viền trên.
- Card góc trên đổi lại tiêu đề “TIẾN ĐỘ THỜI GIAN”; số giờ đã chạy dùng màu cam.
- Cột XH đổi thành “XẾP HẠNG” và được mở rộng.
- Cột CỬA HÀNG mở rộng; mã showroom canh phải để nằm sát thanh tiến độ hơn.
- Vùng thanh progress thu gọn; thanh nằm gần tên showroom và cột % hơn để dễ gióng ngang.
- Thêm cột “+/-” giữa % và TRẠNG THÁI, hiển thị số điểm % lệch so với tiến độ thời gian.
- TỔNG HỆ THỐNG và % Tổng dùng cùng cỡ chữ; dòng Tổng đồng thời hiển thị +/- và trạng thái tổng.


CẬP NHẬT V9 – CÂN CỘT + NHẤN GIỜ CẬP NHẬT
- Giữ nguyên toàn bộ logic và bố cục V8.
- Cột XẾP HẠNG và CỬA HÀNG rộng bằng nhau, nội dung đều căn giữa.
- Thanh tiến độ được kéo dài nhẹ và bắt đầu gần cột cửa hàng hơn để dễ gióng ngang.
- Riêng mốc giờ trong card CẬP NHẬT được đổi sang màu cam; ngày cập nhật vẫn giữ màu trắng.
