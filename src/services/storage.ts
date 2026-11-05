import { ITWorkReport, SheetConfig, ReportStatus, EquipmentCategory } from '../types/report';
import { INITIAL_REPORTS } from '../data/mockReports';

const STORAGE_KEY = 'it_daily_reports_v1';
const SHEET_CONFIG_KEY = 'it_sheet_config_v1';

export function getStoredReports(): ITWorkReport[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_REPORTS));
      return INITIAL_REPORTS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return INITIAL_REPORTS;
    }
    return parsed;
  } catch (err) {
    console.error('Failed to load reports from storage:', err);
    return INITIAL_REPORTS;
  }
}

export function saveReports(reports: ITWorkReport[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  } catch (err) {
    console.error('Failed to save reports to storage:', err);
  }
}

export function getStoredSheetConfig(): SheetConfig {
  try {
    const raw = localStorage.getItem(SHEET_CONFIG_KEY);
    if (!raw) {
      return {
        webAppUrl: '',
        csvUrl: '',
        autoSync: true,
      };
    }
    return JSON.parse(raw);
  } catch (err) {
    return {
      webAppUrl: '',
      csvUrl: '',
      autoSync: true,
    };
  }
}

export function saveSheetConfig(config: SheetConfig): void {
  try {
    localStorage.setItem(SHEET_CONFIG_KEY, JSON.stringify(config));
  } catch (err) {
    console.error('Failed to save sheet config:', err);
  }
}

/**
 * Standard CSV Export with UTF-8 BOM for Thai language compatibility in Excel & Google Sheets
 */
