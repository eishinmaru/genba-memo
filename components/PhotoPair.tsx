"use client";
// =============================================
// 施工前後ペア写真コンポーネント
// アップロード前に canvas で自動リサイズ・圧縮する
// =============================================
import { useRef, useState } from "react";
import { PhotoPair } from "@/lib/types";

interface Props {
  pair: PhotoPair;
  index: number;
  onChange: (updated: PhotoPair) => void;
  onDelete: (id: string) => void;
}

// ── 画像圧縮設定 ──────────────────────────────────────────────
const MAX_LONG_SIDE = 1920; // 長辺の最大px
const JPEG_QUALITY  = 0.82; // JPEG品質（0〜1）
const MAX_FILE_SIZE = 15 * 1024 * 1024; // 警告なし上限（15MB）

/**
 * File → canvas でリサイズ・圧縮 → base64 JPEG を返す
 * createImageBitmap を使うことで iOS の EXIF 回転も正しく処理する
 */
async function compressImage(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);

  const { width: origW, height: origH } = bitmap;
  const longSide = Math.max(origW, origH);

  let drawW = origW;
  let drawH = origH;
  if (longSide > MAX_LONG_SIDE) {
    const scale = MAX_LONG_SIDE / longSide;
    drawW = Math.round(origW * scale);
    drawH = Math.round(origH * scale);
  }

  const canvas = document.createElement("canvas");
  canvas.width  = drawW;
  canvas.height = drawH;

  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(bitmap, 0, 0, drawW, drawH);
  bitmap.close();

  return canvas.toDataURL("image/jpeg", JPEG_QUALITY);
}

export default function PhotoPairCard({ pair, index, onChange, onDelete }: Props) {
  const beforeRef = useRef<HTMLInputElement>(null);
  const afterRef  = useRef<HTMLInputElement>(null);

  const [compressing, setCompressing] = useState<{
    before: boolean;
    after: boolean;
  }>({ before: false, after: false });

  const handleImage = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "beforeImage" | "afterImage"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      const proceed = confirm(
        `写真のサイズが ${Math.round(file.size / 1024 / 1024)}MB あります。\n` +
        "自動で圧縮しますが、処理に時間がかかる場合があります。続けますか？"
      );
      if (!proceed) return;
    }

    const key = field === "beforeImage" ? "before" : "after";
    setCompressing((p) => ({ ...p, [key]: true }));

    try {
      const compressed = await compressImage(file);
      onChange({ ...pair, [field]: compressed });
    } catch (err) {
      console.error("画像圧縮エラー:", err);
      // フォールバック：圧縮失敗時はそのまま読み込む
      const reader = new FileReader();
      reader.onload = (ev) => {
        onChange({ ...pair, [field]: ev.target?.result as string });
      };
      reader.readAsDataURL(file);
    } finally {
      setCompressing((p) => ({ ...p, [key]: false }));
      e.target.value = ""; // 同じファイルを再選択できるようにリセット
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-4">
      {/* ヘッダー */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-teal-50 border-b border-teal-100">
        <span className="text-xs font-bold text-teal-700">撮影箇所 {index + 1}</span>
        <button
          type="button"
          onClick={() => onDelete(pair.id)}
          className="text-red-400 hover:text-red-600 text-sm font-bold px-2"
        >
          削除
        </button>
      </div>

      <div className="p-3 space-y-3">
        {/* 箇所名 */}
        <input
          type="text"
          placeholder="箇所名（例：外壁北面・玄関ドア）"
          value={pair.label}
          onChange={(e) => onChange({ ...pair, label: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
        />

        <div className="grid grid-cols-2 gap-3">

          {/* ── 施工前 ── */}
          <div className="space-y-1.5">
            <p className="text-xs font-bold text-gray-500 text-center">施工前</p>
            {compressing.before ? (
              <div className="w-full aspect-square bg-teal-50 border-2 border-teal-200 rounded-lg flex flex-col items-center justify-center text-teal-500">
                <span className="text-2xl animate-spin">⏳</span>
                <span className="text-xs mt-1">圧縮中...</span>
              </div>
            ) : pair.beforeImage ? (
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={pair.beforeImage} alt="施工前" className="w-full aspect-square object-cover rounded-lg border" />
                <button type="button" onClick={() => onChange({ ...pair, beforeImage: "" })}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                  ×
                </button>
                <button type="button" onClick={() => beforeRef.current?.click()}
                  className="absolute bottom-1 right-1 bg-black/50 text-white rounded-lg px-2 py-0.5 text-xs">
                  撮り直し
                </button>
              </div>
            ) : (
              <button type="button" onClick={() => beforeRef.current?.click()}
                className="w-full aspect-square bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-teal-400 hover:bg-teal-50 transition-colors">
                <span className="text-2xl">📷</span>
                <span className="text-xs mt-1">撮影</span>
              </button>
            )}
            <input ref={beforeRef} type="file" accept="image/*" 
              className="hidden" onChange={(e) => handleImage(e, "beforeImage")} />
            <textarea placeholder="施工前メモ" value={pair.beforeMemo}
              onChange={(e) => onChange({ ...pair, beforeMemo: e.target.value })}
              rows={2} className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-400" />
          </div>

          {/* ── 施工後 ── */}
          <div className="space-y-1.5">
            <p className="text-xs font-bold text-gray-500 text-center">施工後</p>
            {compressing.after ? (
              <div className="w-full aspect-square bg-teal-50 border-2 border-teal-200 rounded-lg flex flex-col items-center justify-center text-teal-500">
                <span className="text-2xl animate-spin">⏳</span>
                <span className="text-xs mt-1">圧縮中...</span>
              </div>
            ) : pair.afterImage ? (
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={pair.afterImage} alt="施工後" className="w-full aspect-square object-cover rounded-lg border" />
                <button type="button" onClick={() => onChange({ ...pair, afterImage: "" })}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                  ×
                </button>
                <button type="button" onClick={() => afterRef.current?.click()}
                  className="absolute bottom-1 right-1 bg-black/50 text-white rounded-lg px-2 py-0.5 text-xs">
                  撮り直し
                </button>
              </div>
            ) : (
              <button type="button" onClick={() => afterRef.current?.click()}
                className="w-full aspect-square bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-teal-400 hover:bg-teal-50 transition-colors">
                <span className="text-2xl">📷</span>
                <span className="text-xs mt-1">撮影</span>
              </button>
            )}
            <input ref={afterRef} type="file" accept="image/*" 
              className="hidden" onChange={(e) => handleImage(e, "afterImage")} />
            <textarea placeholder="施工後メモ" value={pair.afterMemo}
              onChange={(e) => onChange({ ...pair, afterMemo: e.target.value })}
              rows={2} className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-400" />
          </div>

        </div>
      </div>
    </div>
  );
}