import { useEffect } from "react";

type PageMeta = {
  title: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  robots?: string;
};

function setMeta(attr: "name" | "property", key: string, content: string | undefined) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (content === undefined) {
    if (el?.dataset["pageMeta"]) el.remove();
    return;
  }
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    el.dataset["pageMeta"] = "true";
    document.head.appendChild(el);
  }
  el.content = content;
}

/** Per-page <title> and meta tags (replaces the per-route head() definitions). */
export function usePageMeta({ title, description, ogTitle, ogDescription, robots }: PageMeta) {
  useEffect(() => {
    document.title = title;
    if (description) setMeta("name", "description", description);
    setMeta("property", "og:title", ogTitle ?? title);
    if (ogDescription ?? description) {
      setMeta("property", "og:description", ogDescription ?? description);
    }
    setMeta("name", "robots", robots);
  }, [title, description, ogTitle, ogDescription, robots]);
}