export function exportToCSV(reports: ITWorkReport[]): void {
  const headers = [
    'รหัสงาน (ID)',
    'วันที่ (Date)',
    'เวลา (Time)',
    'ผู้ทำ Report (Reporter)',
    'ชื่อ User (User)',
    'ชื่ออุปกรณ์ (Equipment)',
    'หมวดหมู่อุปกรณ์ (Category)',
    'ชื่อระบบโปรแกรม (Program Name)',
    'แผนก/สถานที่ (Department)',
    'สถานะงาน (Status)',
    'ระดับความเร่งด่วน (Priority)',
    'ปัญหารายละเอียดงาน (Problem Details)',
    'จำนวนรูปปัญหา (Problem Images Count)',
    'การแก้ไขปัญหา (Resolution Details)',
    'จำนวนรูปแก้ไข (Resolution Images Count)',
    'ค่าใช้จ่าย (Cost)',
    'หมายเหตุ (Notes)',
    'เวลาที่บันทึก (Timestamp)'
  ];

  const statusMap: Record<ReportStatus, string> = {
    completed: 'เสร็จสิ้น',
    in_progress: 'กำลังดำเนินการ',
    pending: 'ยังแก้ไขไม่เสร็จ / รออะไหล่'
  };

  const rows = reports.map((r) => [
    `"${r.id}"`,
    `"${r.date}"`,
    `"${r.time || ''}"`,
    `"${(r.reporter || '').replace(/"/g, '""')}"`,
    `"${(r.userName || '').replace(/"/g, '""')}"`,
    `"${(r.equipmentName || '').replace(/"/g, '""')}"`,
    `"${r.equipmentCategory}"`,
    `"${(r.programName || '').replace(/"/g, '""')}"`,
    `"${(r.department || '').replace(/"/g, '""')}"`,
    `"${statusMap[r.status] || r.status}"`,
    `"${r.priority || 'medium'}"`,
    `"${(r.problemDetails || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
    r.problemImages?.length || 0,
    `"${(r.resolutionDetails || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
    r.resolutionImages?.length || 0,
    r.cost || 0,
    `"${(r.notes || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
    `"${r.createdAt}"`
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(row => row.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `IT_Work_Report_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Copy data as tab-separated values ready to paste directly into Google Sheets
 */
export async function copyForGoogleSheet(reports: ITWorkReport[]): Promise<boolean> {
  const statusMap: Record<ReportStatus, string> = {
    completed: 'เสร็จสิ้น',
    in_progress: 'กำลังดำเนินการ',
    pending: 'ยังแก้ไขไม่เสร็จ'
  };

  const header = ['รหัสงาน', 'วันที่', 'เวลา', 'ผู้ทำรายงาน (IT)', 'ชื่อ User', 'ชื่ออุปกรณ์', 'หมวดหมู่', 'ชื่อระบบโปรแกรม', 'แผนก', 'สถานะ', 'รายละเอียดปัญหา', 'การแก้ไขปัญหา', 'หมายเหตุ'];
  const rows = reports.map(r => [
    r.id,
    r.date,
    r.time || '',
    r.reporter,
    r.userName || '-',
    r.equipmentName,
    r.equipmentCategory,
    r.programName || '-',
    r.department || '-',
    statusMap[r.status],
    r.problemDetails.replace(/\t/g, ' ').replace(/\n/g, ' '),
    r.resolutionDetails.replace(/\t/g, ' ').replace(/\n/g, ' '),
    r.notes || '-'
  ]);

  const text = [header.join('\t'), ...rows.map(r => r.join('\t'))].join('\n');
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Copy failed:', err);
    return false;
  }
}

/**
 * Sync a new report directly to Google Sheets via Google Apps Script Web App
 */
export async function sendReportToGoogleSheets(report: ITWorkReport, webAppUrl: string): Promise<boolean> {
  if (!webAppUrl || !webAppUrl.startsWith('http')) return false;

  const payload = {
    action: 'create',
    id: report.id,
    date: report.date,
    time: report.time || '',
    reporter: report.reporter,
    userName: report.userName || '',
    equipmentName: report.equipmentName,
    equipmentCategory: report.equipmentCategory,
    programName: report.programName || '',
    department: report.department || '',
    problemDetails: report.problemDetails,
    problemImagesCount: report.problemImages?.length || 0,
    problemImagesSummary: report.problemImages?.length ? `${report.problemImages.length} รูป` : 'ไม่มีรูป',
    resolutionDetails: report.resolutionDetails,
    resolutionImagesCount: report.resolutionImages?.length || 0,
    resolutionImagesSummary: report.resolutionImages?.length ? `${report.resolutionImages.length} รูป` : 'ไม่มีรูป',
    status: report.status === 'completed' ? 'เสร็จสิ้น' : report.status === 'in_progress' ? 'กำลังดำเนินการ' : 'ยังแก้ไขไม่เสร็จ',
    priority: report.priority || 'medium',
    cost: report.cost || 0,
    notes: report.notes || '',
    createdAt: report.createdAt
  };

  try {
    // Send via POST to Google Apps Script Web App
    await fetch(webAppUrl, {
      method: 'POST',
      mode: 'no-cors', // standard for Apps Script Web App without CORS headaches
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });
    return true;
  } catch (err) {
    console.error('Failed to send to Google Sheets Web App:', err);
    return false;
  }
}

/**
 * Fetch and parse data from Google Sheets (via Apps Script Web App or Published CSV)
 */
export async function fetchReportsFromGoogleSheets(config: SheetConfig): Promise<{ success: boolean; reports?: ITWorkReport[]; message: string }> {
  // Option 1: Via Published CSV URL
  if (config.csvUrl && config.csvUrl.trim().length > 0) {
    try {
      let fetchUrl = config.csvUrl.trim();
      // Handle Google Sheet standard URLs by converting to csv export if needed
      if (fetchUrl.includes('docs.google.com/spreadsheets/d/')) {
        if (!fetchUrl.includes('export?format=csv') && !fetchUrl.includes('pub?output=csv')) {
          const match = fetchUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
          if (match && match[1]) {
            fetchUrl = `https://docs.google.com/spreadsheets/d/${match[1]}/export?format=csv`;
          }
        }
      }

      const res = await fetch(fetchUrl);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const csvText = await res.text();
      const parsedReports = parseCSVToReports(csvText);
      if (parsedReports.length > 0) {
        return {
          success: true,
          reports: parsedReports,
          message: `ดึงข้อมูลจาก Google Sheets สำเร็จ (${parsedReports.length} รายการ)`
        };
      }
    } catch (err: any) {
      console.warn('CSV fetch failed:', err);
    }
  }

  // Option 2: Via Apps Script Web App (JSON endpoint)
  if (config.webAppUrl && config.webAppUrl.trim().length > 0) {
    try {
      const url = new URL(config.webAppUrl.trim());
      url.searchParams.set('action', 'read');
      const res = await fetch(url.toString());
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const formattedReports: ITWorkReport[] = data.map((item, index) => ({
            id: item.id || `IT-${item.date || 'DATA'}-${index + 1}`,
            date: item.date || new Date().toISOString().slice(0, 10),
            time: item.time || '',
            reporter: item.reporter || 'เจ้าหน้าที่ไอที',
            userName: item.userName || item.user || '',
            equipmentName: item.equipmentName || item.equipment || 'อุปกรณ์ไอที',
            equipmentCategory: mapCategory(item.equipmentCategory || item.category),
            programName: item.programName || item.softwareName || item.program || undefined,
            department: item.department || '',
            problemDetails: item.problemDetails || item.problem || '',
            problemImages: Array.isArray(item.problemImages) ? item.problemImages : [],
            resolutionDetails: item.resolutionDetails || item.resolution || '',
            resolutionImages: Array.isArray(item.resolutionImages) ? item.resolutionImages : [],
            status: mapStatus(item.status),
            priority: item.priority || 'medium',
            cost: Number(item.cost) || 0,
            notes: item.notes || '',
            syncedToSheets: true,
            createdAt: item.createdAt || new Date().toISOString(),
            updatedAt: item.updatedAt || new Date().toISOString()
          }));

          return {
            success: true,
            reports: formattedReports,
            message: `ดึงข้อมูลจาก Google Apps Script สำเร็จ (${formattedReports.length} รายการ)`
          };
        }
      }
    } catch (err: any) {
      console.warn('Apps Script JSON fetch failed:', err);
    }
  }

  return {
    success: false,
    message: 'ไม่สามารถดึงข้อมูลได้ โปรดตรวจสอบ URL ของ Google Sheet หรือ Apps Script'
  };
}

