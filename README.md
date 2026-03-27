# ゲンバメモ 📸

現場の施工前後写真を撮影・記録して報告書を作成できる無料PWAアプリ。

## ターゲット
大工・塗装・電気工事・清掃業など、施工前後の写真記録が必要な職人・工務店

## 主な機能
- 📋 現場（案件）CRUD管理
- 📷 施工前後ペア写真撮影・紐付け（最大20箇所/現場）
- 📝 写真へのテキストメモ追加
- 🖨 印刷用CSS(@media print)によるPDF報告書出力
- 💬 LINE URL共有
- 💾 全データlocalStorage保存（サーバー不要）
- 📱 PWA対応（オフライン対応・ホーム画面追加可能）

## 技術スタック
- Next.js 14 (App Router)
- React 18 / TypeScript
- TailwindCSS

## ローカル開発
```bash
npm install
npm run dev
# → http://localhost:3000
```

## Vercelデプロイ
1. GitHubにpush
2. vercel.comでインポート
3. Framework: Next.js（自動検出）
4. Deploy（環境変数不要）
