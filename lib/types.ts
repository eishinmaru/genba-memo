// =============================================
// 型定義
// =============================================

/** 施工前後ペア写真 */
export interface PhotoPair {
  id: string;
  label: string;       // 箇所名（例：外壁北面）
  beforeImage: string; // base64
  afterImage: string;  // base64
  beforeMemo: string;
  afterMemo: string;
  createdAt: string;
}

/** 現場（案件） */
export interface Site {
  id: string;
  name: string;        // 現場名
  address: string;     // 住所
  clientName: string;  // 施主名
  workType: string;    // 工事種別
  startDate: string;   // 着工日
  endDate: string;     // 完工日
  memo: string;        // 現場メモ
  photos: PhotoPair[]; // 施工前後写真（最大20枚）
  status: "ongoing" | "completed";
  createdAt: string;
  updatedAt: string;
}

/** 会社・作業者情報 */
export interface UserSettings {
  companyName: string;
  staffName: string;
  phone: string;
  logoBase64: string;
}
