import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Layers, 
  TrendingUp,
  Percent
} from 'lucide-react';
import { ITWorkReport, ReportStatus } from '../types/report';

interface StatsCardsProps {
  reports: ITWorkReport[];
  activeStatusFilter: 'all' | ReportStatus;
  onSelectStatus: (status: 'all' | ReportStatus) => void;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  reports,
  activeStatusFilter,
  onSelectStatus,
}) => {
  const total = reports.length;
  const completed = reports.filter((r) => r.status === 'completed').length;
  const inProgress = reports.filter((r) => r.status === 'in_progress').length;
  const pending = reports.filter((r) => r.status === 'pending').length;

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      
      {/* 1. งานทั้งหมด */}
      <div
        onClick={() => onSelectStatus('all')}
        className={`cursor-pointer rounded-2xl p-4 transition-all duration-200 border ${
          activeStatusFilter === 'all'
            ? 'bg-slate-800/90 border-blue-500/80 shadow-lg shadow-blue-500/10 ring-2 ring-blue-500/20'
            : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400">งานไอทีทั้งหมด</p>
            <h3 className="text-2xl font-bold text-white mt-1">{total} <span className="text-sm font-normal text-slate-400">รายการ</span></h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Layers className="w-6 h-6" />
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-2.5">
          <span>ความสำเร็จรวม</span>
          <span className="font-semibold text-blue-400 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            {completionRate}% สำเร็จ
          </span>
        </div>
      </div>

      {/* 2. งานเสร็จสิ้นแล้ว */}
      <div
        onClick={() => onSelectStatus('completed')}
        className={`cursor-pointer rounded-2xl p-4 transition-all duration-200 border ${
          activeStatusFilter === 'completed'
            ? 'bg-emerald-950/40 border-emerald-500/80 shadow-lg shadow-emerald-500/10 ring-2 ring-emerald-500/20'
            : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <p className="text-xs font-medium text-emerald-400">แก้ไขเสร็จสิ้นแล้ว</p>
            </div>
            <h3 className="text-2xl font-bold text-white mt-1">{completed} <span className="text-sm font-normal text-slate-400">รายการ</span></h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-2.5">
          <span>สัดส่วนงานเสร็จ</span>
          <span className="font-semibold text-emerald-400">
            {total > 0 ? ((completed / total) * 100).toFixed(0) : 0}% ของงาน
          </span>
        </div>
      </div>

      {/* 3. กำลังดำเนินการ */}
      <div
        onClick={() => onSelectStatus('in_progress')}
        className={`cursor-pointer rounded-2xl p-4 transition-all duration-200 border ${
          activeStatusFilter === 'in_progress'
            ? 'bg-amber-950/40 border-amber-500/80 shadow-lg shadow-amber-500/10 ring-2 ring-amber-500/20'
            : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              <p className="text-xs font-medium text-amber-400">กำลังดำเนินการ</p>
            </div>
            <h3 className="text-2xl font-bold text-white mt-1">{inProgress} <span className="text-sm font-normal text-slate-400">รายการ</span></h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Clock className="w-6 h-6" />
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-2.5">
          <span>กำลังซ่อม / รันระบบ</span>
          <span className="font-semibold text-amber-400">
            {inProgress > 0 ? 'รอติดตามผล' : 'ไม่มีงานค้าง'}
          </span>
        </div>
      </div>

      {/* 4. ยังแก้ไขไม่เสร็จ / รออะไหล่ */}
      <div
        onClick={() => onSelectStatus('pending')}
        className={`cursor-pointer rounded-2xl p-4 transition-all duration-200 border ${
          activeStatusFilter === 'pending'
            ? 'bg-rose-950/40 border-rose-500/80 shadow-lg shadow-rose-500/10 ring-2 ring-rose-500/20'
            : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-400"></span>
              <p className="text-xs font-medium text-rose-400">ยังแก้ไขไม่เสร็จ / รออะไหล่</p>
            </div>
            <h3 className="text-2xl font-bold text-white mt-1">{pending} <span className="text-sm font-normal text-slate-400">รายการ</span></h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-2.5">
          <span>ต้องการการดูแล</span>
          <span className="font-semibold text-rose-400">
            {pending > 0 ? `${pending} งานต้องแก้ไข` : 'เคลียร์ครบถ้วน'}
          </span>
        </div>
      </div>

    </div>
  );
};
