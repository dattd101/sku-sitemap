# Sitemap Tool - Next.js 15

## Chức năng
- Chỉ cần nhập `example.com` hoặc URL website, không cần tự nhập đường dẫn sitemap.
- Tự tìm sitemap từ `robots.txt`, `/sitemap.xml`, `/sitemap_index.xml`, `/sitemap-index.xml`, `/wp-sitemap.xml`.
- Đọc sitemap index và xuất tối đa 2.000 URL sang Excel `.xlsx`.
- Website không có sitemap: crawl internal link và tạo `sitemap.xml`, tối đa 2.000 URL.
- Tạo sitemap có deadline 60 giây; quá thời gian hoặc không crawl được sẽ báo website không hỗ trợ.
- Bỏ noindex, canonical sang URL khác và các file tĩnh phổ biến.
- Có kiểm tra SSRF cơ bản cho localhost/private IPv4.

## Chạy
```bash
npm install
npm run dev
```
Mở http://localhost:3000
