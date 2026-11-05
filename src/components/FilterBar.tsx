import React from 'react';
import { 
  Search, 
  Filter, 
  Grid3X3, 
  Table as TableIcon, 
  Calendar,
  X,
  SlidersHorizontal
} from 'lucide-react';
import { FilterOptions, ReportStatus, EquipmentCategory } from '../types/report';

interface FilterBarProps {
  filterOptions: FilterOptions;
  setFilterOptions: React.Dispatch<React.SetStateAction<FilterOptions>>;
  viewMode: 'grid' | 'table';
  setViewMode: (mode: 'grid' | 'table') => void;
  resultCount: number;
}

const CATEGORIES: { label: string; value: 'all' | EquipmentCategory }[] = [
  { label: 'ทั้งหมด', value: 'all' },
  { label: 'คอมพิวเตอร์ (PC)', value: 'computer' },
  { label: 'โน้ตบุ๊ก (Notebook)', value: 'notebook' },
  { label: 'เครื่องพิมพ์ (Printer)', value: 'printer' },
  { label: 'เน็ตเวิร์ก (Network/LAN)', value: 'network' },
  { label: 'เซิร์ฟเวอร์ (Server)', value: 'server' },
  { label: 'กล้องวงจรปิด (CCTV)', value: 'cctv' },
  { label: 'ระบบโปรแกรม (Software)', value: 'software' },
];

export const FilterBar: React.FC<FilterBarProps> = ({
  filterOptions,
  setFilterOptions,
  viewMode,
  setViewMode,
  resultCount,
}) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 mb-6 shadow-sm">
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="ค้นหาชื่ออุปกรณ์, อาการปัญหา, วิธีแก้ไข, ผู้ทำรายงาน..."
            value={filterOptions.search}
            onChange={(e) => setFilterOptions(prev => ({ ...prev, search: e.target.value }))}
            className="w-full pl-10 pr-9 py-2.5 bg-slate-800/80 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
          {filterOptions.search && (
            <button
              onClick={() => setFilterOptions(prev => ({ ...prev, search: '' }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Date Filter */}
        <div className="flex items-center space-x-2">
          <div className="relative flex items-center bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-300">
            <Calendar className="w-3.5 h-3.5 mr-2 text-blue-400" />
            <select
              value={filterOptions.dateFilter}
              onChange={(e) => setFilterOptions(prev => ({ ...prev, dateFilter: e.target.value as any }))}
              className="bg-transparent text-white focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-slate-800 text-white">ทุกช่วงเวลา</option>
              <option value="today" className="bg-slate-800 text-white">วันนี้</option>
              <option value="this_week" className="bg-slate-800 text-white">สัปดาห์นี้</option>
              <option value="this_month" className="bg-slate-800 text-white">เดือนนี้</option>
            </select>
          </div>

          {/* Grid vs Table View Toggle */}
          <div className="flex items-center bg-slate-800/80 border border-slate-700/80 rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              title="มุมมองแบบการ์ด (Cards)"
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'grid'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              title="มุมมองแบบตาราง (Table)"
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'table'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <TableIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Category Pills & Status Filter Badges */}
      <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
        
        {/* Status filter buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> สถานะ:
          </span>
          <button
            onClick={() => setFilterOptions(prev => ({ ...prev, status: 'all' }))}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
              filterOptions.status === 'all'
                ? 'bg-slate-200 text-slate-900 font-semibold'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700/60'
            }`}
          >
            ทั้งหมด
          </button>
          <button
            onClick={() => setFilterOptions(prev => ({ ...prev, status: 'completed' }))}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
              filterOptions.status === 'completed'
                ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm'
                : 'bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 hover:bg-emerald-900/50'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            เสร็จสิ้นแล้ว
          </button>
          <button
            onClick={() => setFilterOptions(prev => ({ ...prev, status: 'in_progress' }))}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
              filterOptions.status === 'in_progress'
                ? 'bg-amber-400 text-slate-950 font-semibold shadow-sm'
                : 'bg-amber-950/40 border border-amber-800/40 text-amber-400 hover:bg-amber-900/50'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            กำลังดำเนินการ
          </button>
          <button
            onClick={() => setFilterOptions(prev => ({ ...prev, status: 'pending' }))}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
              filterOptions.status === 'pending'
                ? 'bg-rose-500 text-white font-semibold shadow-sm'
                : 'bg-rose-950/40 border border-rose-800/40 text-rose-400 hover:bg-rose-900/50'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
            ยังไม่เสร็จ / รออะไหล่
          </button>
        </div>

        {/* Results Counter & Category Dropdown */}
        <div className="flex items-center space-x-2">
          <div className="relative">
            <select
              value={filterOptions.category}
              onChange={(e) => setFilterOptions(prev => ({ ...prev, category: e.target.value as any }))}
              className="bg-slate-800 border border-slate-700 text-xs text-slate-300 rounded-lg px-2.5 py-1 focus:outline-none cursor-pointer"
            >
              {CATEGORIES.map(c => (
                <option key={c.value} value={c.value} className="bg-slate-800 text-white">
                  หมวดหมู่: {c.label}
                </option>
              ))}
            </select>
          </div>
          <span className="text-xs text-slate-400">
            แสดง <span className="font-semibold text-white">{resultCount}</span> รายการ
          </span>
        </div>

      </div>
    </div>
  );
};
