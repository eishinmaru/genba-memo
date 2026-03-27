"use client";
// =============================================
// /report/[id] ── 報告書プレビュー・出力
// =============================================
import { Suspense, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getSiteById, getSettings } from "@/lib/storage";
import { Site, UserSettings } from "@/lib/types";
import { shareToLine, copyToClipboard } from "@/lib/share";

function ReportInner() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [site, setSite] = useState<Site | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setMounted(true);
    const s = getSiteById(id);
    if (!s) { router.push("/"); return; }
    setSite(s);
    setSettings(getSettings());
  }, [id, router]);

  if (!mounted || !site || !settings) return null;

  const pairedPhotos = site.photos.filter((p) => p.beforeImage || p.afterImage);

  const shareText = [
    `【施工報告書】${site.name}`,
    `施主：${site.clientName}`,
    `住所：${site.address}`,
    `工事種別：${site.workType}`,
    `着工：${site.startDate}${site.endDate ? `　完工：${site.endDate}` : ""}`,
    `撮影箇所：${pairedPhotos.length}箇所`,
    settings.companyName ? `\n施工：${settings.companyName}` : "",
    settings.staffName ? `担当：${settings.staffName}` : "",
    settings.phone ? `TEL：${settings.phone}` : "",
  ].filter(Boolean).join("\n");

  const handleCopy = async () => {
    const ok = await copyToClipboard(shareText);
    if (ok) { setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };

  return (
    <div className="space-y-4">
      {/* アクションボタン（印刷時非表示） */}
      <div className="flex gap-2 flex-wrap print-hide">
        <button
          type="button"
          onClick={() => window.print()}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold px-3 py-2.5 rounded-xl text-sm"
        >
          🖨 PDF出力
        </button>
        <button
          type="button"
          onClick={() => shareToLine(shareText)}
          className="flex-1 bg-[#06C755] hover:bg-[#05b34c] text-white font-bold px-3 py-2.5 rounded-xl text-sm"
        >
          LINE共有
        </button>
        <button
          type="button"
          onClick={handleCopy}
          className={`flex-1 font-bold px-3 py-2.5 rounded-xl text-sm ${
            copied ? "bg-blue-500 text-white" : "bg-blue-100 text-blue-700"
          }`}
        >
          {copied ? "✅ コピー済" : "📋 コピー"}
        </button>
      </div>

      {/* 報告書本体（印刷対象） */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* タイトル */}
        <div className="bg-teal-700 text-white px-6 py-4 print-bg">
          <h1 className="text-xl font-bold tracking-widest text-center">施　工　報　告　書</h1>
        </div>

        {/* 基本情報 */}
        <div className="p-5 border-b border-gray-100">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-gray-400 mb-0.5">現場名</p>
              <p className="font-bold text-gray-800">{site.name}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-0.5">施主名</p>
              <p className="font-bold text-gray-800">{site.clientName || "―"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-0.5">現場住所</p>
              <p className="text-gray-700">{site.address || "―"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-0.5">工事種別</p>
              <p className="text-gray-700">{site.workType || "―"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-0.5">着工日</p>
              <p className="text-gray-700">{site.startDate || "―"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-0.5">完工日</p>
              <p className="text-gray-700">{site.endDate || "―"}</p>
            </div>
          </div>

          {/* 施工者情報 */}
          {(settings.companyName || settings.staffName) && (
            <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-start text-sm">
              <div>
                {settings.companyName && (
                  <p className="font-bold text-gray-800">{settings.companyName}</p>
                )}
                {settings.staffName && (
                  <p className="text-gray-600">担当：{settings.staffName}</p>
                )}
                {settings.phone && (
                  <p className="text-gray-600">TEL：{settings.phone}</p>
                )}
              </div>
              {settings.logoBase64 && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={settings.logoBase64} alt="ロゴ" className="h-12 object-contain" />
              )}
            </div>
          )}
        </div>

        {/* 写真セクション */}
        {pairedPhotos.length > 0 ? (
          <div className="p-5 space-y-6">
            <h2 className="text-sm font-bold text-gray-700">
              施工前後写真（{pairedPhotos.length}箇所）
            </h2>
            {pairedPhotos.map((pair, i) => (
              <div key={pair.id} className="report-page">
                <h3 className="text-sm font-bold text-teal-700 mb-2 border-b border-teal-100 pb-1">
                  【{i + 1}】{pair.label || `撮影箇所 ${i + 1}`}
                </h3>
                <div className="photo-grid grid grid-cols-2 gap-3">
                  {/* 施工前 */}
                  <div>
                    <p className="text-xs font-bold text-center text-gray-500 mb-1 bg-yellow-50 py-0.5 rounded">
                      施工前
                    </p>
                    {pair.beforeImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={pair.beforeImage}
                        alt="施工前"
                        className="w-full aspect-square object-cover rounded-lg border"
                      />
                    ) : (
                      <div className="w-full aspect-square bg-gray-100 rounded-lg border flex items-center justify-center text-gray-400 text-xs">
                        写真なし
                      </div>
                    )}
                    {pair.beforeMemo && (
                      <p className="text-xs text-gray-600 mt-1 p-1.5 bg-gray-50 rounded">
                        {pair.beforeMemo}
                      </p>
                    )}
                  </div>
                  {/* 施工後 */}
                  <div>
                    <p className="text-xs font-bold text-center text-gray-500 mb-1 bg-green-50 py-0.5 rounded">
                      施工後
                    </p>
                    {pair.afterImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={pair.afterImage}
                        alt="施工後"
                        className="w-full aspect-square object-cover rounded-lg border"
                      />
                    ) : (
                      <div className="w-full aspect-square bg-gray-100 rounded-lg border flex items-center justify-center text-gray-400 text-xs">
                        写真なし
                      </div>
                    )}
                    {pair.afterMemo && (
                      <p className="text-xs text-gray-600 mt-1 p-1.5 bg-gray-50 rounded">
                        {pair.afterMemo}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-400">
            <p className="text-3xl mb-2">📷</p>
            <p className="text-sm">写真がまだありません</p>
          </div>
        )}

        {/* 備考 */}
        {site.memo && (
          <div className="px-5 pb-5 border-t border-gray-100 pt-4">
            <p className="text-xs font-bold text-gray-500 mb-1">備考</p>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{site.memo}</p>
          </div>
        )}
      </div>

      {/* LINE案内 */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-gray-600 print-hide">
        <p className="font-bold text-gray-800 mb-1">📱 LINEで送る方法</p>
        <p className="text-xs">
          「PDF出力」でダウンロードしたPDFをLINEのトーク画面から📎で添付して送ってください。
        </p>
      </div>
    </div>
  );
}

export default function ReportPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-20 text-gray-400">読み込み中...</div>}>
      <ReportInner />
    </Suspense>
  );
}
