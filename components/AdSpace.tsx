// 広告スペース
export default function AdSpace({ slot = "content" }: { slot?: string }) {
  return (
    <div
      className="w-full bg-gray-100 border border-dashed border-gray-300 rounded flex items-center justify-center text-gray-400 text-xs my-3 print-hide"
      style={{ minHeight: 60 }}
      data-ad-slot={slot}
    >
      広告スペース（AdSense）
    </div>
  );
}
