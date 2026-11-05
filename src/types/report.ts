export type ReportStatus = 'completed' | 'in_progress' | 'pending';

export type EquipmentCategory = 
  | 'computer'
  | 'notebook'
  | 'printer'
  | 'network'
  | 'server'
  | 'cctv'
  | 'software'
  | 'peripheral'
  | 'other';

export interface ITWorkReport {
  id: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:mm
  reporter: string; // ผู้ทำ report
  userName?: string; // ชื่อ User (ผู้ใช้งาน / ผู้แจ้งปัญหา)
  equipmentName: string; // ชื่ออุปกรณ์
  equipmentCategory: EquipmentCategory;
  programName?: string; // ชื่อระบบโปรแกรม (เมื่อเลือกหมวดหมู่ ระบบโปรแกรม)
  department?: string; // แผนก / สถานที่
  problemDetails: string; // ปัญหารายละเอียดงาน
  problemImages: string[]; // รูปภาพประกอบปัญหา มากกว่า 1 รูป
  resolutionDetails: string; // แก้ไขปัญหา
  resolutionImages: string[]; // รูปภาพประกอบการแก้ไข มากกว่า 1 รูป
  status: ReportStatus; // สถานะงาน: เสร็จสิ้น / กำลังดำเนินการ / ยังแก้ไขไม่เสร็จ
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  cost?: number; // ค่าใช้จ่ายอะไหล่ (ถ้ามี)
  notes?: string;
  syncedToSheets?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SheetConfig {
  webAppUrl: string; // Google Apps Script Web App URL
  csvUrl: string; // Google Sheets Published CSV URL
  autoSync: boolean;
  lastSyncedAt?: string;
}

export interface FilterOptions {
  status: 'all' | ReportStatus;
  category: 'all' | EquipmentCategory;
  search: string;
  dateFilter: 'all' | 'today' | 'this_week' | 'this_month' | 'custom';
  customDateStart?: string;
  customDateEnd?: string;
}
