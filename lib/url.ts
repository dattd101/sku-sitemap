export function normalizeWebsiteInput(raw: string) {
  const value = raw.trim();
  if (!value) throw new Error("Vui lòng nhập domain hoặc URL website");
  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  const url = new URL(withProtocol);
  url.hash = "";
  return url;
}
