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
    terms_sub1_title: "1. Acceptance & Service",
    terms_sub1_desc: "By using GitComBridge, you authorize us to access your contribution history from GitHub and GitLab. We are not responsible for downtime caused by these third-party providers. Pro features are granted per account and are non-transferable.",
    terms_sub2_title: "2. Payments & Refunds",
    terms_sub2_desc: "Pro access is a one-time payment for lifetime access to premium features. Due to the digital nature of the product, all sales are final and non-refundable unless required by local law.",
    privacy_sub1_title: "1. Data Security & Encryption",
    privacy_sub1_desc: "We use AES-256-GCM encryption to secure your OAuth tokens. We only store metadata required to generate your graph (usernames, commit counts). We never read your source code.",
    privacy_sub2_title: "2. Cookies & Analytics",
    privacy_sub2_desc: "We use essential cookies for authentication and Stripe for secure payments. We do not sell your data to third parties or use tracking for advertisement purposes.",
    delete_account_title: "Danger Zone",
    delete_account_desc: "Once you delete your account, there is no going back. All your linked accounts and contribution data will be permanently removed.",
    delete_account_btn: "Delete Account",
    delete_confirm_msg: "Are you sure you want to delete your account? This action cannot be undone.",
    cancel_btn: "Cancel",
    back_btn: "Back to Home",
    export_title: "Export Settings",
    result_title: "Resulting Code",
    theme_light: "Light Themes",
    theme_dark: "Dark Themes",
    less: "Less",
    more: "More",
    copy_btn: "Copy Code",
    copied_btn: "Copied!",
    workspace_title: "Workspace",
    sign_in_gh: "Sign in with GitHub",
    sign_in_gl: "Sign in with GitLab",
    connected: "Connected",
    not_connected: "Not Connected",
    pro_customizer: "Pro Customizer",
    upgrade_to_pro: "Upgrade to Pro",
    custom_title: "Custom Title",
    weeks: "Weeks",
    layout: "Layout",
    cell_size: "Cell Size",
    visual_output: "Visual Output",
    realtime_preview: "Real-time Preview",
    generating_svg: "Generating SVG...",
    force_refresh: "Force Refresh",
    refreshing: "Refreshing...",
    half_year: "26 Weeks (Half Year)",
    standard: "52 Weeks (Standard)",
    two_years: "104 Weeks (2 Years)",
    horiz_normal: "Horizontal (Normal)",
    vert_sidebar: "Vertical (Sidebar)",
    ready_to_sync: "Ready to sync?",
    get_my_graph: "Get My Graph Now",
    interactive_enabled: "Interactive Enabled",
    hover_hint: "Try hovering over the legend colors!",
    view_flat: "Normal View",
    view_3d: "3D View",
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
    terms_sub1_title: "1. การยอมรับและบริการ",
    terms_sub1_desc: "การใช้ GitComBridge แสดงว่าคุณอนุญาตให้เราเข้าถึงประวัติการมีส่วนร่วมจาก GitHub และ GitLab เราไม่รับผิดชอบต่อการหยุดทำงานของบริการจากบุคคลที่สาม ฟีเจอร์ Pro มอบให้ต่อบัญชีและไม่สามารถโอนสิทธิ์ได้",
    terms_sub2_title: "2. การชำระเงินและการคืนเงิน",
    terms_sub2_desc: "การเข้าถึง Pro เป็นการชำระเงินครั้งเดียวเพื่อเข้าใช้งานฟีเจอร์พรีเมียมตลอดชีพ เนื่องจากเป็นผลิตภัณฑ์ดิจิทัล การซื้อทั้งหมดถือเป็นที่สิ้นสุดและไม่สามารถคืนเงินได้ เว้นแต่จะกำหนดโดยกฎหมายท้องถิ่น",
    privacy_sub1_title: "1. ความปลอดภัยและการเข้ารหัสข้อมูล",
    privacy_sub1_desc: "เราใช้การเข้ารหัส AES-256-GCM เพื่อรักษาความปลอดภัยของ OAuth token ของคุณ เราจัดเก็บเฉพาะข้อมูลเมตาที่จำเป็นในการสร้างกราฟ (ชื่อผู้ใช้, จำนวน Commit) เราไม่อ่านซอร์สโค้ดของคุณ",
    privacy_sub2_title: "2. คุกกี้และการวิเคราะห์ข้อมูล",
    privacy_sub2_desc: "เราใช้คุกกี้ที่จำเป็นสำหรับการยืนยันตัวตนและใช้ Stripe สำหรับการชำระเงินที่ปลอดภัย เราไม่ขายข้อมูลของคุณให้แก่บุคคลที่สามหรือใช้เพื่อการโฆษณา",
    delete_account_title: "พื้นที่อันตราย",
    delete_account_desc: "เมื่อคุณลบบัญชีแล้ว ข้อมูลทุกอย่างจะไม่สามารถกู้คืนได้ บัญชีที่เชื่อมต่อไว้และข้อมูลสถิติทั้งหมดจะถูกลบออกอย่างถาวร",
    delete_account_btn: "ลบบัญชีของฉัน",
    delete_confirm_msg: "คุณแน่ใจหรือไม่ว่าต้องการลบบัญชี? การกระทำนี้ไม่สามารถยกเลิกได้ในภายหลัง",
    cancel_btn: "ยกเลิก",
    back_btn: "กลับหน้าหลัก",
    export_title: "ตั้งค่าการส่งออก",
    result_title: "รหัสสำหรับใช้งาน",
    theme_light: "ธีมสว่าง",
    theme_dark: "ธีมมืด",
    less: "น้อย",
    more: "มาก",
    copy_btn: "คัดลอกรหัส",
    copied_btn: "คัดลอกแล้ว!",
    workspace_title: "พื้นที่ทำงาน",
    sign_in_gh: "เข้าใช้ด้วย GitHub",
    sign_in_gl: "เข้าใช้ด้วย GitLab",
    connected: "เชื่อมต่อแล้ว",
    not_connected: "ยังไม่เชื่อมต่อ",
    pro_customizer: "เครื่องมือปรับแต่ง Pro",
    upgrade_to_pro: "อัปเกรดเป็น Pro",
    custom_title: "หัวข้อกราฟ",
    weeks: "จำนวนสัปดาห์",
    layout: "รูปแบบการวาง",
    cell_size: "ขนาดช่องสี่เหลี่ยม",
    visual_output: "ตัวอย่างกราฟ",
    realtime_preview: "แสดงผลแบบเรียลไทม์",
    generating_svg: "กำลังสร้าง SVG...",
    force_refresh: "รีเฟรชข้อมูลใหม่",
    refreshing: "กำลังรีเฟรช...",
    half_year: "26 สัปดาห์ (ครึ่งปี)",
    standard: "52 สัปดาห์ (มาตรฐาน)",
    two_years: "104 สัปดาห์ (2 ปี)",
    horiz_normal: "แนวนอน (ปกติ)",
    vert_sidebar: "แนวตั้ง (แถบข้าง)",
    ready_to_sync: "พร้อมรวมข้อมูลหรือยัง?",
    get_my_graph: "สร้างกราฟของฉันตอนนี้",
    interactive_enabled: "รองรับ Interactive",
    hover_hint: "ลองวางเมาส์ทับแถบสีด้านล่างดูสิ!",
    view_flat: "มุมมองปกติ",
    view_3d: "มุมมอง 3D",
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
