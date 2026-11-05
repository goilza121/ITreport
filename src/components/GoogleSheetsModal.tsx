import React, { useState } from 'react';
import { 
  X, 
  FileSpreadsheet, 
  Copy, 
  Check, 
  RefreshCw, 
  ExternalLink, 
  Sparkles, 
  HelpCircle,
  Download,
  AlertCircle,
  Database
} from 'lucide-react';
import { SheetConfig } from '../types/report';
import { GOOGLE_APPS_SCRIPT_CODE } from '../services/storage';

interface GoogleSheetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  sheetConfig: SheetConfig;
  onSaveConfig: (config: SheetConfig) => void;
  onSync: () => Promise<void>;
  isSyncing: boolean;
  onExportCSV: () => void;
  onCopySheet: () => void;
}

export const GoogleSheetsModal: React.FC<GoogleSheetsModalProps> = ({
  isOpen,
  onClose,
  sheetConfig,
  onSaveConfig,
  onSync,
  isSyncing,
  onExportCSV,
  onCopySheet,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'apps_script' | 'csv' | 'export'>('apps_script');
  const [webAppUrl, setWebAppUrl] = useState(sheetConfig.webAppUrl || '');
  const [csvUrl, setCsvUrl] = useState(sheetConfig.csvUrl || '');
  const [autoSync, setAutoSync] = useState(sheetConfig.autoSync ?? true);
  const [hasCopiedCode, setHasCopiedCode] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_CODE);
      setHasCopiedCode(true);
      setTimeout(() => setHasCopiedCode(false), 3000);
    } catch (err) {
      console.error('Failed to copy code', err);
    }
  };

  const handleSave = () => {
    onSaveConfig({
      webAppUrl: webAppUrl.trim(),
      csvUrl: csvUrl.trim(),
      autoSync,
      lastSyncedAt: new Date().toISOString()
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div 
        className="relative bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                เชื่อมต่อ Google Sheets (ไม่ต้องทำ API)
              </h2>
              <p className="text-xs text-slate-400">
                บันทึกข้อมูลรายงานงาน IT และดึงข้อมูลมาแสดงผลบน Dashboard แบบ Real-time
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-5 pt-3">
          <button
            onClick={() => setActiveTab('apps_script')}
            className={`pb-3 px-3 text-xs sm:text-sm font-medium border-b-2 transition flex items-center gap-2 ${
              activeTab === 'apps_script'
                ? 'border-emerald-500 text-emerald-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Google Apps Script (แนะนำ - ซิงค์ 2 ทาง)</span>
          </button>

          <button
            onClick={() => setActiveTab('csv')}
            className={`pb-3 px-3 text-xs sm:text-sm font-medium border-b-2 transition flex items-center gap-2 ${
              activeTab === 'csv'
                ? 'border-blue-500 text-blue-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-4 h-4 text-blue-400" />
            <span>แชร์ลิงก์ CSV จากชีต</span>
          </button>

          <button
            onClick={() => setActiveTab('export')}
            className={`pb-3 px-3 text-xs sm:text-sm font-medium border-b-2 transition flex items-center gap-2 ${
              activeTab === 'export'
                ? 'border-indigo-500 text-indigo-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Download className="w-4 h-4 text-indigo-400" />
            <span>ส่งออก / วางข้อมูลด้วยตนเอง</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 space-y-5 overflow-y-auto flex-1 text-sm">
          
          {/* TAB 1: Apps Script */}
          {activeTab === 'apps_script' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-emerald-300 text-xs leading-relaxed">
                <span className="font-semibold block mb-1">💡 วิธีที่ง่ายที่สุดและไม่ต้องเสียเงิน หรือตั้งค่า Google Cloud API ใด ๆ:</span>
                เพียงคัดลอกโค้ดสั้น ๆ ด้านล่าง ไปวางในเมนู <strong>ส่วนขยาย (Extensions) -&gt; Apps Script</strong> ของชีตท่าน แล้วกด <strong>Deploy เป็น Web App</strong> จะได้ URL มาใช้งานทันที!
              </div>

              {/* Step instructions */}
              <div className="space-y-2 text-xs text-slate-300">
                <p className="font-semibold text-white">ขั้นตอนติดตั้งง่าย ๆ ใน 1 นาที:</p>
                <ol className="list-decimal list-inside space-y-1.5 pl-1 text-slate-400">
                  <li>เปิด Google Sheets ใหม่ที่ต้องการใช้เก็บข้อมูล</li>
                  <li>คลิกเมนู <strong>ส่วนขยาย (Extensions)</strong> &gt; <strong>Apps Script</strong></li>
                  <li>ลบโค้ดเดิมทั้งหมด แล้วคลิกปุ่ม <strong>"คัดลอกโค้ด Apps Script"</strong> ด้านล่างนี้ไปวาง</li>
                  <li>คลิก <strong>การทำให้ใช้งานได้ (Deploy)</strong> &gt; <strong>การทำให้ใช้งานได้รายการใหม่ (New Deployment)</strong></li>
                  <li>เลือกประเภท: <strong>เว็บแอป (Web app)</strong>, ตั้ง Who has access = <strong>"Anyone" (ทุกคน)</strong></li>
                  <li>กด Deploy แล้วนำ <strong>URL ของเว็บแอป</strong> มาวางในช่องด้านล่าง</li>
                </ol>
              </div>

              {/* Code block with copy button */}
              <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                <div className="flex items-center justify-between px-3 py-2 bg-slate-800/60 border-b border-slate-800 text-xs text-slate-400">
                  <span>Google Apps Script (doPost & doGet)</span>
                  <button
                    onClick={handleCopyCode}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition"
                  >
                    {hasCopiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{hasCopiedCode ? 'คัดลอกสำเร็จแล้ว!' : 'คัดลอกโค้ด'}</span>
                  </button>
                </div>
                <pre className="p-3 text-[11px] font-mono text-slate-300 max-h-36 overflow-y-auto">
                  {GOOGLE_APPS_SCRIPT_CODE}
                </pre>
              </div>

              {/* Web App URL Input */}
              <div>
                <label className="block text-xs font-semibold text-white mb-1.5">
                  URL ของ Google Apps Script Web App:
                </label>
                <input
                  type="url"
                  placeholder="https://script.google.com/macros/s/AKfycbx.../exec"
                  value={webAppUrl}
                  onChange={(e) => setWebAppUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-xs"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center space-x-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={autoSync}
                    onChange={(e) => setAutoSync(e.target.checked)}
                    className="rounded bg-slate-800 border-slate-700 text-emerald-500 focus:ring-0"
                  />
                  <span>บันทึกลง Google Sheets ทันทีที่กดส่งรายงาน</span>
                </label>

                {webAppUrl && (
                  <button
                    type="button"
                    onClick={onSync}
                    disabled={isSyncing}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-900/40 text-xs font-medium transition disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>{isSyncing ? 'กำลังดึงข้อมูล...' : 'ทดสอบดึงข้อมูลทันที'}</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: Published CSV URL */}
          {activeTab === 'csv' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-blue-950/30 border border-blue-800/40 text-blue-300 text-xs leading-relaxed">
                <span className="font-semibold block mb-1">💡 หากต้องการเพียงดึงข้อมูลจาก Google Sheet มาแสดงบน Dashboard:</span>
                คุณสามารถกด <strong>ไฟล์ (File) -&gt; แชร์ (Share) -&gt; เผยแพร่ไปยังเว็บ (Publish to web)</strong> แล้วเลือกรูปแบบเป็น <strong>CSV</strong> นำลิงก์มาวางที่นี่ได้ทันที
              </div>

              <div>
                <label className="block text-xs font-semibold text-white mb-1.5">
                  ลิงก์ Google Sheets หรือ Published CSV URL:
                </label>
                <input
                  type="url"
                  placeholder="https://docs.google.com/spreadsheets/d/.../export?format=csv"
                  value={csvUrl}
                  onChange={(e) => setCsvUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={onSync}
                  disabled={!csvUrl || isSyncing}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'กำลังดึงข้อมูล...' : 'ดึงข้อมูลจากชีตเข้าแดชบอร์ด'}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: Export & Manual Copy */}
          {activeTab === 'export' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-300">
                หากท่านต้องการนำรายงานทั้งหมดไปใส่ใน Google Sheets หรือ Microsoft Excel ด้วยตนเอง สามารถเลือกวิธีด้านล่างได้ทันที:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 flex flex-col justify-between">
                  <div>
                    <h4 className="font-semibold text-white text-sm mb-1">คัดลอกตาราง (One-Click Copy)</h4>
                    <p className="text-xs text-slate-400 mb-3">
                      คัดลอกข้อมูลทั้งตารางไปวาง (Ctrl+V) ลงบนหน้า Google Sheets ได้ทันทีอย่างสวยงาม
                    </p>
                  </div>
                  <button
                    onClick={onCopySheet}
                    className="flex items-center justify-center space-x-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>คัดลอกข้อมูลลงคลิปบอร์ด</span>
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 flex flex-col justify-between">
                  <div>
                    <h4 className="font-semibold text-white text-sm mb-1">ดาวน์โหลดไฟล์ CSV (UTF-8)</h4>
                    <p className="text-xs text-slate-400 mb-3">
                      ดาวน์โหลดไฟล์ .csv ที่รองรับภาษาไทยเต็มรูปแบบ สำหรับเปิดใน Google Sheets หรือ Excel
                    </p>
                  </div>
                  <button
                    onClick={onExportCSV}
                    className="flex items-center justify-center space-x-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>ดาวน์โหลดไฟล์ CSV</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            {savedSuccess ? (
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <Check className="w-4 h-4" /> บันทึกการตั้งค่าเรียบร้อยแล้ว!
              </span>
            ) : (
              sheetConfig.lastSyncedAt ? `ซิงค์ล่าสุด: ${new Date(sheetConfig.lastSyncedAt).toLocaleTimeString('th-TH')}` : 'ยังไม่ได้เชื่อมต่อชีต'
            )}
          </span>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-700 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition"
            >
              ปิด
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition"
            >
              บันทึกการตั้งค่า
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
