import React from 'react';
import { 
  X, 
  Calendar, 
  User, 
  Monitor, 
  Building, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Printer as PrintIcon, 
  Trash2, 
  Coins, 
  FileText,
  Image as ImageIcon,
  ExternalLink,
  UserCheck,
  AppWindow
} from 'lucide-react';
import { ITWorkReport, ReportStatus } from '../types/report';

interface ReportDetailModalProps {
  report: ITWorkReport | null;
  onClose: () => void;
  onUpdateStatus: (id: string, newStatus: ReportStatus) => void;
  onDeleteReport: (id: string) => void;
  onPrintSlip: (report: ITWorkReport) => void;
  onOpenImage: (imageUrl: string, title: string) => void;
}

export const ReportDetailModal: React.FC<ReportDetailModalProps> = ({
  report,
  onClose,
  onUpdateStatus,
  onDeleteReport,
  onPrintSlip,
  onOpenImage,
}) => {
  if (!report) return null;

  const getStatusBadge = (status: ReportStatus) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-4 h-4" />
            เสร็จสิ้นแล้ว
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <Clock className="w-4 h-4 animate-pulse" />
            กำลังดำเนินการ
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <AlertCircle className="w-4 h-4" />
            ยังแก้ไขไม่เสร็จ / รออะไหล่
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div 
        className="relative bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-start justify-between bg-slate-900/60">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                {report.id}
              </span>
              {getStatusBadge(report.status)}
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              {report.equipmentName}
            </h2>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-blue-400" />
                ผู้ทำรายงาน (IT): <strong className="text-slate-200">{report.reporter}</strong>
              </span>
              {report.userName && (
                <span className="flex items-center gap-1 text-indigo-300 bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-500/20">
                  <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
                  User (ผู้ใช้งาน): <strong className="text-white">{report.userName}</strong>
                </span>
              )}
              {report.programName && (
                <span className="flex items-center gap-1 text-cyan-300 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-500/30">
                  <AppWindow className="w-3.5 h-3.5 text-cyan-400" />
                  ระบบโปรแกรม: <strong className="text-white">{report.programName}</strong>
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                วันที่: <strong className="text-slate-200">{report.date} {report.time ? `(${report.time} น.)` : ''}</strong>
              </span>
              {report.department && (
                <span className="flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-slate-500" />
                  แผนก: <strong className="text-slate-200">{report.department}</strong>
                </span>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 space-y-5 overflow-y-auto flex-1">
          
          {/* Status Switcher Bar */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-xs font-semibold text-slate-300">
              อัปเดตสถานะงานปัจจุบัน:
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onUpdateStatus(report.id, 'completed')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  report.status === 'completed'
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                    : 'bg-slate-800 text-emerald-400 hover:bg-emerald-950/40 border border-emerald-900/40'
                }`}
              >
                ✓ เสร็จสิ้นแล้ว
              </button>
              <button
                onClick={() => onUpdateStatus(report.id, 'in_progress')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  report.status === 'in_progress'
                    ? 'bg-amber-400 text-slate-950 font-bold shadow'
                    : 'bg-slate-800 text-amber-400 hover:bg-amber-950/40 border border-amber-900/40'
                }`}
              >
                ⏱ กำลังดำเนินการ
              </button>
              <button
                onClick={() => onUpdateStatus(report.id, 'pending')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  report.status === 'pending'
                    ? 'bg-rose-500 text-white font-bold shadow'
                    : 'bg-slate-800 text-rose-400 hover:bg-rose-950/40 border border-rose-900/40'
                }`}
              >
                ✕ ยังไม่เสร็จ / รออะไหล่
              </button>
            </div>
          </div>

          {/* Section 1: ปัญหารายละเอียดงาน & รูปภาพ */}
          <div className="bg-slate-950/40 border border-rose-950/40 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-rose-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                ปัญหารายละเอียดงาน
              </h3>
              <span className="text-xs text-slate-400">
                รูปปัญหา: {report.problemImages?.length || 0} รูป
              </span>
            </div>

            <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
              {report.problemDetails}
            </p>

            {/* Gallery of Problem Photos */}
            {report.problemImages && report.problemImages.length > 0 && (
              <div className="pt-2">
                <p className="text-xs font-medium text-slate-400 mb-2">รูปภาพประกอบปัญหา (คลิกเพื่อดูภาพขนาดเต็ม):</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {report.problemImages.map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => onOpenImage(img, `รูปปัญหา: ${report.equipmentName} (${idx + 1}/${report.problemImages.length})`)}
                      className="group cursor-pointer rounded-xl overflow-hidden border border-rose-900/40 bg-slate-900 aspect-video relative hover:border-rose-500 transition"
                    >
                      <img src={img} alt={`Problem photo ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-medium transition">
                        คลิกเพื่อซูม
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Section 2: การแก้ไขปัญหา & รูปภาพ */}
          <div className="bg-slate-950/40 border border-emerald-950/40 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                การแก้ไขปัญหา
              </h3>
              <span className="text-xs text-slate-400">
                รูปการแก้ไข: {report.resolutionImages?.length || 0} รูป
              </span>
            </div>

            <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
              {report.resolutionDetails || 'ยังไม่มีบันทึกการแก้ไข (อยู่ระหว่างดำเนินการ)'}
            </p>

            {/* Gallery of Resolution Photos */}
            {report.resolutionImages && report.resolutionImages.length > 0 && (
              <div className="pt-2">
                <p className="text-xs font-medium text-slate-400 mb-2">รูปภาพประกอบการแก้ไข (คลิกเพื่อดูภาพขนาดเต็ม):</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {report.resolutionImages.map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => onOpenImage(img, `รูปการแก้ไข: ${report.equipmentName} (${idx + 1}/${report.resolutionImages.length})`)}
                      className="group cursor-pointer rounded-xl overflow-hidden border border-emerald-900/40 bg-slate-900 aspect-video relative hover:border-emerald-500 transition"
                    >
                      <img src={img} alt={`Resolution photo ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-medium transition">
                        คลิกเพื่อซูม
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Section 3: ค่าใช้จ่ายและหมายเหตุ */}
          {(report.cost !== undefined || report.notes) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {report.cost !== undefined && (
                <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-3.5 flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Coins className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400">ค่าใช้จ่ายอะไหล่ / ค่าซ่อม</span>
                    <p className="text-base font-bold text-white">
                      {report.cost.toLocaleString('th-TH')} บาท
                    </p>
                  </div>
                </div>
              )}

              {report.notes && (
                <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-3.5 flex items-start space-x-3">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400">หมายเหตุเพิ่มเติม</span>
                    <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                      {report.notes}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer actions */}
        <div className="p-4 bg-slate-900/80 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={() => {
              if (confirm(`คุณต้องการลบรายงาน "${report.equipmentName}" ใช่หรือไม่?`)) {
                onDeleteReport(report.id);
                onClose();
              }
            }}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-medium text-rose-400 hover:bg-rose-950/40 border border-rose-900/40 transition"
          >
            <Trash2 className="w-4 h-4" />
            <span>ลบรายงานนี้</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onPrintSlip(report)}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 hover:text-white hover:bg-slate-700 transition"
            >
              <PrintIcon className="w-4 h-4 text-blue-400" />
              <span>พิมพ์ใบรายงานงาน (Print Slip)</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition"
            >
              ปิดหน้าต่าง
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
