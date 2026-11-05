import React, { useState, useRef } from 'react';
import { 
  Save, 
  Calendar, 
  User, 
  Monitor, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Upload, 
  X, 
  Sparkles, 
  FileSpreadsheet, 
  ArrowLeft,
  Building,
  Plus,
  Coins,
  FileText,
  Info,
  UserCheck,
  AppWindow,
  Layers,
  Code2
} from 'lucide-react';
import { ITWorkReport, ReportStatus, EquipmentCategory } from '../types/report';
import { compressImageFile } from '../services/imageUtils';

interface NewReportViewProps {
  onSaveReport: (report: ITWorkReport) => Promise<void>;
  onCancel: () => void;
  isSheetConnected: boolean;
}

const COMMON_PROGRAMS = [
  'Express (โปรแกรมบัญชี)',
  'SAP Business One / ERP',
  'ระบบขายหน้าร้าน (POS)',
  'Microsoft 365 / Outlook',
  'Google Workspace',
  'HR & Payroll System',
  'ระบบจัดการคลังสินค้า (WMS)',
  'โปรแกรมพิมพ์ใบเสร็จ/บิล',
  'ระบบเฉพาะองค์กร (Internal App)',
  'Windows OS / License'
];

const COMMON_TEMPLATES = [
  {
    title: 'ระบบโปรแกรม Error / ฐานข้อมูลไม่เชื่อมต่อ',
    category: 'software' as EquipmentCategory,
    programName: 'Express (โปรแกรมบัญชี)',
    equipmentName: 'ระบบโปรแกรมบัญชี Express',
    problem: 'เปิดโปรแกรมบัญชี Express ไม่ได้ ฟ้อง Error 70 / การเชื่อมต่อฐานข้อมูลขัดข้อง ผู้ใช้งานไม่สามารถลงบิลได้',
    resolution: 'ตรวจสอบสิทธิ์การแชร์โฟลเดอร์บนเครื่องแม่ข่าย (Server) ทำการ Re-connect Map Network Drive และรีสตาร์ต Database Service ใช้งานได้ปกติ'
  },
  {
    title: 'คอมเปิดไม่ติด / จอฟ้า',
    category: 'computer' as EquipmentCategory,
    problem: 'เครื่องเปิดติดแต่ภาพไม่ขึ้น มีเสียง Beep Code หรือขึ้นจอฟ้า BSOD ไม่สามารถบูตเข้าสู่ระบบได้',
    resolution: 'ตรวจเช็คขั้วต่อแรมและฮาร์ดแวร์ ทำความสะอาดและทดสอบเปิดเครื่อง สามารถบูตเข้าสู่ Windows ได้ปกติ'
  },
  {
    title: 'เครื่องพิมพ์กระดาษติด / หมึกหมด',
    category: 'printer' as EquipmentCategory,
    problem: 'เครื่องพิมพ์กระดาษติดบ่อยในถาด และมีไฟสัญญาณเตือนหมึกเหลือน้อย ไม่สามารถพิมพ์เอกสารได้',
    resolution: 'ดึงกระดาษที่ติดขัดออก ทำความสะอาดลูกกลิ้ง Pickup Roller และเปลี่ยนตลับหมึก Toner ใหม่'
  },
  {
    title: 'อินเทอร์เน็ตหลุด / สาย LAN',
    category: 'network' as EquipmentCategory,
    problem: 'เครื่องลูกข่ายไม่สามารถเชื่อมต่อระบบเครือข่ายภายในและอินเทอร์เน็ตได้ ไฟพอร์ต LAN ไม่ติด',
    resolution: 'ตรวจสอบสาย LAN พบหัว RJ45 หลวม ทำการเข้าหัวสายใหม่และทดสอบการรับส่งข้อมูล สัญญาณกลับมาใช้งานได้ปกติ'
  },
  {
    title: 'ลง Windows ใหม่ / กำจัดไวรัส',
    category: 'notebook' as EquipmentCategory,
    problem: 'เครื่องทำงานช้ามาก มีโปรแกรมแปลกปลอมและป็อปอัปแจ้งเตือนตลอดเวลา ติดตั้งซอฟต์แวร์ผิดปกติ',
    resolution: 'สำรองข้อมูลสำคัญของผู้ใช้งาน ทำการ Format ลงระบบปฏิบัติการ Windows 11 และโปรแกรมใช้งานมาตรฐานใหม่'
  }
];

