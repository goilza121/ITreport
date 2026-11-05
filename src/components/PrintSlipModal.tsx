import React from 'react';
import { X, Printer, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { ITWorkReport } from '../types/report';

interface PrintSlipModalProps {
  report: ITWorkReport | null;
  onClose: () => void;
}

export const PrintSlipModal: React.FC<PrintSlipModalProps> = ({ report, onClose }) => {
  if (!report) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div 
        className="relative bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Controls bar (Hidden during print) */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900 print:hidden">
          <div className="flex items-center space-x-2">
            <Printer className="w-5 h-5 text-blue-400" />
            <span className="font-semibold text-white text-sm">
              ตัวอย่างก่อนพิมพ์ (Print Work Order Slip)
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow transition"
            >
              <Printer className="w-4 h-4" />
              <span>พิมพ์ใบงานนี้</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document (Styled for paper & screen) */}
        <div className="p-6 sm:p-8 bg-white text-slate-900 overflow-y-auto flex-1 font-sans print:p-0 print:m-0">
          
          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-4 mb-5 flex items-start justify-between">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                ใบรายงานการปฏิบัติงาน / ซ่อมบำรุงไอที
              </h1>
              <p className="text-xs text-slate-600 mt-0.5">
                IT Daily Service & Maintenance Work Order Report
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded border border-slate-300">
                {report.id}
              </span>
              <p className="text-[11px] text-slate-500 mt-1">วันที่: {report.date} {report.time || ''}</p>
            </div>
          </div>

          {/* Details Table */}
          <div className="border border-slate-300 rounded-lg overflow-hidden mb-5 text-xs">
            <div className="grid grid-cols-2 divide-x divide-slate-300 border-b border-slate-300 bg-slate-50">
              <div className="p-2.5">
                <span className="text-slate-500 font-medium block">ชื่ออุปกรณ์ / ระบบ:</span>
                <span className="font-bold text-slate-900 text-sm">{report.equipmentName}</span>
                {report.programName && (
                  <span className="text-[11px] text-cyan-800 font-medium block mt-0.5">
                    ชื่อระบบโปรแกรม: <strong>{report.programName}</strong>
                  </span>
                )}
              </div>
              <div className="p-2.5">
                <span className="text-slate-500 font-medium block">หมวดหมู่อุปกรณ์:</span>
                <span className="font-semibold text-slate-800">
                  {report.equipmentCategory === 'software' ? 'ระบบโปรแกรม (SOFTWARE)' : report.equipmentCategory.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 divide-x divide-slate-300 border-b border-slate-300">
              <div className="p-2.5">
                <span className="text-slate-500 font-medium block">ผู้ทำรายงาน (เจ้าหน้าที่ IT):</span>
                <span className="font-semibold text-slate-800">{report.reporter}</span>
              </div>
              <div className="p-2.5">
                <span className="text-slate-500 font-medium block">ชื่อ User (ผู้ใช้งาน / ผู้แจ้งปัญหา):</span>
                <span className="font-semibold text-indigo-900">{report.userName || '-'}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 divide-x divide-slate-300 border-b border-slate-300 bg-slate-50">
              <div className="p-2.5">
                <span className="text-slate-500 font-medium block">แผนก / สถานที่:</span>
                <span className="font-semibold text-slate-800">{report.department || 'สำนักงาน'}</span>
              </div>
              <div className="p-2.5">
                <span className="text-slate-500 font-medium block">สถานะงาน:</span>
                <span className="font-bold text-slate-900">
                  {report.status === 'completed' ? '✓ แก้ไขเสร็จสิ้นแล้ว' : report.status === 'in_progress' ? '⏱ กำลังดำเนินการ' : '✕ ยังแก้ไขไม่เสร็จ / รออะไหล่'}
                </span>
              </div>
            </div>

            <div className="p-2.5 bg-white">
              <span className="text-slate-500 font-medium block">ค่าใช้จ่ายอะไหล่ / ค่าซ่อม:</span>
              <span className="font-semibold text-slate-800">{report.cost ? `${report.cost.toLocaleString('th-TH')} บาท` : 'ไม่มีค่าใช้จ่าย'}</span>
            </div>
          </div>

          {/* Problem Details */}
          <div className="mb-4">
            <h3 className="text-xs font-bold text-red-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              [ 1. ปัญหารายละเอียดงาน / อาการเสีย ]
            </h3>
            <div className="p-3 bg-red-50/60 border border-red-200 rounded-lg text-xs text-slate-800 leading-relaxed">
              {report.problemDetails}
            </div>
          </div>

          {/* Resolution Details */}
          <div className="mb-4">
            <h3 className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              [ 2. การแก้ไขปัญหา / ขั้นตอนการซ่อม ]
            </h3>
            <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-lg text-xs text-slate-800 leading-relaxed">
              {report.resolutionDetails || 'อยู่ระหว่างดำเนินการ'}
            </div>
          </div>

          {/* Notes */}
          {report.notes && (
            <div className="mb-6">
              <span className="text-xs font-bold text-slate-700">หมายเหตุเพิ่มเติม: </span>
              <span className="text-xs text-slate-600">{report.notes}</span>
            </div>
          )}

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-8 pt-8 mt-6 border-t border-slate-300 text-center text-xs text-slate-700">
            <div>
              <div className="h-14 border-b border-dashed border-slate-400 mx-auto w-44 mb-2"></div>
              <p className="font-semibold">({report.reporter})</p>
              <p className="text-[11px] text-slate-500">เจ้าหน้าที่ผู้ปฏิบัติงาน IT</p>
              <p className="text-[10px] text-slate-400 mt-0.5">วันที่ _____ / _____ / _________</p>
            </div>

            <div>
              <div className="h-14 border-b border-dashed border-slate-400 mx-auto w-44 mb-2"></div>
              <p className="font-semibold">({report.userName || '.........................................................'})</p>
              <p className="text-[11px] text-slate-500">ผู้ใช้งาน (User) / ผู้รับมอบงาน</p>
              <p className="text-[10px] text-slate-400 mt-0.5">วันที่ _____ / _____ / _________</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
