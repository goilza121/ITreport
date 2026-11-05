import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ChevronRight, 
  Image as ImageIcon,
  Printer as PrintIcon,
  Monitor
} from 'lucide-react';
import { ITWorkReport, ReportStatus } from '../types/report';

interface ReportTableProps {
  reports: ITWorkReport[];
  onViewDetails: (report: ITWorkReport) => void;
  onUpdateStatus: (id: string, newStatus: ReportStatus) => void;
  onPrintSlip: (report: ITWorkReport) => void;
  onOpenImage: (imageUrl: string, title: string) => void;
}

export const ReportTable: React.FC<ReportTableProps> = ({
  reports,
  onViewDetails,
  onUpdateStatus,
  onPrintSlip,
  onOpenImage,
}) => {
  const getStatusBadge = (status: ReportStatus) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" />
            เสร็จสิ้น
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <Clock className="w-3 h-3 animate-pulse" />
            กำลังทำ
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <AlertCircle className="w-3 h-3" />
            ยังไม่เสร็จ
          </span>
        );
    }
  };

  if (reports.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
        <Monitor className="w-12 h-12 mx-auto mb-3 text-slate-600 opacity-60" />
        <h4 className="text-base font-semibold text-slate-300">ไม่พบรายการรายงานที่ตรงตามเงื่อนไข</h4>
        <p className="text-xs text-slate-500 mt-1">ลองเปลี่ยนคำค้นหา หรือรีเซ็ตตัวกรองด้านบน</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-800/70 text-xs font-semibold uppercase text-slate-400 border-b border-slate-700/60">
            <tr>
              <th className="px-4 py-3.5">วันที่ / รหัส</th>
              <th className="px-4 py-3.5">ชื่ออุปกรณ์ & แผนก</th>
              <th className="px-4 py-3.5">ผู้ทำรายงาน</th>
              <th className="px-4 py-3.5">สถานะงาน</th>
              <th className="px-4 py-3.5">รายละเอียดปัญหา</th>
              <th className="px-4 py-3.5">การแก้ไขปัญหา</th>
              <th className="px-4 py-3.5 text-center">รูปประกอบ</th>
              <th className="px-4 py-3.5 text-right">การจัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {reports.map((report) => (
              <tr 
                key={report.id} 
                className="hover:bg-slate-800/40 transition group cursor-pointer"
                onClick={() => onViewDetails(report)}
              >
                {/* Date & ID */}
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <div className="font-medium text-white">{report.date}</div>
                  <div className="text-[11px] font-mono text-slate-500">{report.id}</div>
                </td>

                {/* Equipment & Department */}
                <td className="px-4 py-3.5 max-w-[220px]">
                  <div className="font-semibold text-white truncate hover:text-blue-400" title={report.equipmentName}>
                    {report.equipmentName}
                  </div>
                  <div className="text-xs text-slate-400 truncate flex items-center gap-1.5 flex-wrap mt-0.5">
                    <span>{report.department || (report.equipmentCategory === 'software' ? 'ระบบโปรแกรม' : report.equipmentCategory)}</span>
                    {report.programName && (
                      <span className="text-[10px] text-cyan-300 bg-cyan-950/70 border border-cyan-500/40 px-1.5 py-0.5 rounded font-medium">
                        โปรแกรม: {report.programName}
                      </span>
                    )}
                  </div>
                </td>

                {/* Reporter & User */}
                <td className="px-4 py-3.5 whitespace-nowrap text-xs text-slate-300">
                  <div className="font-medium text-slate-200">{report.reporter}</div>
                  {report.userName && (
                    <div className="text-[11px] text-indigo-300 mt-0.5">
                      User: {report.userName}
                    </div>
                  )}
                </td>

                {/* Status */}
                <td className="px-4 py-3.5 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-1.5">
                    {getStatusBadge(report.status)}
                  </div>
                </td>

                {/* Problem details */}
                <td className="px-4 py-3.5 max-w-[200px]">
                  <p className="text-xs text-slate-300 truncate" title={report.problemDetails}>
                    {report.problemDetails}
                  </p>
                </td>

                {/* Resolution details */}
                <td className="px-4 py-3.5 max-w-[200px]">
                  <p className="text-xs text-slate-300 truncate" title={report.resolutionDetails}>
                    {report.resolutionDetails || '-'}
                  </p>
                </td>

                {/* Photos count */}
                <td className="px-4 py-3.5 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
                    {report.problemImages?.length > 0 && (
                      <button
                        onClick={() => onOpenImage(report.problemImages[0], `รูปปัญหา: ${report.equipmentName}`)}
                        className="px-1.5 py-0.5 rounded bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:bg-rose-500/20 flex items-center gap-1"
                        title="ดูรูปปัญหา"
                      >
                        <ImageIcon className="w-3 h-3" />
                        <span>{report.problemImages.length}</span>
                      </button>
                    )}
                    {report.resolutionImages?.length > 0 && (
                      <button
                        onClick={() => onOpenImage(report.resolutionImages[0], `รูปแก้ไข: ${report.equipmentName}`)}
                        className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 flex items-center gap-1"
                        title="ดูรูปแก้ไข"
                      >
                        <ImageIcon className="w-3 h-3" />
                        <span>{report.resolutionImages.length}</span>
                      </button>
                    )}
                    {(!report.problemImages || report.problemImages.length === 0) &&
                     (!report.resolutionImages || report.resolutionImages.length === 0) && (
                      <span className="text-slate-600">-</span>
                    )}
                  </div>
                </td>

                {/* Actions */}
                <td className="px-4 py-3.5 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end space-x-1">
                    <button
                      onClick={() => onPrintSlip(report)}
                      className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white"
                      title="พิมพ์ใบงาน"
                    >
                      <PrintIcon className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onViewDetails(report)}
                      className="p-1.5 rounded-lg bg-blue-600/90 hover:bg-blue-600 text-white"
                      title="ดูรายละเอียดเต็ม"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
