import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Monitor, 
  Laptop, 
  Printer, 
  Wifi, 
  Server, 
  Camera, 
  Code, 
  Cpu, 
  User, 
  Calendar, 
  ChevronRight, 
  Image as ImageIcon,
  Printer as PrintIcon,
  Tag,
  Building,
  UserCheck,
  AppWindow
} from 'lucide-react';
import { ITWorkReport, ReportStatus, EquipmentCategory } from '../types/report';

interface ReportCardProps {
  report: ITWorkReport;
  onViewDetails: (report: ITWorkReport) => void;
  onUpdateStatus: (id: string, newStatus: ReportStatus) => void;
  onPrintSlip: (report: ITWorkReport) => void;
  onOpenImage: (imageUrl: string, title: string) => void;
}

export const ReportCard: React.FC<ReportCardProps> = ({
  report,
  onViewDetails,
  onUpdateStatus,
  onPrintSlip,
  onOpenImage,
}) => {
  const getCategoryIcon = (category: EquipmentCategory) => {
    switch (category) {
      case 'computer': return <Monitor className="w-4 h-4 text-blue-400" />;
      case 'notebook': return <Laptop className="w-4 h-4 text-indigo-400" />;
      case 'printer': return <Printer className="w-4 h-4 text-amber-400" />;
      case 'network': return <Wifi className="w-4 h-4 text-emerald-400" />;
      case 'server': return <Server className="w-4 h-4 text-purple-400" />;
      case 'cctv': return <Camera className="w-4 h-4 text-rose-400" />;
      case 'software': return <Code className="w-4 h-4 text-cyan-400" />;
      default: return <Cpu className="w-4 h-4 text-slate-400" />;
    }
  };

  const getStatusBadge = (status: ReportStatus) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            เสร็จสิ้นแล้ว
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <Clock className="w-3.5 h-3.5 animate-pulse" />
            กำลังดำเนินการ
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <AlertCircle className="w-3.5 h-3.5" />
            ยังแก้ไขไม่เสร็จ / รออะไหล่
          </span>
        );
    }
  };

  const getPriorityBadge = (priority?: string) => {
    if (priority === 'urgent') {
      return <span className="px-2 py-0.5 text-[10px] uppercase font-bold rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">ด่วนที่สุด</span>;
    }
    if (priority === 'high') {
      return <span className="px-2 py-0.5 text-[10px] uppercase font-bold rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">ด่วน</span>;
    }
    return null;
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-md hover:border-slate-700/80 transition-all duration-200 flex flex-col group">
      
      {/* Top Header */}
      <div className="p-4 sm:p-5 border-b border-slate-800/80 bg-slate-900/40">
        <div className="flex items-start justify-between gap-3">
          
          <div className="flex items-start space-x-3">
            <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700/60 mt-0.5 shadow-sm">
              {getCategoryIcon(report.equipmentCategory)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-[11px] font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/50">
                  {report.id}
                </span>
                {getPriorityBadge(report.priority)}
                {report.department && (
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Building className="w-3 h-3 text-slate-500" />
                    {report.department}
                  </span>
                )}
                {report.programName && (
                  <span className="text-[11px] text-cyan-300 bg-cyan-950/70 border border-cyan-500/40 px-2 py-0.5 rounded-full flex items-center gap-1 font-medium">
                    <AppWindow className="w-3 h-3 text-cyan-400" />
                    <span>โปรแกรม: {report.programName}</span>
                  </span>
                )}
              </div>
              <h3 
                onClick={() => onViewDetails(report)}
                className="font-semibold text-base text-white hover:text-blue-400 transition cursor-pointer line-clamp-1"
                title={report.equipmentName}
              >
                {report.equipmentName}
              </h3>
            </div>
          </div>

          <div>{getStatusBadge(report.status)}</div>
        </div>

        {/* Date, Reporter, and User Subheader */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center space-x-1.5">
              <User className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-slate-300 font-medium">{report.reporter}</span>
            </div>
            {report.userName && (
              <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded-md bg-indigo-950/40 border border-indigo-500/20 text-indigo-300">
                <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
                <span>User: <strong className="text-white font-medium">{report.userName}</strong></span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>{report.date} {report.time ? `• ${report.time} น.` : ''}</span>
          </div>
        </div>
      </div>

      {/* Main Content: Problem & Resolution */}
      <div className="p-4 sm:p-5 space-y-4 flex-1">
        
        {/* 1. ปัญหารายละเอียดงาน + รูปภาพประกอบ (> 1 รูป) */}
        <div className="rounded-xl bg-slate-950/40 border border-rose-950/30 p-3.5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-rose-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
              ปัญหารายละเอียดงาน
            </span>
            {report.problemImages && report.problemImages.length > 0 && (
              <span className="text-[11px] text-slate-400 flex items-center gap-1 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                <ImageIcon className="w-3 h-3 text-rose-400" />
                รูปปัญหา {report.problemImages.length} รูป
              </span>
            )}
          </div>
          <p className="text-sm text-slate-300 line-clamp-2 leading-relaxed">
            {report.problemDetails}
          </p>

          {/* Problem Images Strip */}
          {report.problemImages && report.problemImages.length > 0 && (
            <div className="mt-2.5 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
              {report.problemImages.map((img, idx) => (
                <div
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenImage(img, `รูปปัญหา: ${report.equipmentName} (${idx + 1}/${report.problemImages.length})`);
                  }}
                  className="relative group/img cursor-pointer shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border border-rose-900/40 bg-slate-900 hover:border-rose-500/80 transition"
                >
                  <img
                    src={img}
                    alt={`ปัญหา ${idx + 1}`}
                    className="w-full h-full object-cover group-hover/img:scale-110 transition duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition text-white">
                    <span className="text-[10px] font-medium bg-black/70 px-1 rounded">ซูม</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 2. การแก้ไขปัญหา + รูปภาพประกอบ (> 1 รูป) */}
        <div className="rounded-xl bg-slate-950/40 border border-emerald-950/30 p-3.5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              การแก้ไขปัญหา
            </span>
            {report.resolutionImages && report.resolutionImages.length > 0 && (
              <span className="text-[11px] text-slate-400 flex items-center gap-1 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                <ImageIcon className="w-3 h-3 text-emerald-400" />
                รูปแก้ไข {report.resolutionImages.length} รูป
              </span>
            )}
          </div>
          <p className="text-sm text-slate-300 line-clamp-2 leading-relaxed">
            {report.resolutionDetails || 'ยังไม่มีบันทึกการแก้ไข (อยู่ระหว่างดำเนินการ)'}
          </p>

          {/* Resolution Images Strip */}
          {report.resolutionImages && report.resolutionImages.length > 0 && (
            <div className="mt-2.5 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
              {report.resolutionImages.map((img, idx) => (
                <div
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenImage(img, `รูปการแก้ไข: ${report.equipmentName} (${idx + 1}/${report.resolutionImages.length})`);
                  }}
                  className="relative group/img cursor-pointer shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border border-emerald-900/40 bg-slate-900 hover:border-emerald-500/80 transition"
                >
                  <img
                    src={img}
                    alt={`แก้ไข ${idx + 1}`}
                    className="w-full h-full object-cover group-hover/img:scale-110 transition duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition text-white">
                    <span className="text-[10px] font-medium bg-black/70 px-1 rounded">ซูม</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Footer & Actions */}
      <div className="px-4 py-3 bg-slate-900/60 border-t border-slate-800/80 flex items-center justify-between gap-2 text-xs">
        
        {/* Quick status dropdown */}
        <div className="flex items-center space-x-1">
          <span className="text-slate-500 hidden sm:inline">เปลี่ยนสถานะ:</span>
          <select
            value={report.status}
            onChange={(e) => onUpdateStatus(report.id, e.target.value as ReportStatus)}
            className="bg-slate-800 border border-slate-700 text-slate-300 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
          >
            <option value="completed" className="bg-slate-900 text-emerald-400">เสร็จสิ้นแล้ว</option>
            <option value="in_progress" className="bg-slate-900 text-amber-400">กำลังดำเนินการ</option>
            <option value="pending" className="bg-slate-900 text-rose-400">ยังไม่เสร็จ/รออะไหล่</option>
          </select>
        </div>

        {/* View Details & Print Buttons */}
        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => onPrintSlip(report)}
            title="พิมพ์ใบรายงานการซ่อม / ใบงาน"
            className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700 transition"
          >
            <PrintIcon className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onViewDetails(report)}
            className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-blue-600/90 hover:bg-blue-600 text-white font-medium transition shadow-sm"
          >
            <span>ดูรายละเอียด</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
};
