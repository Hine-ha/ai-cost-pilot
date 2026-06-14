import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Cost Pilot | 生成AIコスト診断ツール",
  description:
    "LLM API の利用料、失敗リクエスト、過剰なトークン消費を可視化し、削減ポイントを提案します。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-white font-sans text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