/**
 * Robust CSV parser for Google Sheets export
 */
function parseCSVToReports(csvText: string): ITWorkReport[] {
  const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length < 2) return [];

  // Parse header
  const parseLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  };

  const header = parseLine(lines[0]).map(h => h.replace(/^\uFEFF/, '').toLowerCase());
  const reports: ITWorkReport[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = parseLine(lines[i]);
    if (cols.length < 3) continue;

    const getVal = (keywords: string[]): string => {
      const idx = header.findIndex(h => keywords.some(k => h.includes(k)));
      return idx !== -1 && cols[idx] ? cols[idx] : '';
    };

    const id = getVal(['รหัส', 'id']) || `IT-ROW-${i}`;
    const date = getVal(['วัน', 'date']) || new Date().toISOString().slice(0, 10);
    const reporter = getVal(['ผู้ทำ', 'ผู้รายงาน', 'reporter', 'name']) || 'เจ้าหน้าที่ไอที';
    const userName = getVal(['user', 'ผู้ใช้', 'ผู้แจ้ง']) || '';
    const equipmentName = getVal(['อุปกรณ์', 'equipment', 'เครื่อง']) || 'อุปกรณ์ทั่วไป';
    const programName = getVal(['โปรแกรม', 'program', 'software', 'ระบบ']) || '';
    const problemDetails = getVal(['ปัญหา', 'problem', 'อาการ', 'issue']) || 'ไม่มีรายละเอียดปัญหา';
    const resolutionDetails = getVal(['แก้ไข', 'resolution', 'วิธี', 'action']) || 'รอตรวจสอบ';
    const statusRaw = getVal(['สถานะ', 'status']);
    const categoryRaw = getVal(['หมวด', 'category', 'ประเภท']);
    const department = getVal(['แผนก', 'department', 'สถานที่']);
    const notes = getVal(['หมายเหตุ', 'note', 'remark']);

    reports.push({
      id,
      date,
      time: getVal(['เวลา', 'time']) || '09:00',
      reporter,
      userName: userName || undefined,
      equipmentName,
      equipmentCategory: mapCategory(categoryRaw),
      programName: programName || undefined,
      department,
      problemDetails,
      problemImages: [],
      resolutionDetails,
      resolutionImages: [],
      status: mapStatus(statusRaw),
      notes,
      syncedToSheets: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }

  return reports;
}

function mapStatus(raw: string = ''): ReportStatus {
  const lower = raw.toLowerCase();
  if (lower.includes('เสร็จ') || lower.includes('complete') || lower.includes('done') || lower.includes('resolved')) {
    return 'completed';
  }
  if (lower.includes('ดำเนิน') || lower.includes('progress') || lower.includes('doing') || lower.includes('แก้ไขอยู่')) {
    return 'in_progress';
  }
  return 'pending';
}

function mapCategory(raw: string = ''): EquipmentCategory {
  const lower = raw.toLowerCase();
  if (lower.includes('โปรแกรม') || lower.includes('soft') || lower.includes('software') || lower.includes('email') || lower.includes('windows')) return 'software';
  if (lower.includes('note') || lower.includes('โน้ตบุ๊ก') || lower.includes('laptop')) return 'notebook';
  if (lower.includes('print') || lower.includes('พิมพ์')) return 'printer';
  if (lower.includes('net') || lower.includes('wifi') || lower.includes('switch') || lower.includes('router') || lower.includes('แลน')) return 'network';
  if (lower.includes('server') || lower.includes('เซิร์ฟ')) return 'server';
  if (lower.includes('cctv') || lower.includes('กล้อง')) return 'cctv';
  if (lower.includes('soft') || lower.includes('โปรแกรม') || lower.includes('email') || lower.includes('windows')) return 'software';
  if (lower.includes('pc') || lower.includes('คอม') || lower.includes('computer')) return 'computer';
  return 'other';
}

/**
 * Complete Google Apps Script template for the user to copy-paste into Google Sheets
 */
export const GOOGLE_APPS_SCRIPT_CODE = `/**
 * Google Apps Script สำหรับรับและส่งข้อมูล Daily IT Work Report
 * วิธีติดตั้ง:
 * 1. เปิด Google Sheet ของท่าน
 * 2. ไปที่ ส่วนขยาย (Extensions) -> Apps Script
 * 3. ลบโค้ดเดิมทั้งหมด แล้ววางโค้ดนี้ลงไป
 * 4. กด บันทึก (Save)
 * 5. กด การทำให้ใช้งานได้ (Deploy) -> การทำให้ใช้งานได้รายการใหม่ (New Deployment)
 * 6. เลือกประเภท: เว็บแอป (Web App)
 * 7. กำหนด: Execute as = "Me" (ฉัน), Who has access = "Anyone" (ทุกคน)
 * 8. กด Deploy และคัดลอก URL ของเว็บแอปมาใส่ในระบบ Daily IT Report
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // สร้างหัวตารางอัตโนมัติหากยังไม่มี
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "รหัสงาน (ID)",
        "วันที่ (Date)",
        "เวลา (Time)",
        "ผู้ทำรายงาน (Reporter)",
        "ชื่อ User (User)",
        "ชื่ออุปกรณ์ (Equipment)",
        "หมวดหมู่อุปกรณ์ (Category)",
        "ชื่อระบบโปรแกรม (Program Name)",
        "แผนก/สถานที่ (Department)",
        "สถานะงาน (Status)",
        "ความเร่งด่วน (Priority)",
        "รายละเอียดปัญหา (Problem Details)",
        "จำนวนรูปปัญหา (Problem Images)",
        "การแก้ไขปัญหา (Resolution Details)",
        "จำนวนรูปแก้ไข (Resolution Images)",
        "ค่าใช้จ่าย (Cost)",
        "หมายเหตุ (Notes)",
        "เวลาที่บันทึก (Timestamp)"
      ]);
      sheet.getRange(1, 1, 1, 18).setFontWeight("bold").setBackground("#e2e8f0");
    }
    
    var data = JSON.parse(e.postData.contents);
    
    sheet.appendRow([
      data.id || ("IT-" + Utilities.formatDate(new Date(), "GMT+7", "yyyyMMdd-HHmmss")),
      data.date || Utilities.formatDate(new Date(), "GMT+7", "yyyy-MM-dd"),
      data.time || Utilities.formatDate(new Date(), "GMT+7", "HH:mm"),
      data.reporter || "-",
      data.userName || "-",
      data.equipmentName || "-",
      data.equipmentCategory || "-",
      data.programName || "-",
      data.department || "-",
      data.status || "เสร็จสิ้น",
      data.priority || "ปกติ",
      data.problemDetails || "-",
      data.problemImagesSummary || "0 รูป",
      data.resolutionDetails || "-",
      data.resolutionImagesSummary || "0 รูป",
      data.cost || 0,
      data.notes || "-",
      new Date().toISOString()
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ "status": "success", "message": "Saved successfully" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var rows = sheet.getDataRange().getValues();
    if (rows.length < 2) {
      return ContentService.createTextOutput(JSON.stringify([]))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    var data = [];
    for (var i = 1; i < rows.length; i++) {
      var row = rows[i];
      data.push({
        id: row[0],
        date: Utilities.formatDate(new Date(row[1]), "GMT+7", "yyyy-MM-dd"),
        time: String(row[2]),
        reporter: row[3],
        userName: row[4],
        equipmentName: row[5],
        equipmentCategory: row[6],
        programName: row[7],
        department: row[8],
        status: row[9],
        priority: row[10],
        problemDetails: row[11],
        problemImagesCount: row[12],
        resolutionDetails: row[13],
        resolutionImagesCount: row[14],
        cost: row[15],
        notes: row[16],
        createdAt: row[17]
      });
    }
    
    return ContentService.createTextOutput(JSON.stringify(data))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ "error": err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
`;
