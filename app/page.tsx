"use client";
// =============================================
// / ── 現場一覧トップページ
// =============================================
import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getSites, isInitialized, markInitialized, deleteSite } from "@/lib/storage";
import { Site } from "@/lib/types";
import AdSpace from "@/components/AdSpace";

function TopPageInner() {
  const router = useRouter();
  const [sites, setSites] = useState<Site[]>([]);
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setMounted(true);
    if (!isInitialized()) {
      markInitialized();
      router.push("/settings?first=true");
      return;
    }
    setSites(getSites());
  }, [router]);

  if (!mounted) return null;

  const filtered = sites.filter(
    (s) =>
      s.name.includes(search) ||
      s.clientName.includes(search) ||
      s.address.includes(search)
  );

  const handleDelete = (id: string) => {
    if (!confirm("この現場を削除しますか？写真データも全て削除されます。")) return;
    deleteSite(id);
    setSites(getSites());
  };

  const ongoing = filtered.filter((s) => s.status === "ongoing");
  const completed = filtered.filter((s) => s.status === "completed");

  return (
    <div className="space-y-4">
      {/* ヒーロー */}
      <div className="bg-gradient-to-br from-teal-700 to-teal-500 text-white rounded-2xl p-5 shadow-lg">
        <h1 className="text-xl font-bold mb-1">ゲンバメモ</h1>
        <p className="text-teal-100 text-sm mb-4">現場の施工前後を記録・報告書化</p>
        <Link
          href="/site/new"
          className="inline-block bg-white text-teal-700 font-bold px-5 py-2.5 rounded-xl shadow text-sm"
        >
          ➕ 新しい現場を登録
        </Link>
      </div>

      {/* 検索 */}
      <input
        type="search"
        placeholder="🔍 現場名・施主名・住所で検索"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
      />

      <AdSpace slot="top-list" />

      {/* 進行中 */}
      {ongoing.length > 0 && (
        <section>
          <h2 className="text-sm font-bold text-gray-600 mb-2 flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span>
            進行中（{ongoing.length}件）
          </h2>
          <div className="space-y-2">
            {ongoing.map((s) => (
              <SiteCard key={s.id} site={s} onDelete={handleDelete} />
            ))}
          </div>
        </section>
      )}

      {/* 完了 */}
      {completed.length > 0 && (
        <section>
          <h2 className="text-sm font-bold text-gray-500 mb-2 flex items-center gap-1">
            <span className="w-2 h-2 bg-gray-400 rounded-full inline-block"></span>
            完了（{completed.length}件）
          </h2>
          <div className="space-y-2">
            {completed.map((s) => (
              <SiteCard key={s.id} site={s} onDelete={handleDelete} />
            ))}
          </div>
        </section>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400 space-y-3">
          <p className="text-5xl">📋</p>
          <p className="font-bold">{search ? "検索結果がありません" : "現場がまだありません"}</p>
          <Link href="/site/new" className="inline-block text-teal-600 text-sm font-bold underline">
            最初の現場を登録する →
          </Link>
        </div>
      )}

      <AdSpace slot="top-bottom" />
    </div>
  );
}

function SiteCard({ site, onDelete }: { site: Site; onDelete: (id: string) => void }) {
  const photoCount = site.photos.filter(
    (p) => p.beforeImage || p.afterImage
  ).length;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <div className="min-w-0 mr-2">
          <div className="flex items-center gap-2 mb-0.5">
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                site.status === "ongoing"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {site.status === "ongoing" ? "進行中" : "完了"}
            </span>
            <span className="text-xs text-gray-400">写真 {photoCount}箇所</span>
          </div>
          <p className="font-bold text-gray-800 truncate">{site.name}</p>
          <p className="text-xs text-gray-400 mt-0.5">
            {site.clientName}　{site.startDate}
          </p>
        </div>
      </div>
      <div className="flex gap-2 mt-3">
        <Link
          href={`/site/${site.id}`}
          className="flex-1 text-center bg-teal-50 hover:bg-teal-100 text-teal-700 font-bold text-xs py-2 rounded-lg"
        >
          ✏️ 記録
        </Link>
        <Link
          href={`/report/${site.id}`}
          className="flex-1 text-center bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs py-2 rounded-lg"
        >
          📄 報告書
        </Link>
        <button
          type="button"
          onClick={() => onDelete(site.id)}
          className="flex-1 bg-red-50 hover:bg-red-100 text-red-500 font-bold text-xs py-2 rounded-lg"
        >
          🗑 削除
        </button>
      </div>
    </div>
  );
}

export default function TopPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-20 text-gray-400">読み込み中...</div>}>
      <TopPageInner />
    </Suspense>
  );
}
