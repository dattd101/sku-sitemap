import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Sitemap Tool", description: "Scan or generate sitemap, max 2,000 URLs" };
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="vi"><body>{children}</body></html>; }
