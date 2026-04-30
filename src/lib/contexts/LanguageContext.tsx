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
    terms_content: "GitComBridge provides a unified contribution graph visualization service. By accessing our website and using our services, you agree to be bound by these Terms of Service. These terms apply to all visitors, users, and others who access or use the Service.",
    terms_sub1_title: "1. Service Usage & OAuth Authorization",
    terms_sub1_desc: "You authorize GitComBridge to access your contribution history from GitHub and GitLab via OAuth 2.0. We use this data solely for the purpose of generating visual graphs. We do not store your source code, private repository content, or sensitive files. You are responsible for maintaining the security of your linked accounts and any activity that occurs under your credentials.",
    terms_sub2_title: "2. Pro Subscription, Payments & Refunds",
    terms_sub2_desc: "Pro features are offered as a one-time payment for lifetime access to premium customization tools. All transactions are processed securely via Stripe. Due to the digital and instantaneous nature of these features, all sales are final and non-refundable. We reserve the right to modify, suspend, or update Pro features with reasonable notice to users.",
    terms_sub3_title: "3. Disclaimer of Warranties & Liability",
    terms_sub3_desc: "The service is provided 'as is' without warranties of any kind. We are not liable for any data loss, service interruptions, or issues arising from changes to third-party APIs (GitHub/GitLab). Use of GitComBridge is at your own risk, and we do not guarantee that the service will be uninterrupted or error-free.",
    privacy_title: "Privacy Policy",
    privacy_content: "Your privacy is our priority. We follow a 'minimal data collection' philosophy, gathering only what is absolutely necessary to provide our visualization services. We are committed to protecting your personal information through industry-standard security measures.",
    privacy_sub1_title: "1. Data Collection, Usage & Security",
    privacy_sub1_desc: "We collect your email, username, and public/private contribution metadata (commit counts, dates). Your OAuth access tokens are encrypted using AES-256-GCM before being stored. We do not sell, trade, or share your personal data with third parties for marketing or advertising purposes. Data is used solely for authentication and graph generation.",
    privacy_sub2_title: "2. Cookies, Analytics & Third Parties",
    privacy_sub2_desc: "We use essential session cookies to keep you logged in. We utilize Stripe for secure payment processing and may use basic analytics (e.g., Google Analytics) to understand site usage. These third-party providers have their own privacy policies governing how they handle your data.",
    privacy_sub3_title: "3. User Rights, Data Portability & Deletion",
    privacy_sub3_desc: "You have the right to access, modify, or delete your data at any time. You can revoke GitComBridge's access through your GitHub/GitLab account settings. Additionally, you can permanently delete your GitComBridge account in the dashboard settings, which will immediately and irrevocably wipe all your data from our servers.",
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
    terms_content: "GitComBridge ให้บริการรวบรวมและแสดงผลข้อมูลการมีส่วนร่วม (Contribution Graph) ในรูปแบบภาพ โดยการเข้าถึงเว็บไซต์และใช้งานบริการของเรา แสดงว่าคุณตกลงที่จะผูกพันตามข้อกำหนดการใช้งานเหล่านี้ ซึ่งครอบคลุมถึงผู้เยี่ยมชม ผู้ใช้ และบุคคลอื่นทุกคนที่เข้าถึงบริการ",
    terms_sub1_title: "1. การใช้งานบริการและการอนุญาตผ่าน OAuth",
    terms_sub1_desc: "คุณอนุญาตให้ GitComBridge เข้าถึงประวัติการมีส่วนร่วมของคุณจาก GitHub และ GitLab ผ่านระบบ OAuth 2.0 เราใช้ข้อมูลนี้เพื่อวัตถุประสงค์ในการสร้างกราฟเท่านั้น เราไม่มีการเก็บรวบรวมซอร์สโค้ด เนื้อหาในพื้นที่เก็บข้อมูลส่วนตัว หรือไฟล์ที่มีความละเอียดอ่อนของคุณ คุณมีหน้าที่รับผิดชอบในการรักษาความปลอดภัยของบัญชีที่เชื่อมต่อและกิจกรรมทั้งหมดที่เกิดขึ้นภายใต้ข้อมูลประจำตัวของคุณ",
    terms_sub2_title: "2. การสมัครสมาชิก Pro, การชำระเงิน และการคืนเงิน",
    terms_sub2_desc: "ฟีเจอร์ Pro มีให้บริการในรูปแบบการชำระเงินครั้งเดียวเพื่อเข้าใช้งานเครื่องมือปรับแต่งระดับพรีเมียมตลอดชีพ การทำธุรกรรมทั้งหมดจะดำเนินการอย่างปลอดภัยผ่าน Stripe เนื่องจากลักษณะของผลิตภัณฑ์เป็นข้อมูลดิจิทัลที่เข้าถึงได้ทันที การซื้อทั้งหมดถือเป็นที่สิ้นสุดและไม่สามารถคืนเงินได้ เราขอสงวนสิทธิ์ในการปรับเปลี่ยน ระงับ หรืออัปเดตฟีเจอร์ Pro โดยจะมีการแจ้งให้ผู้ใช้ทราบล่วงหน้าตามความเหมาะสม",
    terms_sub3_title: "3. การปฏิเสธการรับประกันและข้อจำกัดความรับผิด",
    terms_sub3_desc: "บริการนี้จัดให้ 'ตามสภาพที่เป็นอยู่' โดยไม่มีการรับประกันใดๆ เราไม่รับผิดชอบต่อการสูญหายของข้อมูล การหยุดชะงักของบริการ หรือปัญหาที่เกิดจากการเปลี่ยนแปลง API ของบุคคลที่สาม (GitHub/GitLab) การใช้งาน GitComBridge ถือเป็นความเสี่ยงของผู้ใช้เอง และเราไม่รับประกันว่าบริการจะไม่มีการขัดข้องหรือปราศจากข้อผิดพลาด",
    privacy_title: "นโยบายความเป็นส่วนตัว",
    privacy_content: "ความเป็นส่วนตัวของคุณคือสิ่งสำคัญที่สุดของเรา เรายึดถือปรัชญา 'การเก็บรวบรวมข้อมูลขั้นต่ำ' โดยจะจัดเก็บเฉพาะสิ่งที่จำเป็นอย่างยิ่งต่อการให้บริการแสดงผลข้อมูลเท่านั้น เรามุ่งมั่นที่จะปกป้องข้อมูลส่วนบุคคลของคุณผ่านมาตรการรักษาความปลอดภัยที่เป็นมาตรฐานอุตสาหกรรม",
    privacy_sub1_title: "1. การเก็บรวบรวม การใช้งาน และความปลอดภัยของข้อมูล",
    privacy_sub1_desc: "เราเก็บรวบรวมอีเมล ชื่อผู้ใช้ และข้อมูลเมตาการมีส่วนร่วมทั้งแบบสาธารณะและส่วนตัว (จำนวนการ Commit, วันที่) โทเค็นการเข้าถึง OAuth ของคุณจะถูกเข้ารหัสด้วย AES-256-GCM ก่อนจัดเก็บ เราไม่ขาย แลกเปลี่ยน หรือแบ่งปันข้อมูลส่วนบุคคลของคุณกับบุคคลที่สามเพื่อวัตถุประสงค์ทางการตลาดหรือการโฆษณา ข้อมูลจะถูกใช้เพื่อการยืนยันตัวตนและการสร้างกราฟเท่านั้น",
    privacy_sub2_title: "2. คุกกี้ การวิเคราะห์ข้อมูล และบุคคลที่สาม",
    privacy_sub2_desc: "เราใช้คุกกี้เซสชันที่จำเป็นเพื่อให้คุณอยู่ในระบบต่อไป เราใช้ Stripe สำหรับการชำระเงินที่ปลอดภัย และอาจใช้เครื่องมือวิเคราะห์พื้นฐาน (เช่น Google Analytics) เพื่อทำความเข้าใจการใช้งานเว็บไซต์ ผู้ให้บริการบุคคลที่สามเหล่านี้มีนโยบายความเป็นส่วนตัวของตนเองในการจัดการข้อมูลของคุณ",
    privacy_sub3_title: "3. สิทธิ์ของผู้ใช้ การเคลื่อนย้ายข้อมูล และการลบบัญชี",
    privacy_sub3_desc: "คุณมีสิทธิ์ในการเข้าถึง แก้ไข หรือลบข้อมูลของคุณได้ทุกเมื่อ คุณสามารถยกเลิกสิทธิ์การเข้าถึงของ GitComBridge ได้ผ่านการตั้งค่าบัญชี GitHub/GitLab ของคุณ นอกจากนี้ คุณยังสามารถลบบัญชี GitComBridge ได้อย่างถาวรในการตั้งค่าหน้าแดชบอร์ด ซึ่งจะลบข้อมูลทั้งหมดของคุณออกจากเซิร์ฟเวอร์ของเราในทันทีและไม่สามารถกู้คืนได้",
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
