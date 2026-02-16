const isAbsoluteUrl = (url: string) => /^https?:\/\//i.test(url);

export const apiUrl = (path: string) => {
  if (isAbsoluteUrl(path)) return path;
  const base = (process.env.NEXT_PUBLIC_API_BASE ?? "https://divtimebackend.liara.run").replace(/\/+$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath}`;
};

export const withCredentialsFetch = async (input: RequestInfo | string, init?: RequestInit) => {
  const url = typeof input === "string" ? apiUrl(input) : input;
  const res = await fetch(url, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    ...init,
  });
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }
  return res;
};
