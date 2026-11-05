import React from 'react';
import { 
  Wrench, 
  PlusCircle, 
  LayoutDashboard, 
  FileSpreadsheet, 
  Download, 
  Copy, 
  RefreshCw,
  CheckCircle2,
  HardDrive
} from 'lucide-react';
import { SheetConfig } from '../types/report';

interface NavbarProps {
  currentTab: 'dashboard' | 'new-report';
  setCurrentTab: (tab: 'dashboard' | 'new-report') => void;
  onOpenSheetModal: () => void;
  onExportCSV: () => void;
  onCopySheet: () => void;
  onSyncSheets: () => void;
  sheetConfig: SheetConfig;
  isSyncing: boolean;
  totalReports: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  onOpenSheetModal,
  onExportCSV,
  onCopySheet,
  onSyncSheets,
  sheetConfig,
  isSyncing,
  totalReports
}) => {
  const isSheetConnected = Boolean(sheetConfig.webAppUrl || sheetConfig.csvUrl);

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand Title */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20 ring-1 ring-blue-400/30">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
                  IT Daily Report
                </span>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  ระบบรายงานงานไอที
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                บันทึกและติดตามงานซ่อมบำรุงไอทีประจำวัน
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center space-x-1 sm:space-x-2 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
            <button
              onClick={() => setCurrentTab('dashboard')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'dashboard'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>แดชบอร์ดงาน ({totalReports})</span>
            </button>

            <button
              onClick={() => setCurrentTab('new-report')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'new-report'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>บันทึกงานใหม่</span>
            </button>
          </div>

          {/* Quick Actions & Google Sheets Sync */}
          <div className="flex items-center space-x-2">
            {/* Google Sheets Status & Connect Button */}
            <button
              onClick={onOpenSheetModal}
              title="ตั้งค่าการเชื่อมต่อ Google Sheets"
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                isSheetConnected
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/50'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <FileSpreadsheet className={`w-4 h-4 ${isSheetConnected ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span className="hidden md:inline">
                {isSheetConnected ? 'เชื่อมต่อ Google Sheet แล้ว' : 'ตั้งค่า Google Sheets'}
              </span>
              {isSheetConnected && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              )}
            </button>

            {/* Sync Button if connected */}
            {isSheetConnected && (
              <button
                onClick={onSyncSheets}
                disabled={isSyncing}
                title="ดึงข้อมูลล่าสุดจาก Google Sheets"
                className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-blue-400' : ''}`} />
              </button>
            )}

            {/* Quick Export Menu */}
            <div className="hidden sm:flex items-center space-x-1">
              <button
                onClick={onExportCSV}
                title="ส่งออกไฟล์ CSV สำหรับ Excel / Google Sheets"
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition"
              >
                <Download className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden lg:inline">ส่งออก CSV</span>
              </button>

              <button
                onClick={onCopySheet}
                title="คัดลอกข้อมูลเพื่อวาง (Ctrl+V) ลง Google Sheets ทันที"
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition"
              >
                <Copy className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden lg:inline">คัดลอกตาราง</span>
              </button>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
