"use client";
// =============================================
// /site/[id] ── 現場詳細・撮影
// =============================================
import { Suspense, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import PhotoPairCard from "@/components/PhotoPair";
import AdSpace from "@/components/AdSpace";
import { getSiteById, saveSite, uid, MAX_PHOTOS } from "@/lib/storage";
import { Site, PhotoPair } from "@/lib/types";

function SiteDetailInner() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [site, setSite] = useState<Site | null>(null);
  const [mounted, setMounted] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setMounted(true);
    const s = getSiteById(id);
    if (!s) { router.push("/"); return; }
    setSite(s);
  }, [id, router]);

  if (!mounted || !site) return null;

  const updateSite = (updated: Site) => {
    setSite(updated);
  };

  const addPhoto = () => {
    if (site.photos.length >= MAX_PHOTOS) {
      alert(`写真は1現場あたり最大${MAX_PHOTOS}枚までです。`);
      return;
    }
    const newPair: PhotoPair = {
      id: uid(),
      label: "",
      beforeImage: "",
      afterImage: "",
      beforeMemo: "",
      afterMemo: "",
      createdAt: new Date().toISOString(),
    };
    updateSite({ ...site, photos: [...site.photos, newPair] });
  };

  const updatePhoto = (updated: PhotoPair) => {
    updateSite({
      ...site,
      photos: site.photos.map((p) => (p.id === updated.id ? updated : p)),
    });
  };

  const deletePhoto = (photoId: string) => {
    if (!confirm("この撮影箇所を削除しますか？")) return;
    updateSite({
      ...site,
      photos: site.photos.filter((p) => p.id !== photoId),
    });
  };

  const handleSave = () => {
    saveSite({ ...site, updatedAt: new Date().toISOString() });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const toggleStatus = () => {
    const updated = {
      ...site,
      status: site.status === "ongoing" ? "completed" as const : "ongoing" as const,
      updatedAt: new Date().toISOString(),
    };
    saveSite(updated);
    setSite(updated);
  };

  const photoCount = site.photos.length;
  const pairedCount = site.photos.filter((p) => p.beforeImage && p.afterImage).length;

  return (
    <div className="space-y-4">
      {/* ヘッダー情報 */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="flex items-start justify-between mb-2">
          <div>
            <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
              site.status === "ongoing" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
            }`}>
              {site.status === "ongoing" ? "進行中" : "完了"}
            </span>
            <h1 className="text-lg font-black text-gray-800 mt-1">{site.name}</h1>
            <p className="text-xs text-gray-400">{site.clientName}　{site.address}</p>
          </div>
          <button
            type="button"
            onClick={toggleStatus}
            className="text-xs border border-gray-300 text-gray-500 px-3 py-1.5 rounded-lg hover:bg-gray-50"
          >
            {site.status === "ongoing" ? "完了にする" : "進行中に戻す"}
          </button>
        </div>

        <div className="flex gap-3 text-xs text-gray-500 mt-2">
          <span>📅 {site.startDate}{site.endDate ? ` 〜 ${site.endDate}` : ""}</span>
          <span>📷 {photoCount}箇所（前後ペア：{pairedCount}組）</span>
        </div>
      </div>

      <AdSpace slot="site-detail" />

      {/* 撮影箇所一覧 */}
      <div>
        <div className="flex items-center justify-between mb-2 px-1">
          <h2 className="text-sm font-black text-gray-700">
            撮影箇所（{photoCount}/{MAX_PHOTOS}）
          </h2>
          <span className={`text-xs ${photoCount >= MAX_PHOTOS ? "text-red-500" : "text-gray-400"}`}>
            {photoCount >= MAX_PHOTOS ? "上限に達しました" : `残り${MAX_PHOTOS - photoCount}箇所`}
          </span>
        </div>

        {site.photos.map((pair, i) => (
          <PhotoPairCard
            key={pair.id}
            pair={pair}
            index={i}
            onChange={updatePhoto}
            onDelete={deletePhoto}
          />
        ))}

        <button
          type="button"
          onClick={addPhoto}
          disabled={photoCount >= MAX_PHOTOS}
          className="w-full border-2 border-dashed border-teal-300 text-teal-500 hover:bg-teal-50 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl py-4 text-sm font-bold transition-colors"
        >
          📷 撮影箇所を追加
        </button>
      </div>

      {/* 保存・報告書 */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={handleSave}
          className={`w-full py-4 rounded-2xl font-bold text-base shadow-lg transition-colors ${
            saved ? "bg-green-500 text-white" : "bg-teal-600 hover:bg-teal-700 text-white"
          }`}
        >
          {saved ? "✅ 保存しました" : "💾 保存する"}
        </button>
        <Link
          href={`/report/${site.id}`}
          onClick={handleSave}
          className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-sm transition-colors"
        >
          📄 報告書を作成・出力
        </Link>
      </div>

      <AdSpace slot="site-detail-bottom" />
    </div>
  );
}

export default function SiteDetailPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-20 text-gray-400">読み込み中...</div>}>
      <SiteDetailInner />
    </Suspense>
  );
}
