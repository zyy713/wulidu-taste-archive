import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const baseUrl = new URL(`${protocol}://${host}`);
  const title = "菜场味觉档案｜五里多市场交互装置";
  const description = "把市场食材、摊主经验与地方做法连接起来的交互式味觉档案。";

  return {
    metadataBase: baseUrl,
    title,
    description,
    icons: { icon: "/og.png", shortcut: "/og.png" },
    openGraph: {
      title,
      description,
      type: "website",
      images: [{ url: new URL("/og.png", baseUrl).toString(), width: 1728, height: 906, alt: "菜场味觉档案" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [new URL("/og.png", baseUrl).toString()],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
