"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type Language = "EN" | "TH";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  EN: {
    hero_title: "One Graph to Rule Them All",
    hero_subtitle: "Combine your GitHub and GitLab contributions into a single, beautiful unified graph for your README.",
    cta_get_started: "Get Started",
    cta_view_demo: "View Demo",
    how_it_works: "How it Works",
    step1_title: "Connect Accounts",
    step1_desc: "Securely link your GitHub and GitLab via OAuth 2.0.",
    step2_title: "Unified Sync",
    step2_desc: "We merge your commit history from both platforms automatically.",
    step3_title: "Export & Shine",
    step3_desc: "Copy your secure SVG link and paste it into your profile README.",
    tutorial_title: "Step-by-Step Guide",
    tut_step1: "1. Link Your Accounts",
    tut_desc1: "Login with both GitHub and GitLab to authorize secure data fetching.",
    tut_step2: "2. Copy the Code",
    tut_desc2: "Choose your theme and copy the Markdown hook with a single click.",
    tut_step3: "3. Update Your README",
    tut_desc3: "Paste the code into your GitHub Profile README.md and you're done!",
    pro_tip_title: "Pro Tip: GitHub Profile README",
    pro_tip_desc: "To center your graph on your profile, use the HTML <img> tag inside a <p align=\"center\"> tag instead of standard Markdown:",
    update_info_title: "Auto-Update & Caching",
    update_info_desc: "Your graph updates automatically. Note: GitHub may cache the image for up to 1 hour. If it doesn't change immediately, please wait a bit.",
  },
  TH: {
    hero_title: "รวมทุกการมีส่วนร่วมในกราฟเดียว",
    hero_subtitle: "รวมข้อมูลการ Commit จากทั้ง GitHub และ GitLab มาวาดเป็น Contribution Graph ที่สวยงามสำหรับหน้า README ของคุณ",
    cta_get_started: "เริ่มใช้งานเลย",
    cta_view_demo: "ดูตัวอย่าง",
    how_it_works: "ขั้นตอนการทำงาน",
    step1_title: "เชื่อมต่อบัญชี",
    step1_desc: "เชื่อมต่อ GitHub และ GitLab อย่างปลอดภัยผ่านระบบ OAuth 2.0",
    step2_title: "รวมข้อมูล",
    step2_desc: "ระบบจะดึงประวัติการ Commit จากทั้งสองฝั่งมารวมกันโดยอัตโนมัติ",
    step3_title: "นำไปใช้งาน",
    step3_desc: "คัดลอกลิงก์ SVG ที่ปลอดภัยไปแปะในหน้า Profile README ของคุณ",
    tutorial_title: "คู่มือการใช้งานแบบทีละขั้นตอน",
    tut_step1: "1. เชื่อมต่อบัญชีของคุณ",
    tut_desc1: "ลงชื่อเข้าใช้ทั้ง GitHub และ GitLab เพื่ออนุญาตการดึงข้อมูลอย่างปลอดภัย",
    tut_step2: "2. คัดลอกรหัส",
    tut_desc2: "เลือกธีมที่ต้องการและกดคัดลอก Markdown Hook เพียงคลิกเดียว",
    tut_step3: "3. อัปเดต README ของคุณ",
    tut_desc3: "นำ Code ไปวางในไฟล์ README.md ของ GitHub Profile เป็นอันเสร็จสิ้น!",
    pro_tip_title: "เทคนิคพิเศษ: สำหรับ GitHub Profile README",
    pro_tip_desc: "หากต้องการจัดกราฟให้อยู่กึ่งกลางโปรไฟล์ ให้ใช้ Tag HTML <img> ครอบด้วย <p align=\"center\"> แทนการใช้ Markdown ปกติ:",
    update_info_title: "การอัปเดตและระบบแคช",
    update_info_desc: "กราฟจะอัปเดตอัตโนมัติทุกครั้งที่มีคนเข้าชมโปรไฟล์ของคุณ หมายเหตุ: GitHub อาจจำภาพเก่าไว้ (Cache) ประมาณ 1 ชั่วโมง หาก Commit แล้วกราฟยังไม่เปลี่ยนทันที",
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("EN");

  const t = (key: string) => {
    return (translations[language] as any)[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
