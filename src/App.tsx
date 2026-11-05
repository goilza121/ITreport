import React, { useState, useEffect, useMemo } from 'react';
import { 
  ITWorkReport, 
  SheetConfig, 
  FilterOptions, 
  ReportStatus 
} from './types/report';
import { 
  getStoredReports, 
  saveReports, 
  getStoredSheetConfig, 
  saveSheetConfig, 
  exportToCSV, 
  copyForGoogleSheet, 
  sendReportToGoogleSheets, 
  fetchReportsFromGoogleSheets 
} from './services/storage';
import { Navbar } from './components/Navbar';
import { StatsCards } from './components/StatsCards';
import { FilterBar } from './components/FilterBar';
import { ReportCard } from './components/ReportCard';
import { ReportTable } from './components/ReportTable';
import { NewReportView } from './components/NewReportView';
import { ReportDetailModal } from './components/ReportDetailModal';
import { GoogleSheetsModal } from './components/GoogleSheetsModal';
import { PrintSlipModal } from './components/PrintSlipModal';
import { ImageLightbox } from './components/ImageLightbox';
import { 
  PlusCircle, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  RefreshCw,
  FileSpreadsheet
} from 'lucide-react';

export default function App() {
  const [reports, setReports] = useState<ITWorkReport[]>(() => getStoredReports());
  const [sheetConfig, setSheetConfig] = useState<SheetConfig>(() => getStoredSheetConfig());
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'new-report'>('dashboard');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  
  // Modals
  const [selectedReport, setSelectedReport] = useState<ITWorkReport | null>(null);
  const [printableReport, setPrintableReport] = useState<ITWorkReport | null>(null);
  const [lightboxImage, setLightboxImage] = useState<{ url: string; title: string } | null>(null);
  const [isSheetModalOpen, setIsSheetModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Toast Notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Filter State
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    status: 'all',
    category: 'all',
    search: '',
    dateFilter: 'all',
  });

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Sync to localStorage whenever reports change
  useEffect(() => {
    saveReports(reports);
  }, [reports]);

  // Handle Save Sheet Config
  const handleSaveSheetConfig = (newConfig: SheetConfig) => {
    setSheetConfig(newConfig);
    saveSheetConfig(newConfig);
    showToast('บันทึกการตั้งค่า Google Sheets แล้ว');
  };

  // Handle Sync from Google Sheets
  const handleSyncSheets = async () => {
    if (!sheetConfig.webAppUrl && !sheetConfig.csvUrl) {
      setIsSheetModalOpen(true);
      return;
    }
    setIsSyncing(true);
    try {
      const result = await fetchReportsFromGoogleSheets(sheetConfig);
      if (result.success && result.reports && result.reports.length > 0) {
        // Merge or replace reports with sheets data
        const existingIds = new Set(result.reports.map(r => r.id));
        const localOnly = reports.filter(r => !existingIds.has(r.id));
        const merged = [...result.reports, ...localOnly];
        setReports(merged);
        saveReports(merged);
        showToast(result.message, 'success');
      } else {
        showToast(result.message, 'error');
      }
    } catch (err: any) {
      showToast('ไม่สามารถเชื่อมต่อ Google Sheets ได้: ' + err.message, 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  // Handle Save New Report
  const handleSaveReport = async (newReport: ITWorkReport) => {
    // 1. Add to local reports
    const updated = [newReport, ...reports];
    setReports(updated);
    saveReports(updated);

    // 2. If Google Sheets Web App is connected and autoSync is true, push row to sheet!
    if (sheetConfig.webAppUrl && sheetConfig.autoSync) {
      try {
        await sendReportToGoogleSheets(newReport, sheetConfig.webAppUrl);
        showToast('บันทึกรายงานสำเร็จ และซิงค์ลง Google Sheet แล้ว!', 'success');
      } catch (err) {
        showToast('บันทึกในเครื่องสำเร็จ (การซิงค์ชีตล่าช้า)', 'info');
      }
    } else {
      showToast('บันทึกรายงานการปฏิบัติงานเรียบร้อยแล้ว!', 'success');
    }

    // Switch to dashboard view
    setCurrentTab('dashboard');
  };

  // Handle Update Status
  const handleUpdateStatus = (id: string, newStatus: ReportStatus) => {
    setReports(prev =>
      prev.map(r => {
        if (r.id === id) {
          const updated = { ...r, status: newStatus, updatedAt: new Date().toISOString() };
          // If modal is open with this report, update it as well
          if (selectedReport && selectedReport.id === id) {
            setSelectedReport(updated);
          }
          return updated;
        }
        return r;
      })
    );
    showToast(`อัปเดตสถานะงานเป็น "${newStatus === 'completed' ? 'เสร็จสิ้นแล้ว' : newStatus === 'in_progress' ? 'กำลังดำเนินการ' : 'ยังไม่เสร็จ'}" เรียบร้อย`);
  };

  // Handle Delete Report
  const handleDeleteReport = (id: string) => {
    setReports(prev => prev.filter(r => r.id !== id));
    showToast('ลบรายการรายงานเรียบร้อยแล้ว', 'info');
  };

  // Quick Export Handlers
  const handleExportCSV = () => {
    exportToCSV(filteredReports);
    showToast(`ส่งออกไฟล์ CSV จำนวน ${filteredReports.length} รายการแล้ว`);
  };

  const handleCopySheet = async () => {
    const success = await copyForGoogleSheet(filteredReports);
    if (success) {
      showToast('คัดลอกข้อมูลตารางแล้ว! กด Ctrl+V ลงใน Google Sheets ได้เลย');
    } else {
      showToast('ไม่สามารถคัดลอกข้อมูลได้', 'error');
    }
  };

  // Filter & Search Logic
  const filteredReports = useMemo(() => {
    return reports.filter(r => {
      // 1. Status Filter
      if (filterOptions.status !== 'all' && r.status !== filterOptions.status) {
        return false;
      }

      // 2. Category Filter
      if (filterOptions.category !== 'all' && r.equipmentCategory !== filterOptions.category) {
        return false;
      }

      // 3. Search query
      if (filterOptions.search.trim()) {
        const query = filterOptions.search.toLowerCase();
        const matchEquipment = r.equipmentName.toLowerCase().includes(query);
        const matchProblem = r.problemDetails.toLowerCase().includes(query);
        const matchResolution = (r.resolutionDetails || '').toLowerCase().includes(query);
        const matchReporter = r.reporter.toLowerCase().includes(query);
        const matchUser = (r.userName || '').toLowerCase().includes(query);
        const matchProgram = (r.programName || '').toLowerCase().includes(query);
        const matchDept = (r.department || '').toLowerCase().includes(query);
        const matchId = r.id.toLowerCase().includes(query);

        if (!matchEquipment && !matchProblem && !matchResolution && !matchReporter && !matchUser && !matchProgram && !matchDept && !matchId) {
          return false;
        }
      }

      // 4. Date filter
      if (filterOptions.dateFilter !== 'all') {
        const reportDate = new Date(r.date);
        const now = new Date();
        const todayStr = now.toISOString().slice(0, 10);

        if (filterOptions.dateFilter === 'today') {
          if (r.date !== todayStr) return false;
        } else if (filterOptions.dateFilter === 'this_week') {
          const startOfWeek = new Date(now);
          startOfWeek.setDate(now.getDate() - now.getDay());
          startOfWeek.setHours(0, 0, 0, 0);
          if (reportDate < startOfWeek) return false;
        } else if (filterOptions.dateFilter === 'this_month') {
          if (reportDate.getMonth() !== now.getMonth() || reportDate.getFullYear() !== now.getFullYear()) {
            return false;
          }
        }
      }

      return true;
    });
  }, [reports, filterOptions]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-4 z-50 flex items-center space-x-2 px-4 py-3 rounded-xl shadow-xl border animate-in slide-in-from-top-3 duration-200 bg-slate-900 text-white text-xs sm:text-sm">
          {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
          {toast.type === 'info' && <Info className="w-4 h-4 text-blue-400 shrink-0" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenSheetModal={() => setIsSheetModalOpen(true)}
        onExportCSV={handleExportCSV}
        onCopySheet={handleCopySheet}
        onSyncSheets={handleSyncSheets}
        sheetConfig={sheetConfig}
        isSyncing={isSyncing}
        totalReports={reports.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* VIEW 1: DASHBOARD */}
        {currentTab === 'dashboard' && (
          <div>
            
            {/* Top KPI Stats Cards */}
            <StatsCards
              reports={reports}
              activeStatusFilter={filterOptions.status}
              onSelectStatus={(status) => setFilterOptions(prev => ({ ...prev, status }))}
            />

            {/* Google Sheets Connection Prompt Bar (if not yet connected) */}
            {(!sheetConfig.webAppUrl && !sheetConfig.csvUrl) && (
              <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">
                      ต้องการเชื่อมต่อบันทึกข้อมูลลง Google Sheets ของคุณหรือไม่?
                    </h4>
                    <p className="text-xs text-slate-400">
                      ใช้งานง่าย ไม่ต้องทำ API แค่วางโค้ด Google Apps Script สั้น ๆ ก็ซิงค์ข้อมูลกับชีตได้ทันที
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsSheetModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold whitespace-nowrap transition shadow-sm"
                >
                  เชื่อมต่อ Google Sheets ตอนนี้
                </button>
              </div>
            )}

            {/* Search & Filter Toolbar */}
            <FilterBar
              filterOptions={filterOptions}
              setFilterOptions={setFilterOptions}
              viewMode={viewMode}
              setViewMode={setViewMode}
              resultCount={filteredReports.length}
            />

            {/* Reports Display: Cards Grid or Table */}
            {filteredReports.length === 0 ? (
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-500">
                  <PlusCircle className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">ไม่พบรายงานที่ตรงกับตัวกรอง</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mb-5">
                  ท่านสามารถเปลี่ยนคำค้นหา หรือเริ่มต้นสร้างบันทึกรายงานการปฏิบัติงานไอทีใหม่ได้ทันที
                </p>
                <button
                  onClick={() => setCurrentTab('new-report')}
                  className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 transition"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>สร้างรายงานงานใหม่</span>
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredReports.map((report) => (
                  <ReportCard
                    key={report.id}
                    report={report}
                    onViewDetails={(r) => setSelectedReport(r)}
                    onUpdateStatus={handleUpdateStatus}
                    onPrintSlip={(r) => setPrintableReport(r)}
                    onOpenImage={(url, title) => setLightboxImage({ url, title })}
                  />
                ))}
              </div>
            ) : (
              <ReportTable
                reports={filteredReports}
                onViewDetails={(r) => setSelectedReport(r)}
                onUpdateStatus={handleUpdateStatus}
                onPrintSlip={(r) => setPrintableReport(r)}
                onOpenImage={(url, title) => setLightboxImage({ url, title })}
              />
            )}

          </div>
        )}

        {/* VIEW 2: NEW REPORT FORM */}
        {currentTab === 'new-report' && (
          <NewReportView
            onSaveReport={handleSaveReport}
            onCancel={() => setCurrentTab('dashboard')}
            isSheetConnected={Boolean(sheetConfig.webAppUrl || sheetConfig.csvUrl)}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-900/60 py-4 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>ระบบรายงานการปฏิบัติงานไอทีประจำวัน (IT Daily Work Report)</span>
          <span className="flex items-center gap-2">
            <span>สถานะพื้นที่จัดเก็บ: ทำงานปกติ (Local Cache + Google Sheets)</span>
          </span>
        </div>
      </footer>

      {/* Modals */}
      <ReportDetailModal
        report={selectedReport}
        onClose={() => setSelectedReport(null)}
        onUpdateStatus={handleUpdateStatus}
        onDeleteReport={handleDeleteReport}
        onPrintSlip={(r) => setPrintableReport(r)}
        onOpenImage={(url, title) => setLightboxImage({ url, title })}
      />

      <GoogleSheetsModal
        isOpen={isSheetModalOpen}
        onClose={() => setIsSheetModalOpen(false)}
        sheetConfig={sheetConfig}
        onSaveConfig={handleSaveSheetConfig}
        onSync={handleSyncSheets}
        isSyncing={isSyncing}
        onExportCSV={handleExportCSV}
        onCopySheet={handleCopySheet}
      />

      <PrintSlipModal
        report={printableReport}
        onClose={() => setPrintableReport(null)}
      />

      <ImageLightbox
        imageUrl={lightboxImage?.url || null}
        title={lightboxImage?.title}
        onClose={() => setLightboxImage(null)}
      />

    </div>
  );
}
