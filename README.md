# SKU Sitemap Tool — Next.js 15

## Tính năng
- Nhập `example.com` hoặc URL đầy đủ.
- Tự tìm sitemap từ `robots.txt`, `/sitemap.xml`, `/sitemap_index.xml`, `/sitemap-index.xml`, `/wp-sitemap.xml`.
- Đọc sitemap index/sitemap con và xuất tối đa 2.000 URL ra Excel `.xlsx`.
- Nếu website không có sitemap, tab **Tạo Sitemap** crawl internal links và tải `sitemap.xml`.
- Crawl tối đa 60 giây; quá thời gian hoặc không crawl được sẽ trả lỗi rõ ràng.
- Bỏ `noindex`, canonical sang URL khác và file tĩnh phổ biến.
- Có kiểm tra SSRF cơ bản cho localhost/private network.

## Yêu cầu
- Node.js 20.18.1+ được khuyến nghị.

## Chạy local
```bash
npm install
npm run dev
```

## Kiểm tra trước khi push GitHub/Vercel
```bash
npm install
npm run build
```

Sau lần `npm install`, commit `package-lock.json` mới được npm tạo ra cùng source code.

## Vercel
Project đặt `package.json` ngay tại root repository. Không chọn Root Directory là thư mục con nếu source nằm trực tiếp ở root.
