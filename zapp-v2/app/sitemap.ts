import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/past", "/present", "/future", "/how-to-buy", "/whitepaper"];
  return routes.map((route) => ({
    url: `${SITE.url}${route}`,
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.8,
  }));
}
