# Sitemap Tool - Next.js 15

## Tính năng
- Quét sitemap/sitemap index, tối đa 2.000 URL, xuất Excel (.xlsx).
- Crawl website không có sitemap, chỉ cùng hostname, tối đa 2.000 URL, xuất sitemap.xml.
- Bỏ file tĩnh, noindex và URL canonical sang trang khác.
- Có kiểm tra cơ bản để chặn localhost/private IPv4 nhằm giảm rủi ro SSRF.

## Chạy
```bash
npm install
npm run dev
```
Mở http://localhost:3000

## Production
Crawler có thể tốn thời gian; serverless có giới hạn timeout tùy nhà cung cấp. Với tải lớn nên chuyển crawl sang background job/queue. SSRF protection trong demo là lớp cơ bản; production public cần hardening DNS rebinding, IPv6 private/link-local, redirect validation, rate limit và giới hạn response size.