export const NewReportView: React.FC<NewReportViewProps> = ({
  onSaveReport,
  onCancel,
  isSheetConnected
}) => {
  const today = new Date().toISOString().slice(0, 10);
  const currentTime = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', hour12: false });

  const [date, setDate] = useState(today);
  const [time, setTime] = useState(currentTime);
  const [reporter, setReporter] = useState('');
  const [userName, setUserName] = useState('');
  const [equipmentName, setEquipmentName] = useState('');
  const [equipmentCategory, setEquipmentCategory] = useState<EquipmentCategory>('computer');
  const [programName, setProgramName] = useState('');
  const [department, setDepartment] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [status, setStatus] = useState<ReportStatus>('completed');
  
  // Details
  const [problemDetails, setProblemDetails] = useState('');
  const [problemImages, setProblemImages] = useState<string[]>([]);
  
  const [resolutionDetails, setResolutionDetails] = useState('');
  const [resolutionImages, setResolutionImages] = useState<string[]>([]);
  
  const [cost, setCost] = useState<number | ''>('');
  const [notes, setNotes] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isCompressingProblem, setIsCompressingProblem] = useState(false);
  const [isCompressingResolution, setIsCompressingResolution] = useState(false);

  const problemFileInputRef = useRef<HTMLInputElement>(null);
  const resolutionFileInputRef = useRef<HTMLInputElement>(null);

  // Apply quick issue template
  const applyTemplate = (t: typeof COMMON_TEMPLATES[0]) => {
    setEquipmentCategory(t.category);
    if ('programName' in t && (t as any).programName) {
      setProgramName((t as any).programName);
    }
    if ('equipmentName' in t && (t as any).equipmentName) {
      setEquipmentName((t as any).equipmentName);
    }
    setProblemDetails(t.problem);
    setResolutionDetails(t.resolution);
  };

  // Handle uploading problem images (multiple)
  const handleProblemImageFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsCompressingProblem(true);
    try {
      const newImages: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith('image/')) {
          const compressed = await compressImageFile(file, 1200, 1200, 0.75);
          newImages.push(compressed);
        }
      }
      setProblemImages(prev => [...prev, ...newImages]);
    } catch (err) {
      console.error('Failed to compress problem images:', err);
    } finally {
      setIsCompressingProblem(false);
    }
  };

  // Handle uploading resolution images (multiple)
  const handleResolutionImageFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsCompressingResolution(true);
    try {
      const newImages: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith('image/')) {
          const compressed = await compressImageFile(file, 1200, 1200, 0.75);
          newImages.push(compressed);
        }
      }
      setResolutionImages(prev => [...prev, ...newImages]);
    } catch (err) {
      console.error('Failed to compress resolution images:', err);
    } finally {
      setIsCompressingResolution(false);
    }
  };

  // Handle submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!date.trim()) {
      setErrorMessage('กรุณาระบุวันที่ทำรายงาน');
      return;
    }
    if (!reporter.trim()) {
      setErrorMessage('กรุณาระบุชื่อผู้ทำรายงาน');
      return;
    }
    if (!equipmentName.trim()) {
      if (equipmentCategory === 'software' && programName.trim()) {
        // Auto-assign equipmentName if only programName was filled
        setEquipmentName(`ระบบโปรแกรม ${programName.trim()}`);
      } else {
        setErrorMessage('กรุณาระบุชื่ออุปกรณ์ที่ได้รับแจ้ง');
        return;
      }
    }
    if (equipmentCategory === 'software' && !programName.trim()) {
      setErrorMessage('กรุณาระบุชื่อระบบโปรแกรม');
      return;
    }
    if (!problemDetails.trim()) {
      setErrorMessage('กรุณากรอกปัญหารายละเอียดงาน');
      return;
    }

    setIsSubmitting(true);
    const reportId = `IT-${date.replace(/-/g, '')}-${Math.floor(100 + Math.random() * 900)}`;

    const resolvedEquipmentName = equipmentName.trim() || (equipmentCategory === 'software' && programName.trim() ? `ระบบโปรแกรม ${programName.trim()}` : 'อุปกรณ์ไอที');

    const newReport: ITWorkReport = {
      id: reportId,
      date,
      time,
      reporter: reporter.trim(),
      userName: userName.trim() || undefined,
      equipmentName: resolvedEquipmentName,
      equipmentCategory,
      programName: equipmentCategory === 'software' ? (programName.trim() || undefined) : undefined,
      department: department.trim() || undefined,
      problemDetails: problemDetails.trim(),
      problemImages,
      resolutionDetails: resolutionDetails.trim(),
      resolutionImages,
      status,
      priority,
      cost: cost === '' ? undefined : Number(cost),
      notes: notes.trim() || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      await onSaveReport(newReport);
    } catch (err: any) {
      setErrorMessage(err.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-16">
      
      {/* Top Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white mb-2 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>กลับไปยังหน้าแดชบอร์ด</span>
          </button>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            บันทึกรายงานการปฏิบัติงานไอที
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            กรอกข้อมูลรายละเอียดการทำงาน ปัญหา และวิธีการแก้ไข พร้อมแนบรูปภาพประกอบ
          </p>
        </div>

        {isSheetConnected && (
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs">
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>ซิงค์ลง Google Sheets อัตโนมัติ</span>
          </div>
        )}
      </div>

      {/* Quick Templates Bar */}
      <div className="mb-6 p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
        <div className="flex items-center gap-2 mb-2.5">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-semibold text-slate-300">แม่แบบงานยอดนิยม (คลิกเพื่อเติมข้อความด่วน):</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {COMMON_TEMPLATES.map((tmpl, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => applyTemplate(tmpl)}
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 transition"
            >
              + {tmpl.title}
            </button>
          ))}
        </div>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Section 1: ข้อมูลพื้นฐาน (วันที่, ผู้ทำ report, ชื่ออุปกรณ์) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <FileText className="w-4 h-4 text-blue-400" />
            ข้อมูลพื้นฐานของงาน
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* วันที่ (Date) */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                วันที่ทำรายงาน <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* เวลา (Time) */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                เวลาที่ดำเนินการ
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* ผู้ทำ report */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                ผู้ทำ report (เจ้าหน้าที่ไอที) <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="เช่น สมชาย ชัยชนะ (IT Support)"
                  value={reporter}
                  onChange={(e) => setReporter(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* ชื่อ User (ผู้ใช้งาน / ผู้แจ้งปัญหา) */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
                <span>ชื่อ User (ผู้ใช้งาน / ผู้แจ้งปัญหา)</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="เช่น คุณวิภาวรรณ (แผนกบัญชี)"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* ชื่ออุปกรณ์ (Equipment name) */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                ชื่ออุปกรณ์ (Equipment Name) <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Monitor className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="เช่น PC Workstation Dell OptiPlex 7090, Printer HP M608"
                  value={equipmentName}
                  onChange={(e) => setEquipmentName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* หมวดหมู่อุปกรณ์ */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center justify-between">
                <span>หมวดหมู่อุปกรณ์</span>
                {equipmentCategory === 'software' && (
                  <span className="text-[10px] text-cyan-400 font-semibold px-1.5 py-0.2 rounded bg-cyan-950/80 border border-cyan-500/30">
                    เปิดแท็บระบุโปรแกรมแล้ว
                  </span>
                )}
              </label>
              <select
                value={equipmentCategory}
                onChange={(e) => {
                  const newCat = e.target.value as EquipmentCategory;
                  setEquipmentCategory(newCat);
                  if (newCat === 'software' && !programName) {
                    setProgramName('Express (โปรแกรมบัญชี)');
                  }
                }}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="computer">คอมพิวเตอร์ตั้งโต๊ะ (PC)</option>
                <option value="notebook">คอมพิวเตอร์พกพา (Notebook)</option>
                <option value="printer">เครื่องพิมพ์ (Printer / Scanner)</option>
                <option value="network">ระบบเครือข่าย (Network / WiFi)</option>
                <option value="server">เครื่องแม่ข่าย (Server)</option>
                <option value="cctv">กล้องวงจรปิด (CCTV / NVR)</option>
                <option value="software">💻 ระบบโปรแกรม (Software System)</option>
                <option value="peripheral">อุปกรณ์ต่อพ่วง (Peripheral)</option>
                <option value="other">อุปกรณ์อื่น ๆ</option>
              </select>
            </div>

            {/* แท็บระบุชื่อโปรแกรม (แสดงอัตโนมัติเมื่อเลือกหมวดหมู่ ระบบโปรแกรม) */}
            {equipmentCategory === 'software' && (
              <div className="sm:col-span-2 lg:col-span-3 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-slate-900 to-slate-900 border border-cyan-500/50 p-4 shadow-xl shadow-cyan-950/20 animate-in fade-in slide-in-from-top-2 duration-300">
                {/* Tab Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-cyan-500/20 pb-3 mb-3">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
                      <AppWindow className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white uppercase tracking-wider">
                          แท็บระบุชื่อโปรแกรม (Program Name)
                        </span>
                        <span className="text-[10px] bg-cyan-500 text-slate-950 font-bold px-2 py-0.5 rounded-full">
                          ระบบโปรแกรม
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        ระบุชื่อโปรแกรมที่มีปัญหา หรือคลิกเลือกจากรายการโปรแกรมยอดนิยม
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-cyan-400 font-medium">
                    * จะถูกบันทึกและแสดงบนการ์ดรายงานและแดชบอร์ด
                  </span>
                </div>

                {/* Input for Program Name */}
                <div className="mb-3">
                  <label className="block text-xs font-medium text-slate-200 mb-1.5 flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>ชื่อระบบโปรแกรมที่พบปัญหา <span className="text-rose-400">*</span></span>
                  </label>
                  <div className="relative">
                    <AppWindow className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400" />
                    <input
                      type="text"
                      required
                      placeholder="เช่น Express, SAP, ระบบขาย POS, Microsoft Outlook, HR Payroll..."
                      value={programName}
                      onChange={(e) => {
                        const val = e.target.value;
                        setProgramName(val);
                        if (!equipmentName || equipmentName.startsWith('ระบบโปรแกรม')) {
                          setEquipmentName(val ? `ระบบโปรแกรม ${val}` : '');
                        }
                      }}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-800/90 border border-cyan-500/50 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition"
                    />
                  </div>
                </div>

                {/* Quick Select Buttons */}
                <div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-2 font-medium">
                    <Layers className="w-3 h-3 text-cyan-400" />
                    <span>คลิกเพื่อเลือกโปรแกรมสำเร็จรูปทันที:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {COMMON_PROGRAMS.map((prog, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setProgramName(prog);
                          if (!equipmentName || equipmentName.startsWith('ระบบโปรแกรม')) {
                            setEquipmentName(`ระบบโปรแกรม ${prog}`);
                          }
                        }}
                        className={`text-xs px-2.5 py-1.5 rounded-lg border transition flex items-center gap-1.5 ${
                          programName === prog
                            ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-semibold shadow-md shadow-cyan-500/20'
                            : 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border-slate-700/70'
                        }`}
                      >
                        <span className="text-[10px] text-cyan-400">{programName === prog ? '✓' : '+'}</span>
                        <span>{prog}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* แผนก / แผนกผู้ใช้งาน */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                แผนก / สถานที่ติดตั้ง (Department / Location)
              </label>
              <div className="relative">
                <Building className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="เช่น แผนกบัญชีและการเงิน ชั้น 3, ห้องประชุม 1"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* สถานะงาน (Work Status) */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                สถานะงาน <span className="text-rose-400">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setStatus('completed')}
                  className={`py-2 px-2 rounded-xl text-xs font-semibold flex flex-col items-center justify-center gap-1 border transition ${
                    status === 'completed'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-sm'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>เสร็จสิ้น</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStatus('in_progress')}
                  className={`py-2 px-2 rounded-xl text-xs font-semibold flex flex-col items-center justify-center gap-1 border transition ${
                    status === 'in_progress'
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-sm'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>กำลังทำ</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStatus('pending')}
                  className={`py-2 px-2 rounded-xl text-xs font-semibold flex flex-col items-center justify-center gap-1 border transition ${
                    status === 'pending'
                      ? 'bg-rose-500/20 border-rose-500 text-rose-300 shadow-sm'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                  <span>ยังไม่เสร็จ</span>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Section 2: ปัญหารายละเอียดงาน + รูปภาพประกอบ มากกว่า 1 รูป */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-semibold text-rose-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              ปัญหารายละเอียดงาน <span className="text-slate-400 font-normal text-xs">(อาการเสีย / รหัสข้อผิดพลาด)</span>
            </h2>
            <span className="text-xs text-slate-400">
              แนบรูปภาพปัญหา: <strong className="text-white">{problemImages.length}</strong> รูป
            </span>
          </div>

          <div>
            <textarea
              required
              rows={3}
              placeholder="ระบุอาการเสีย ข้อความแจ้งเตือน error หรือสาเหตุที่ได้รับแจ้งโดยละเอียด..."
              value={problemDetails}
              onChange={(e) => setProblemDetails(e.target.value)}
              className="w-full p-3.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {/* รูปภาพประกอบปัญหา มากกว่า 1 รูป */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">
              รูปภาพประกอบปัญหา <span className="text-slate-400 font-normal">(รองรับการอัปโหลดมากกว่า 1 รูป)</span>
            </label>

            {/* Upload Area */}
            <input
              type="file"
              ref={problemFileInputRef}
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => handleProblemImageFiles(e.target.files)}
            />

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {/* Add Button */}
              <button
                type="button"
                onClick={() => problemFileInputRef.current?.click()}
                disabled={isCompressingProblem}
                className="h-24 rounded-xl border-2 border-dashed border-slate-700 hover:border-rose-500/80 bg-slate-800/50 hover:bg-rose-950/20 text-slate-400 hover:text-rose-300 transition flex flex-col items-center justify-center p-2 text-center"
              >
                <Upload className="w-5 h-5 mb-1 text-rose-400" />
                <span className="text-[11px] font-medium leading-tight">
                  {isCompressingProblem ? 'กำลังประมวลผล...' : '+ เพิ่มรูปปัญหา'}
                </span>
                <span className="text-[9px] text-slate-500">เลือกทีละหลายรูปได้</span>
              </button>

              {/* Previews */}
              {problemImages.map((img, index) => (
                <div key={index} className="relative group rounded-xl overflow-hidden h-24 border border-rose-900/40 bg-slate-800 shadow-sm">
                  <img src={img} alt={`Problem photo ${index + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setProblemImages(prev => prev.filter((_, i) => i !== index))}
                    className="absolute top-1 right-1 p-1 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-md transition"
                    title="ลบรูปนี้"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  <span className="absolute bottom-1 left-1 text-[9px] bg-black/70 text-slate-300 px-1 rounded">
                    #{index + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 3: แก้ไขปัญหา + รูปภาพประกอบ มากกว่า 1 รูป */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-semibold text-emerald-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              การแก้ไขปัญหา <span className="text-slate-400 font-normal text-xs">(วิธีการซ่อม / อะไหล่ที่เปลี่ยน / ขั้นตอนแก้ไข)</span>
            </h2>
            <span className="text-xs text-slate-400">
              แนบรูปภาพแก้ไข: <strong className="text-white">{resolutionImages.length}</strong> รูป
            </span>
          </div>

          <div>
            <textarea
              rows={3}
              placeholder="ระบุวิธีการซ่อมบำรุง การแก้ไขระบบ การเปลี่ยนอะไหล่ หรือผลการทดสอบหลังซ่อม..."
              value={resolutionDetails}
              onChange={(e) => setResolutionDetails(e.target.value)}
              className="w-full p-3.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* รูปภาพประกอบการแก้ไข มากกว่า 1 รูป */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">
              รูปภาพประกอบการแก้ไข <span className="text-slate-400 font-normal">(รองรับการอัปโหลดมากกว่า 1 รูป)</span>
            </label>

            {/* Upload Area */}
            <input
              type="file"
              ref={resolutionFileInputRef}
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => handleResolutionImageFiles(e.target.files)}
            />

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {/* Add Button */}
              <button
                type="button"
                onClick={() => resolutionFileInputRef.current?.click()}
                disabled={isCompressingResolution}
                className="h-24 rounded-xl border-2 border-dashed border-slate-700 hover:border-emerald-500/80 bg-slate-800/50 hover:bg-emerald-950/20 text-slate-400 hover:text-emerald-300 transition flex flex-col items-center justify-center p-2 text-center"
              >
                <Upload className="w-5 h-5 mb-1 text-emerald-400" />
                <span className="text-[11px] font-medium leading-tight">
                  {isCompressingResolution ? 'กำลังประมวลผล...' : '+ เพิ่มรูปแก้ไข'}
                </span>
                <span className="text-[9px] text-slate-500">เลือกทีละหลายรูปได้</span>
              </button>

              {/* Previews */}
              {resolutionImages.map((img, index) => (
                <div key={index} className="relative group rounded-xl overflow-hidden h-24 border border-emerald-900/40 bg-slate-800 shadow-sm">
                  <img src={img} alt={`Resolution photo ${index + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setResolutionImages(prev => prev.filter((_, i) => i !== index))}
                    className="absolute top-1 right-1 p-1 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-md transition"
                    title="ลบรูปนี้"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  <span className="absolute bottom-1 left-1 text-[9px] bg-black/70 text-slate-300 px-1 rounded">
                    #{index + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 4: ข้อมูลเสริม (ค่าใช้จ่าย, หมายเหตุ) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Cost */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1">
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                ค่าใช้จ่ายอะไหล่ / ค่าซ่อม (บาท, ถ้ามี)
              </label>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={cost}
                onChange={(e) => setCost(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-blue-400" />
                หมายเหตุเพิ่มเติม / ข้อเสนอแนะ
              </label>
              <input
                type="text"
                placeholder="เช่น แนะนำให้ผู้ใช้สำรองข้อมูลสัปดาห์ละ 1 ครั้ง"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

          </div>
        </div>

        {/* Form Action Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl border border-slate-700 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition"
          >
            ยกเลิก
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSubmitting ? 'กำลังบันทึกข้อมูล...' : 'บันทึกรายงานงานไอที'}</span>
          </button>
        </div>

      </form>
    </div>
  );
};
