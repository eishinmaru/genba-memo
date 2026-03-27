"use client";
// =============================================
// /settings ── 設定
// =============================================
import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getSettings, saveSettings } from "@/lib/storage";
import { UserSettings } from "@/lib/types";
import AdSpace from "@/components/AdSpace";

function SettingsInner() {
  const router = useRouter();
  const params = useSearchParams();
  const isFirst = params.get("first") === "true";
  const logoRef = useRef<HTMLInputElement>(null);

  const [s, setS] = useState<UserSettings>({
    companyName: "", staffName: "", phone: "", logoBase64: "",
  });
  const [saved, setSaved] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setS(getSettings());
  }, []);

  if (!mounted) return null;

  const upd = (k: keyof UserSettings, v: string) =>
    setS((p) => ({ ...p, [k]: v }));

  const handleLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => upd("logoBase64", ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    saveSettings(s);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    if (isFirst) router.push("/");
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        {isFirst && (
          <span className="bg-teal-100 text-teal-700 text-xs font-bold px-2 py-1 rounded-full">
            初回設定
          </span>
        )}
        <h1 className="text-lg font-black text-gray-800">⚙️ 設定</h1>
      </div>

      {isFirst && (
        <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 text-sm text-teal-800">
          <p className="font-bold mb-1">🎉 ゲンバメモへようこそ！</p>
          会社名・担当者名を設定しておくと報告書に自動で反映されます。
        </div>
      )}

      {/* ロゴ */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <p className="text-sm font-bold text-gray-700 mb-3">🏷 会社ロゴ（任意）</p>
        {s.logoBase64 ? (
          <div className="flex items-center gap-3 mb-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.logoBase64} alt="ロゴ" className="h-14 object-contain border rounded-lg bg-gray-50 p-1" />
            <button type="button" onClick={() => upd("logoBase64", "")}
              className="text-xs text-red-500 border border-red-200 px-3 py-1.5 rounded-lg">
              削除
            </button>
          </div>
        ) : (
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl h-16 flex items-center justify-center mb-3 text-gray-400 text-sm">
            ロゴ画像なし
          </div>
        )}
        <button type="button" onClick={() => logoRef.current?.click()}
          className="text-sm bg-gray-100 hover:bg-gray-200 px-4 py-2.5 rounded-lg font-bold transition-colors">
          📁 画像を選択
        </button>
        <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={handleLogo} />
      </div>

      {/* 基本情報 */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm space-y-3">
        <p className="text-sm font-bold text-gray-700">📝 会社・担当者情報</p>
        {[
          { key: "companyName" as const, label: "会社名・屋号", placeholder: "○○建設・田中工務店" },
          { key: "staffName" as const, label: "担当者名", placeholder: "田中 太郎" },
          { key: "phone" as const, label: "電話番号", placeholder: "090-XXXX-XXXX", inputMode: "tel" as const },
        ].map(({ key, label, placeholder, inputMode }) => (
          <div key={key}>
            <label className="text-xs text-gray-500 block mb-1">{label}</label>
            <input
              type="text"
              inputMode={inputMode}
              placeholder={placeholder}
              value={s[key]}
              onChange={(e) => upd(key, e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>
        ))}
      </div>

      <AdSpace slot="settings" />

      <button
        type="button"
        onClick={handleSave}
        className={`w-full py-4 rounded-2xl font-black text-base shadow-lg transition-colors ${
          saved ? "bg-green-500 text-white" : "bg-teal-600 hover:bg-teal-700 text-white"
        }`}
      >
        {saved ? "✅ 保存しました！" : isFirst ? "設定して始める →" : "💾 保存する"}
      </button>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={null}>
      <SettingsInner />
    </Suspense>
  );
}
