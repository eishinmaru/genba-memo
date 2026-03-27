"use client";
// =============================================
// 施工前後ペア写真コンポーネント
// =============================================
import { useRef } from "react";
import { PhotoPair } from "@/lib/types";

interface Props {
  pair: PhotoPair;
  index: number;
  onChange: (updated: PhotoPair) => void;
  onDelete: (id: string) => void;
}

export default function PhotoPairCard({ pair, index, onChange, onDelete }: Props) {
  const beforeRef = useRef<HTMLInputElement>(null);
  const afterRef = useRef<HTMLInputElement>(null);

  const handleImage = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "beforeImage" | "afterImage"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // ファイルサイズ警告（2MB超）
    if (file.size > 2 * 1024 * 1024) {
      alert("写真サイズが大きすぎます（2MB以下推奨）。画質を下げて再撮影してください。");
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      onChange({ ...pair, [field]: ev.target?.result as string });
    };
    reader.readAsDataURL(file);
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

        {/* 施工前後写真 */}
        <div className="grid grid-cols-2 gap-3">
          {/* 施工前 */}
          <div className="space-y-1.5">
            <p className="text-xs font-bold text-gray-500 text-center">施工前</p>
            {pair.beforeImage ? (
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={pair.beforeImage}
                  alt="施工前"
                  className="w-full aspect-square object-cover rounded-lg border"
                />
                <button
                  type="button"
                  onClick={() => onChange({ ...pair, beforeImage: "" })}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => beforeRef.current?.click()}
                className="w-full aspect-square bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-teal-400 hover:bg-teal-50 transition-colors"
              >
                <span className="text-2xl">📷</span>
                <span className="text-xs mt-1">撮影</span>
              </button>
            )}
            <input
              ref={beforeRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => handleImage(e, "beforeImage")}
            />
            <textarea
              placeholder="施工前メモ"
              value={pair.beforeMemo}
              onChange={(e) => onChange({ ...pair, beforeMemo: e.target.value })}
              rows={2}
              className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>

          {/* 施工後 */}
          <div className="space-y-1.5">
            <p className="text-xs font-bold text-gray-500 text-center">施工後</p>
            {pair.afterImage ? (
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={pair.afterImage}
                  alt="施工後"
                  className="w-full aspect-square object-cover rounded-lg border"
                />
                <button
                  type="button"
                  onClick={() => onChange({ ...pair, afterImage: "" })}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => afterRef.current?.click()}
                className="w-full aspect-square bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-teal-400 hover:bg-teal-50 transition-colors"
              >
                <span className="text-2xl">📷</span>
                <span className="text-xs mt-1">撮影</span>
              </button>
            )}
            <input
              ref={afterRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => handleImage(e, "afterImage")}
            />
            <textarea
              placeholder="施工後メモ"
              value={pair.afterMemo}
              onChange={(e) => onChange({ ...pair, afterMemo: e.target.value })}
              rows={2}
              className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
