NGUYEN DUC TRUNG | MSSV: 23730831 | Clone HTTPS: https://github.com/ducktrung/23730831_TH2.git | Stamp: #700094 | So cuoi: 1 | VARIANT: watermark duoi; login phone; tab Shop→Gio→Toi; haptic selection; ship B; Detail card.

# KTXGo — Lập trình cho thiết bị di động TH2

- Project: `KTXGo_23730831` — React Native CLI + TypeScript.
- `src/constants/student.ts` là nguồn xác định biến thể, các công thức và mã định danh.
- Vui lòng thay `ducktrung` bằng tài khoản GitHub thực tế trước khi nộp; công cụ `exam-start.ps1` tự cập nhật nếu đã xác thực `gh auth login`.
- Không sử dụng Expo làm app chính, Redux, Vision Camera, CSS, className, thanh toán online.

## Tính năng

- Auth Stack / Main Tabs (Cửa hàng → Giỏ → Tôi) / Shop Stack (Home → Detail).
- FlashList v1, lưới 2 cột, debounce 400 ms, pull-to-refresh.
- Axios + `X-Student-Id`, React Query với `staleTime=21000ms`, loading/error/retry.
- Zustand + Persist AsyncStorage theo khoá `ktxgo-cart-23730831`.
- Location permission: granted, denied, blocked → mở Cài đặt; phí Haversine công thức B.
- Haptic `selection` khi thêm vào giỏ. Các màn hình đều có watermark ở dưới.

## Chạy thử trước ngày thi

Xem `HUONG_DAN_WINDOWS.md` tại thư mục ngoài source.

## Đề yêu cầu ảnh

- `docs/screenshot-th2-home.png`
- `docs/screenshot-th2-cart.png`

Chụp thực tế từ Android Emulator **sau khi app chạy**, và phải nhìn rõ dòng tên + MSSV + stamp; không dùng ảnh mẫu làm ảnh nộp.

## Lưu ý về mô phỏng

Danh sách sản phẩm lấy dữ liệu thật từ `https://fakestoreapi.com/products?limit=12` theo yêu cầu đề, vì vậy hình/tên có thể không giống món KTX trong hình minh hoạ. Giá được tính bằng hệ số theo seed MSSV. `KTX_GATE` hiện là toạ độ mô phỏng trong `src/utils/shipping.ts`, không phải cổng KTX đã được xác minh thực địa.

## Quy tắc dữ liệu để đáp ứng Câu 2b

- `getProducts()` GET `/products?limit=12` qua Axios, giữ nguyên `id`, `title`, `image`, `description`, `category`, `price` từ API.
- `ProductCard` và `Detail` hiển thị dữ liệu API, KHÔNG đổi tên áo/túi thành cơm nắm/trà sữa từ hình minh hoạ.
- `unitPrice(price)` tính từ `PRICE_MULTIPLIER`, không hard-code bảng giá.
- Khi thiếu mạng: thử tại app chạy mới, đóng/khởi động lại để tránh React Query cache còn dữ liệu.
