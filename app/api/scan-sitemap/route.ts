import { NextRequest, NextResponse } from "next/server";
import { XMLParser } from "fast-xml-parser";
import * as XLSX from "xlsx";
import { assertPublicHttpUrl } from "@/lib/security";
import { discoverSitemap } from "@/lib/sitemap-discovery";
export const runtime="nodejs"; export const maxDuration=60;
const MAX=2000,parser=new XMLParser();
type Row={URL:string;LastModified:string;ChangeFrequency:string;Priority:string|number;SourceSitemap:string};
const arr=<T,>(v:T|T[]|undefined):T[]=>!v?[]:Array.isArray(v)?v:[v];
async function xml(url:string){await assertPublicHttpUrl(url);const r=await fetch(url,{redirect:"follow",cache:"no-store",headers:{"User-Agent":"SitemapScanner/2.0","Accept":"application/xml,text/xml,*/*"},signal:AbortSignal.timeout(10000)});if(!r.ok)throw new Error(`Không tải được sitemap (${r.status})`);return {text:await r.text(),url:r.url||url}}
async function scan(url:string,seen=new Set<string>(),rows:Row[]=[]):Promise<Row[]>{if(rows.length>=MAX||seen.has(url))return rows;seen.add(url);const loaded=await xml(url),d=parser.parse(loaded.text);if(d.sitemapindex?.sitemap){for(const s of arr<{loc?:string}>(d.sitemapindex.sitemap)){if(rows.length>=MAX)break;if(s.loc)await scan(s.loc,seen,rows)}return rows}for(const x of arr<any>(d.urlset?.url)){if(rows.length>=MAX)break;if(x.loc)rows.push({URL:x.loc,LastModified:x.lastmod??"",ChangeFrequency:x.changefreq??"",Priority:x.priority??"",SourceSitemap:loaded.url})}return rows}
export async function POST(req:NextRequest){try{const {websiteUrl}=await req.json();const sitemapUrl=await discoverSitemap(websiteUrl);const rows=await scan(sitemapUrl);const unique=[...new Map(rows.map(r=>[r.URL,r])).values()].slice(0,MAX);if(!unique.length)throw new Error("Sitemap không chứa URL");const ws=XLSX.utils.json_to_sheet(unique);ws["!cols"]=[{wch:75},{wch:24},{wch:20},{wch:12},{wch:75}];const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,"Sitemap");const b=XLSX.write(wb,{type:"buffer",bookType:"xlsx"});return new NextResponse(b,{headers:{"Content-Type":"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet","Content-Disposition":'attachment; filename="sitemap.xlsx"',"X-Sitemap-Url":encodeURIComponent(sitemapUrl),"X-Url-Count":String(unique.length)}})}catch(e){return NextResponse.json({error:e instanceof Error?e.message:"Có lỗi xảy ra"},{status:400})}}
