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
    terms_title: "Terms of Service",
    terms_content: "GitComBridge is provided 'as is'. We are not affiliated with GitHub or GitLab. By using this service, you agree that we fetch your public/private contribution data to generate visual graphs. We do not store your code or personal files.",
    privacy_title: "Privacy Policy",
    privacy_content: "We take your privacy seriously. Your access tokens are encrypted using AES-256-GCM. We only collect your username, email, and contribution counts. You can revoke access at any time by signing out or disconnecting your account.",
    footer_legal: "By signing in, you agree to our Terms and Privacy Policy.",
    back_to_home: "Back to Home",
    terms_sub1_title: "Acceptance of Terms",
    terms_sub1_desc: "By accessing or using GitComBridge, you agree to be bound by these terms. If you do not agree, please do not use the service.",
    terms_sub2_title: "Modifications",
    terms_sub2_desc: "We reserve the right to modify these terms at any time. Your continued use of the service constitutes acceptance of the new terms.",
    privacy_sub1_title: "Data Security",
    privacy_sub1_desc: "We use military-grade AES-256-GCM encryption to store your OAuth access tokens. Your tokens are never shared with third parties.",
    privacy_sub2_title: "Data Retention",
    privacy_sub2_desc: "We only keep your data as long as you have an active account. Signing out and disconnecting will remove your session from our database.",
    delete_account_title: "Danger Zone",
    delete_account_desc: "Once you delete your account, there is no going back. All your linked accounts and contribution data will be permanently removed.",
    delete_account_btn: "Delete Account",
    delete_confirm_msg: "Are you sure you want to delete your account? This action cannot be undone.",
    cancel_btn: "Cancel",
    back_btn: "Back to Home",
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
    terms_title: "ข้อกำหนดการใช้งาน",
    terms_content: "GitComBridge ให้บริการตามสภาพที่เป็นอยู่ เราไม่มีส่วนเกี่ยวข้องกับ GitHub หรือ GitLab การใช้บริการนี้แสดงว่าคุณยินยอมให้เราดึงข้อมูลสถิติการ Commit เพื่อสร้างกราฟ เราจะไม่เก็บโค้ดหรือไฟล์ส่วนตัวของคุณ",
    privacy_title: "นโยบายความเป็นส่วนตัว",
    privacy_content: "เราให้ความสำคัญกับความเป็นส่วนตัวของคุณ โทเค็นการเข้าถึงของคุณจะถูกเข้ารหัสด้วย AES-256-GCM เราเก็บเฉพาะชื่อผู้ใช้ อีเมล และจำนวนการ Commit เท่านั้น คุณสามารถยกเลิกการเชื่อมต่อได้ทุกเมื่อโดยการลงชื่อออก",
    footer_legal: "การลงชื่อเข้าใช้แสดงว่าคุณยอมรับข้อกำหนดและนโยบายความเป็นส่วนตัวของเรา",
    back_to_home: "กลับหน้าหลัก",
    terms_sub1_title: "การยอมรับข้อกำหนด",
    terms_sub1_desc: "การเข้าถึงหรือใช้ GitComBridge แสดงว่าคุณตกลงที่จะผูกพันตามข้อกำหนดเหล่านี้ หากคุณไม่ตกลง โปรดอย่าใช้บริการ",
    terms_sub2_title: "การแก้ไขข้อกำหนด",
    terms_sub2_desc: "เราขอสงวนสิทธิ์ในการแก้ไขข้อกำหนดเหล่านี้เมื่อใดก็ได้ การที่คุณใช้บริการต่อไปถือเป็นการยอมรับข้อกำหนดใหม่",
    privacy_sub1_title: "ความปลอดภัยของข้อมูล",
    privacy_sub1_desc: "เราใช้การเข้ารหัส AES-256-GCM ระดับมาตรฐานสากลเพื่อจัดเก็บโทเค็น OAuth ของคุณ โทเค็นของคุณจะไม่ถูกแบ่งปันกับบุคคลที่สาม",
    privacy_sub2_title: "การเก็บรักษาข้อมูล",
    privacy_sub2_desc: "เราเก็บข้อมูลของคุณไว้ตราบเท่าที่คุณยังมีบัญชีที่ใช้งานอยู่ การลงชื่อออกและยกเลิกการเชื่อมต่อจะลบเซสชันของคุณออกจากฐานข้อมูลของเรา",
    delete_account_title: "พื้นที่อันตราย",
    delete_account_desc: "เมื่อคุณลบบัญชีแล้ว ข้อมูลทุกอย่างจะไม่สามารถกู้คืนได้ บัญชีที่เชื่อมต่อไว้และข้อมูลสถิติทั้งหมดจะถูกลบออกอย่างถาวร",
    delete_account_btn: "ลบบัญชีของฉัน",
    delete_confirm_msg: "คุณแน่ใจหรือไม่ว่าต้องการลบบัญชี? การกระทำนี้ไม่สามารถยกเลิกได้ในภายหลัง",
    cancel_btn: "ยกเลิก",
    back_btn: "กลับหน้าหลัก",
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
