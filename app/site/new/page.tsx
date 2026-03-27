"use client";
// =============================================
// /site/new ── 現場登録
// =============================================
import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import { saveSite, uid, today } from "@/lib/storage";
import { Site } from "@/lib/types";

function NewSiteInner() {
  const router = useRouter();
  const [form, setForm] = useState<Omit<Site, "id" | "photos" | "createdAt" | "updatedAt">>({
    name: "",
    address: "",
    clientName: "",
    workType: "",
    startDate: today(),
    endDate: "",
    memo: "",
    status: "ongoing",
  });

  const set = (k: keyof typeof form, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = () => {
    if (!form.name.trim()) {
      alert("現場名を入力してください");
      return;
    }
    const now = new Date().toISOString();
    const site: Site = {
      ...form,
      id: uid(),
      photos: [],
      createdAt: now,
      updatedAt: now,
    };
    saveSite(site);
    router.push(`/site/${site.id}`);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-black text-gray-800">➕ 現場を新規登録</h1>

      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm space-y-3">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">基本情報</h2>

        {[
          { key: "name" as const, label: "現場名", placeholder: "○○邸外壁塗装工事", required: true },
          { key: "clientName" as const, label: "施主名", placeholder: "田中様" },
          { key: "address" as const, label: "現場住所", placeholder: "大阪府○○市..." },
          { key: "workType" as const, label: "工事種別", placeholder: "外壁塗装・屋根工事 など" },
        ].map(({ key, label, placeholder, required }) => (
          <div key={key}>
            <label className="text-xs text-gray-500 block mb-1">
              {label}{required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="text"
              placeholder={placeholder}
              value={form[key]}
              onChange={(e) => set(key, e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>
        ))}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-500 block mb-1">着工日</label>
            <input
              type="date"
              value={form.startDate}
              onChange={(e) => set("startDate", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">完工日（予定）</label>
            <input
              type="date"
              value={form.endDate}
              onChange={(e) => set("endDate", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-gray-500 block mb-1">メモ</label>
          <textarea
            placeholder="特記事項・注意点など"
            value={form.memo}
            onChange={(e) => set("memo", e.target.value)}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 rounded-2xl text-base shadow-lg transition-colors"
      >
        登録して撮影へ →
      </button>
    </div>
  );
}

export default function NewSitePage() {
  return (
    <Suspense fallback={null}>
      <NewSiteInner />
    </Suspense>
  );
}
