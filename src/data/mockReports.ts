import { ITWorkReport } from '../types/report';

export const INITIAL_REPORTS: ITWorkReport[] = [
  {
    id: 'IT-20261015-001',
    date: '2026-10-15',
    time: '09:30',
    reporter: 'กิตติศักดิ์ เจริญพร (IT Support)',
    userName: 'คุณวิภาวรรณ (หัวหน้าแผนกบัญชี)',
    equipmentName: 'PC Workstation Dell OptiPlex 7090 (แผนกบัญชี - ชั้น 3)',
    equipmentCategory: 'computer',
    department: 'แผนกบัญชีและการเงิน',
    problemDetails: 'เครื่องบูตไม่ติด มีเสียง Beep Code 3 ครั้ง พัดลม CPU หมุนแรงผิดปกติ หน้าจอไม่แสดงผล ไฟปุ่มเปิดเครื่องกระพริบสีส้ม ตรวจสอบเบื้องต้นพบสายไฟภายในมีฝุ่นเกาะหนาแน่นและแรมหลวม',
    problemImages: [
      'https://images.unsplash.com/photo-1597733336794-12d05021d510?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1588702547919-26089e690ecc?w=800&auto=format&fit=crop&q=80'
    ],
    resolutionDetails: 'ทำการถอดฝาเครื่อง เป่าทำความสะอาดฝุ่นภายใน ถอดแผงแรม DDR4 ออกมาทำความสะอาดขั้วด้วยยางลบ และสลับสล็อตแรมใหม่ ทดสอบเปิดเครื่องสามารถบูตเข้า Windows 11 ได้ตามปกติ ตรวจสอบอุณหภูมิปกติ ส่งมอบเครื่องคืนผู้ใช้งาน',
    resolutionImages: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'completed',
    priority: 'high',
    cost: 0,
    notes: 'แนะนำแผนกบัญชีหลีกเลี่ยงการวางแฟ้มเอกสารบังช่องระบายอากาศใต้โต๊ะ',
    syncedToSheets: true,
    createdAt: '2026-10-15T09:30:00.000Z',
    updatedAt: '2026-10-15T10:45:00.000Z'
  },
  {
    id: 'IT-20261015-002',
    date: '2026-10-15',
    time: '11:15',
    reporter: 'ธนวัฒน์ มานะกิจ (Network Admin)',
    userName: 'ผู้ใช้งานแผนกบริการลูกค้า ชั้น 2',
    equipmentName: 'Core Switch Cisco Catalyst 2960 & สาย Patch Cord (ห้อง Server)',
    equipmentCategory: 'network',
    department: 'ฝ่ายไอที / โครงข่ายหลัก',
    problemDetails: 'ได้รับแจ้งระบบอินเทอร์เน็ตหลุดทั้งชั้น 2 ไฟสถานะพอร์ต Uplink สลับเป็นสีส้ม ตรวจสอบพบหัว RJ45 ของสาย Fiber transceiver มีการขยับและสาย Patch Cord เก่าชำรุด',
    problemImages: [
      'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80'
    ],
    resolutionDetails: 'เปลี่ยนสาย Patch Cat6 ใหม่ความยาว 2 เมตร ทำการย้ำหัว RJ45 เข้าหัวใหม่ ทดสอบค่า Ping และ Bandwidth ผ่าน iPerf3 ได้ 1Gbps เต็ม speed สัญญาณไฟเขียว เสเสถียรดี',
    resolutionImages: [
      'https://images.unsplash.com/photo-1520869562399-e772f042f422?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'completed',
    priority: 'urgent',
    cost: 250,
    notes: 'จัดระเบียบสาย Cable Management ในตู้ Rack ให้เรียบร้อย',
    syncedToSheets: true,
    createdAt: '2026-10-15T11:15:00.000Z',
    updatedAt: '2026-10-15T12:00:00.000Z'
  },
  {
    id: 'IT-20261015-003',
    date: '2026-10-15',
    time: '13:00',
    reporter: 'กิตติศักดิ์ เจริญพร (IT Support)',
    userName: 'คุณนภัสสร (เจ้าหน้าที่ฝ่ายสรรหา HR)',
    equipmentName: 'เครื่องพิมพ์มัลติฟังก์ชัน HP LaserJet Enterprise M608 (แผนก HR)',
    equipmentCategory: 'printer',
    department: 'แผนกทรัพยากรบุคคล',
    problemDetails: 'กระดาษติดบ่อยขึ้นโค้ด Error 13.00.00 Jam in Tray 2 และมีเสียงเฟืองดังผิดปกติเวลาดึงกระดาษ ลูกกลิ้ง Pickup Roller สึกหรอ',
    problemImages: [
      'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?w=800&auto=format&fit=crop&q=80'
    ],
    resolutionDetails: 'ทำความสะอาดเซนเซอร์กระดาษชั่วคราว ดึงเศษกระดาษที่ฉีกขาดออก แต่ยาง Pickup Roller หมดสภาพและชุดลูกยางสึกหรอ จำเป็นต้องสั่งชุด Maintenance Kit เปลี่ยนใหม่ อยู่ระหว่างรอใบเสนอราคาจาก Supplier',
    resolutionImages: [
      'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'pending',
    priority: 'medium',
    cost: 1800,
    notes: 'แนะนำให้แผนก HR ใช้เครื่องพิมพ์ชั้น 4 ชั่วคราวระหว่างรออะไหล่ส่งมอบวันที่ 18 ต.ค.',
    syncedToSheets: true,
    createdAt: '2026-10-15T13:00:00.000Z',
    updatedAt: '2026-10-15T13:40:00.000Z'
  },
  {
    id: 'IT-20261015-004',
    date: '2026-10-15',
    time: '14:20',
    reporter: 'อภิสิทธิ์ วงศ์สว่าง (System Admin)',
    userName: 'คุณพงษ์ศักดิ์ (ผู้จัดการฝ่ายการตลาด)',
    equipmentName: 'Notebook Lenovo ThinkPad T14 Gen 3 (ผู้จัดการฝ่ายการตลาด)',
    equipmentCategory: 'notebook',
    department: 'ฝ่ายการตลาด',
    problemDetails: 'เครื่องทำงานช้ามาก มี Popup โฆษณาเด้งขึ้นมาตลอดเวลา และโปรแกรม Outlook ค้างไม่ยอมเปิด ตรวจสอบพบ Adware และโปรแกรมแปลกปลอมทำงานใน Background Process หน่วง CPU ถึง 95%',
    problemImages: [
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80'
    ],
    resolutionDetails: 'อยู่ระหว่างดำเนินการรัน Scan ไวรัสด้วย Microsoft Defender Offline Scan และสำรองข้อมูลไฟล์งาน (Backup OneDrive) เตรียม Re-image Windows 11 Enterprise ใหม่',
    resolutionImages: [
      'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'in_progress',
    priority: 'high',
    notes: 'คาดว่าจะลงระบบและตั้งค่าเสร็จสิ้นภายในช่วงเย็น 17:30 น.',
    syncedToSheets: false,
    createdAt: '2026-10-15T14:20:00.000Z',
    updatedAt: '2026-10-15T14:50:00.000Z'
  },
  {
    id: 'IT-20261014-001',
    date: '2026-10-14',
    time: '10:00',
    reporter: 'ธนวัฒน์ มานะกิจ (Network Admin)',
    userName: 'คุณสมศักดิ์ (หัวหน้าคลังสินค้า)',
    equipmentName: 'กล้องวงจรปิด IP Camera Hikvision ตัวที่ 04 (บริเวณคลังสินค้าประตู 2)',
    equipmentCategory: 'cctv',
    department: 'ฝ่ายคลังสินค้าและโลจิสติกส์',
    problemDetails: 'ภาพจากกล้องวงจรปิดดับบนหน้าจอ Monitor NVR แจ้งเตือน Video Loss สัญญาณไฟ PoE ไม่จ่ายไฟไปที่ตัวกล้อง',
    problemImages: [
      'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=800&auto=format&fit=crop&q=80'
    ],
    resolutionDetails: 'ปีนขึ้นตรวจสอบจุดติดตั้ง พบหนูกัดสาย UTP ภายนอกขาด ทำการเดินสาย Drop-wire UTP ภายนอกใหม่พร้อมร้อยท่อ HDPE กันสัตว์กัดแทะ และปรับมุมมองกล้องใหม่ ภาพคมชัดระดับ 4K ใช้งานได้สมบูรณ์',
    resolutionImages: [
      'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'completed',
    priority: 'medium',
    cost: 450,
    notes: 'ตรวจสอบจุดเชื่อมต่ออื่นในคลังสินค้า มีการซีลกล่องกันน้ำเรียบร้อย',
    syncedToSheets: true,
    createdAt: '2026-10-14T10:00:00.000Z',
    updatedAt: '2026-10-14T11:45:00.000Z'
  },
  {
    id: 'IT-20261014-002',
    date: '2026-10-14',
    time: '15:30',
    reporter: 'กิตติศักดิ์ เจริญพร (IT Support)',
    userName: 'คุณกัญญา (ฝ่ายบัญชีและการเงิน)',
    equipmentName: 'ระบบโปรแกรมบัญชี Express',
    equipmentCategory: 'software',
    programName: 'Express (โปรแกรมบัญชี)',
    department: 'แผนกบัญชีและการเงิน',
    problemDetails: 'เครื่องลูกข่ายเปิดโปรแกรม Express ไม่ได้ ฟ้องข้อความ Error 70 / การเชื่อมต่อฐานข้อมูลขัดข้อง (Database Connection Refused)',
    problemImages: [
      'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80'
    ],
    resolutionDetails: 'ตรวจสอบสิทธิ์การแชร์โฟลเดอร์บนเครื่องแม่ข่าย (Server) ทำการ Re-connect Map Network Drive ไดรฟ์ Z: และรีสตาร์ต Database Service ทดสอบเข้าใช้งานโปรแกรมได้ตามปกติ',
    resolutionImages: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'completed',
    priority: 'high',
    cost: 0,
    notes: 'ตั้งค่า Auto Reconnect Network Drive ตอนบูตเข้าวินโดวส์',
    syncedToSheets: true,
    createdAt: '2026-10-14T15:30:00.000Z',
    updatedAt: '2026-10-14T16:15:00.000Z'
  }
];
