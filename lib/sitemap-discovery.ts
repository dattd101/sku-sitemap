import { XMLParser } from "fast-xml-parser";
import { assertPublicHttpUrl } from "./security";
import { normalizeWebsiteInput } from "./url";

const parser = new XMLParser();
const COMMON_PATHS = ["/sitemap.xml", "/sitemap_index.xml", "/sitemap-index.xml", "/wp-sitemap.xml"];

async function fetchText(url: string, timeout = 8000) {
  await assertPublicHttpUrl(url);
  const r = await fetch(url, { redirect: "follow", cache: "no-store", headers: { "User-Agent": "SitemapTool/2.0", Accept: "application/xml,text/xml,text/plain,*/*" }, signal: AbortSignal.timeout(timeout) });
  if (!r.ok) return null;
  return { text: await r.text(), finalUrl: r.url || url };
}

function looksLikeSitemap(xml: string) {
  try {
    const d = parser.parse(xml);
    return !!(d?.urlset?.url || d?.sitemapindex?.sitemap);
  } catch { return false; }
}

export async function discoverSitemap(input: string) {
  const base = normalizeWebsiteInput(input);
  // Nếu người dùng nhập thẳng file sitemap thì kiểm tra file đó trước.
  if (/\.xml(?:$|\?)/i.test(base.toString())) {
    const direct = await fetchText(base.toString());
    if (direct && looksLikeSitemap(direct.text)) return direct.finalUrl;
  }

  const origin = base.origin;
  const candidates: string[] = [];
  // Ưu tiên khai báo Sitemap: trong robots.txt.
  try {
    const robots = await fetchText(`${origin}/robots.txt`, 6000);
    if (robots) {
      for (const line of robots.text.split(/\r?\n/)) {
        const m = line.match(/^\s*Sitemap\s*:\s*(\S+)/i);
        if (m?.[1]) candidates.push(m[1].trim());
      }
    }
  } catch {}
  for (const path of COMMON_PATHS) candidates.push(`${origin}${path}`);

  for (const candidate of [...new Set(candidates)]) {
    try {
      const result = await fetchText(candidate);
      if (result && looksLikeSitemap(result.text)) return result.finalUrl;
    } catch {}
  }
  throw new Error("Không tìm thấy sitemap hợp lệ. Hãy chuyển sang tab Tạo Sitemap.");
}
