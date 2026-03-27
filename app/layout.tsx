import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ゲンバメモ - 現場写真記録・報告書アプリ",
  description: "施工前後の写真を撮影・記録して報告書を作成。職人・工務店向け無料PWAアプリ。",
  keywords: ["現場", "施工前後", "写真", "報告書", "工事", "職人", "無料"],
  openGraph: {
    title: "ゲンバメモ - 現場写真記録アプリ",
    description: "施工前後の写真を記録して報告書を作成できる無料アプリ",
    type: "website",
    locale: "ja_JP",
  },
  appleWebApp: { capable: true, statusBarStyle: "default", title: "ゲンバメモ" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#0f766e",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>
        {/* ヘッダー */}
        <header className="bg-teal-700 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-md print-hide">
          <div className="flex items-center gap-2">
            <span className="text-xl">📸</span>
            <span className="font-bold text-lg tracking-wide">ゲンバメモ</span>
          </div>
          <span className="text-xs bg-white/20 px-2 py-1 rounded-full">現場記録</span>
        </header>

        {/* ヘッダー下 広告スペース */}
        <div id="ad-header" className="w-full bg-white border-b border-gray-200 h-12 flex items-center justify-center print-hide">
          <span className="text-xs text-gray-400">広告スペース</span>
        </div>

        {/* メイン */}
        <main className="max-w-xl mx-auto px-3 pt-4 pb-36">
          {children}
        </main>

        {/* フッター上 広告スペース */}
        <div id="ad-banner" className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 h-12 flex items-center justify-center z-20 print-hide">
          <span className="text-xs text-gray-400">広告スペース</span>
        </div>

        <BottomNav />
      </body>
    </html>
  );
}
