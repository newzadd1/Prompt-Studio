import { StylePreset } from './types';

export const STYLE_PRESETS: StylePreset[] = [
  { name: "ภาพยนตร์ 8K", prompt: "hyper-realistic, cinematic 8K, professional color grading, clean, sharp focus, epic" },
  { name: "อนิเมะคีย์วิชวล", prompt: "vibrant anime style, key visual, detailed characters, dynamic composition, Makoto Shinkai inspired" },
  { name: "ไซเบอร์พังค์นัวร์", prompt: "cyberpunk aesthetic, neon-drenched, rainy night, high-tech low-life, Blade Runner influence, noir" },
  { name: "ภาพวาดแฟนตาซี", prompt: "epic fantasy, digital painting, high detail, matte painting, concept art, Lord of the Rings style" },
  { name: "ฟิล์มย้อนยุค 80s", prompt: "80s retro film look, grain, analog style, vibrant synthwave colors, nostalgic" },
  { name: "เวกเตอร์มินิมอล", prompt: "clean vector art, minimalist, flat design, bold colors, graphic illustration" },
  { name: "ภาพนิ่งสารคดี", prompt: "realistic documentary photo, natural lighting, candid shot, National Geographic style, 35mm film" },
  { name: "พิกเซลอาร์ต", prompt: "8-bit pixel art, retro game style, limited color palette, chunky pixels" },
];

export const CHARACTER_PRESETS: { name: string, description: string }[] = [
    { name: "เลือกเทมเพลต...", description: "" },
    { name: "สาวสวยสุดเซ็กซี่", description: "สาวเกาหลีลูกครึ่งญี่ปุ่นไต้หวัน, ขาวสวย, สุดเซ็กซี่, อยู่ในชุดเดรสรัดรูปสีแดงเพลิงที่ขับเน้นสัดส่วนโค้งเว้า, ริมฝีปากอวบอิ่ม, ดวงตาคมกริบแฝงแววลึกลับน่าค้นหา" },
    { name: "นักรบโบราณ", description: "ชายหนุ่มนักรบโบราณ, ร่างกายกำยำเต็มไปด้วยมัดกล้าม, มีรอยแผลเป็นจากการต่อสู้บนใบหน้า, สวมชุดเกราะหนังที่ผ่านสมรภูมิมาอย่างโชกโชน, แววตาคมกริบดุจเหยี่ยว" },
    { name: "นักสืบไซเบอร์พังค์", description: "นักสืบเอกชนในโลกไซเบอร์พังค์, สวมเสื้อโค้ทกันฝนยาว, มีดวงตาจักรกลที่สแกนข้อมูลได้, ยืนอยู่ท่ามกลางแสงนีออนและสายฝนโปรยปรายในมหานครแห่งอนาคต" },
    { name: "แม่มดในป่าลึก", description: "แม่มดสาวในป่าลึกลับ, ผมสีเงินยาวสลวย, สวมชุดคลุมสีเขียวเข้มปักลายเถาวัลย์, กำลังร่ายมนตร์ที่ทำให้เกิดแสงเรืองรองรอบตัว" },
    { name: "นักบินอวกาศผู้โดดเดี่ยว", description: "นักบินอวกาศล่องลอยอยู่ในความเงียบงันของอวกาศ, มองดูกลุ่มดาวเนบิวลาหลากสีสันผ่านกระจกหมวก, แววตาสะท้อนความเหงาและความยิ่งใหญ่ของจักรวาล" }
];
