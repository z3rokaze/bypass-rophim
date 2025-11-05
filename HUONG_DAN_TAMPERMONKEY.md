# 🎯 HƯỚNG DẪN CÀI ĐẶT TAMPERMONKEY

## 📋 MỤC LỤC

1. [Cài Đặt Tampermonkey](#1-cài-đặt-tampermonkey)
2. [Cài Script Từ File](#2-cài-script-từ-file-tampermonkeyuserjs)
3. [Cài Script Trực Tiếp Từ GitHub](#3-cài-script-trực-tiếp-từ-github)
4. [Kiểm Tra Script Đã Hoạt Động](#4-kiểm-tra-script-đã-hoạt-động)
5. [Troubleshooting](#5-troubleshooting)

---

## 1️⃣ CÀI ĐẶT TAMPERMONKEY

### 📌 Chrome / Edge / Brave

```
BƯỚC 1: Mở Chrome Web Store
→ Vào: chrome.google.com/webstore
→ Hoặc link trực tiếp:
  https://chrome.google.com/webstore/detail/dhdgffkkebhmkfjojejmpbldmpobfkfo

BƯỚC 2: Install Extension
→ Click "Add to Chrome"
→ Popup hiện → Click "Add extension"
→ Đợi 2-3 giây

BƯỚC 3: Xác Nhận
→ Icon Tampermonkey xuất hiện góc phải (puzzle icon)
→ ✅ Cài đặt thành công!
```

### 📌 Firefox

```
BƯỚC 1: Mở Firefox Add-ons
→ Vào: addons.mozilla.org
→ Hoặc link trực tiếp:
  https://addons.mozilla.org/firefox/addon/tampermonkey/

BƯỚC 2: Install Add-on
→ Click "Add to Firefox"
→ Popup permissions → Click "Add"
→ Click "Okay, Got It"

BƯỚC 3: Xác Nhận
→ Icon Tampermonkey xuất hiện toolbar
→ ✅ Cài đặt thành công!
```

### 📌 Safari (Mac)

```
BƯỚC 1: Mở App Store
→ Command+Space → Gõ "App Store"

BƯỚC 2: Tìm Tampermonkey
→ Search "Tampermonkey"
→ Click "Get" → "Install"
→ Nhập Apple ID password nếu yêu cầu

BƯỚC 3: Enable trong Safari
→ Safari → Preferences (Cmd+,)
→ Tab "Extensions"
→ Tick ✅ Tampermonkey
→ Grant permissions

BƯỚC 4: Xác Nhận
→ Icon xuất hiện toolbar
→ ✅ Cài đặt thành công!
```

---

## 2️⃣ CÀI SCRIPT TỪ FILE (`tampermonkey.user.js`)

### 📂 Method 1: Copy/Paste (Khuyến Nghị)

```
┌─────────────────────────────────────────────────────────┐
│  BƯỚC 1: Mở File tampermonkey.user.js                  │
└─────────────────────────────────────────────────────────┘

→ Mở file trong text editor (Notepad, VSCode, etc.)
→ Hoặc mở trên GitHub repo
→ Select All (Ctrl+A)
→ Copy (Ctrl+C)

┌─────────────────────────────────────────────────────────┐
│  BƯỚC 2: Mở Tampermonkey Dashboard                     │
└─────────────────────────────────────────────────────────┘

→ Click icon Tampermonkey (toolbar góc phải)
→ Click "Dashboard"
→ Tab mới mở ra

┌─────────────────────────────────────────────────────────┐
│  BƯỚC 3: Tạo Script Mới                                 │
└─────────────────────────────────────────────────────────┘

→ Click icon "+" (Create new script)
→ Editor mở với code mẫu

┌─────────────────────────────────────────────────────────┐
│  BƯỚC 4: Paste Code                                     │
└─────────────────────────────────────────────────────────┘

→ Ctrl+A (Select all code mẫu)
→ Delete
→ Ctrl+V (Paste code đã copy)

Code sẽ hiện:
// ==UserScript==
// @name         Rophim VIP Bypass v2.0 Stable
// @namespace    http://tampermonkey.net/
// @version      2.0
// ...

┌─────────────────────────────────────────────────────────┐
│  BƯỚC 5: Save Script                                    │
└─────────────────────────────────────────────────────────┘

→ Ctrl+S (hoặc File → Save)
→ Thấy thông báo "Script saved"
→ ✅ Thành công!

┌─────────────────────────────────────────────────────────┐
│  BƯỚC 6: Verify Script                                  │
└─────────────────────────────────────────────────────────┘

→ Quay lại tab "Installed userscripts"
→ Thấy script "Rophim VIP Bypass v2.0 Stable"
→ Icon ✅ xanh (enabled)
→ ✅ Ready to use!
```

### 📥 Method 2: Import File

```
┌─────────────────────────────────────────────────────────┐
│  BƯỚC 1: Mở Tampermonkey Dashboard                     │
└─────────────────────────────────────────────────────────┘

→ Click icon Tampermonkey
→ Click "Dashboard"

┌─────────────────────────────────────────────────────────┐
│  BƯỚC 2: Vào Tab Utilities                             │
└─────────────────────────────────────────────────────────┘

→ Click tab "Utilities" (góc trên)

┌─────────────────────────────────────────────────────────┐
│  BƯỚC 3: Import từ File                                 │
└─────────────────────────────────────────────────────────┘

→ Tìm section "Import from file"
→ Click "Choose File"
→ Chọn file "tampermonkey.user.js"
→ Click "Import"

⚠️ Lưu ý: File phải có header:
// ==UserScript==
// @name ...
// ==/UserScript==

┌─────────────────────────────────────────────────────────┐
│  BƯỚC 4: Verify                                        │
└─────────────────────────────────────────────────────────┘

→ Quay lại "Installed userscripts"
→ Thấy script mới
→ ✅ Done!
```

---

## 3️⃣ CÀI SCRIPT TRỰC TIẾP TỪ GITHUB

### 🌐 Method 1: Direct Install (Dễ Nhất)

```
┌─────────────────────────────────────────────────────────┐
│  BƯỚC 1: Vào GitHub Repo                                │
└─────────────────────────────────────────────────────────┘

→ Mở browser
→ Vào: https://github.com/z3rokaze/bypass-rophim

┌─────────────────────────────────────────────────────────┐
│  BƯỚC 2: Click File tampermonkey.user.js               │
└─────────────────────────────────────────────────────────┘

→ Tìm file "tampermonkey.user.js" trong danh sách
→ Click vào file

┌─────────────────────────────────────────────────────────┐
│  BƯỚC 3: Click "Raw"                                    │
└─────────────────────────────────────────────────────────┘

→ Ở góc phải file, click button "Raw"
→ Browser load file raw

┌─────────────────────────────────────────────────────────┐
│  BƯỚC 4: Tampermonkey Tự Động Detect                   │
└─────────────────────────────────────────────────────────┘

→ Tampermonkey tự động phát hiện userscript
→ Popup install hiện ra
→ Click "Install"
→ ✅ Done!

Nếu không popup:
→ Copy URL raw
→ Dùng Method 2 bên dưới
```

### 🔗 Method 2: Import từ URL

```
┌─────────────────────────────────────────────────────────┐
│  BƯỚC 1: Copy URL Raw                                   │
└─────────────────────────────────────────────────────────┘

URL raw của script:
https://raw.githubusercontent.com/z3rokaze/bypass-rophim/main/tampermonkey.user.js

→ Copy URL này

┌─────────────────────────────────────────────────────────┐
│  BƯỚC 2: Mở Tampermonkey Dashboard                     │
└─────────────────────────────────────────────────────────┘

→ Click icon Tampermonkey
→ Dashboard → Tab "Utilities"

┌─────────────────────────────────────────────────────────┐
│  BƯỚC 3: Import từ URL                                  │
└─────────────────────────────────────────────────────────┘

→ Tìm section "Import from URL"
→ Paste URL vào ô input
→ Click "Import"

┌─────────────────────────────────────────────────────────┐
│  BƯỚC 4: Confirm Install                                │
└─────────────────────────────────────────────────────────┘

→ Preview script hiện ra
→ Click "Install"
→ ✅ Done!

✅ Ưu điểm:
   • Auto-update từ GitHub
   • Luôn có version mới nhất
```

---

## 4️⃣ KIỂM TRA SCRIPT ĐÃ HOẠT ĐỘNG

### ✅ Check 1: Tampermonkey Icon

```
→ Vào www.rophim.li
→ Nhìn icon Tampermonkey (toolbar)
→ Thấy badge "1" (hoặc số khác)
→ ✅ Script đang chạy!
```

### ✅ Check 2: Script Status

```
→ Click icon Tampermonkey
→ Xem danh sách scripts
→ "Rophim VIP Bypass v2.0 Stable"
→ Icon ✅ xanh (enabled)
→ Domain: www.rophim.li (matched)
→ ✅ OK!
```

### ✅ Check 3: Console Logs

```
→ Vào www.rophim.li
→ F12 (mở DevTools)
→ Tab "Console"
→ Thấy:
  🎬 Rophim VIP Bypass
  VIP đến: 18/7/2099
  Coin: 999.999.999
→ ✅ Script hoạt động!
```

### ✅ Check 4: Coin Balance

```
→ Đăng nhập vào rophim.li
→ F5 (Reload trang)
→ Click vào avatar/username
→ Xem coin balance
→ Thấy: 999,999,999
→ ✅ Bypass thành công!
```

---

## 5️⃣ TROUBLESHOOTING

### ❌ Problem 1: Script Không Chạy

**Triệu chứng:**
- Icon Tampermonkey không có badge
- Coin vẫn = 0

**Fix:**

```
Check 1: Script đã enable?
→ Click icon Tampermonkey
→ Xem script có icon ✅ xanh không
→ Nếu ❌ đỏ → Click để enable

Check 2: Domain có match?
→ Đang ở đúng domain?
  • www.rophim.li ✅
  • www.rophim.me ✅
  • www.rophim.mx ✅
→ Không phải rophim.com (thiếu .li/.me/.mx)

Check 3: Reload trang
→ F5 (Normal reload)
→ Hoặc Ctrl+Shift+R (Hard reload)
```

### ❌ Problem 2: Lỗi "Script error"

**Triệu chứng:**
- Console có lỗi đỏ
- Script không load

**Fix:**

```
Check 1: Code đã paste đầy đủ?
→ Mở script trong Tampermonkey editor
→ Check có đầy đủ từ đầu đến cuối
→ Phải có:
  // ==UserScript==
  ...
  // ==/UserScript==

Check 2: Reinstall script
→ Dashboard → Click script → Remove
→ Cài lại từ đầu

Check 3: Update Tampermonkey
→ Check extension có update không
→ Update lên version mới nhất
```

### ❌ Problem 3: VIP Không Hiển Thị

**Triệu chứng:**
- Script chạy (badge = 1)
- Nhưng coin vẫn 0

**Fix:**

```
Step 1: Đăng nhập
→ Script chỉ hoạt động khi ĐÃ đăng nhập
→ Đăng nhập vào account

Step 2: Reload sau khi đăng nhập
→ F5 (Reload)
→ API /v1/user/info được call lại
→ Script patch response

Step 3: Clear cache
→ F12 → Console → Gõ:
  localStorage.clear();
  sessionStorage.clear();
→ Enter → Reload (F5)

Step 4: Check Console
→ F12 → Console
→ Tìm logs:
  🎬 Rophim VIP Bypass
  VIP đến: 18/7/2099
→ Nếu không thấy → Script chưa load
```

### ❌ Problem 4: "@require" Error

**Triệu chứng:**
- Lỗi: "Failed to load script from @require"

**Fix:**

```
Nguyên nhân:
→ File core.js chưa push lên GitHub
→ Hoặc URL sai

Solution 1: Dùng code trực tiếp
→ Thay vì dùng tampermonkey.user.js
→ Dùng file core.js
→ Copy toàn bộ code core.js
→ Paste vào Tampermonkey editor
→ Thêm header vào đầu:

// ==UserScript==
// @name         Rophim VIP Bypass v2.0 Stable
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  VIP đến 2099
// @author       z3rokaze
// @match        *://www.rophim.li/*
// @match        *://www.rophim.me/*
// @match        *://www.rophim.mx/*
// @match        *://goatembed.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function () {
  "use strict";
  // ... code từ core.js ...
})();

Solution 2: Đợi GitHub publish
→ Push code lên GitHub
→ Đợi 5-10 phút để CDN update
→ Clear browser cache
→ Reinstall script
```

---

## 🎯 SUMMARY - TÓM TẮT

### ✅ Cách Nhanh Nhất (Sau khi push GitHub):

```
1. Vào: https://github.com/z3rokaze/bypass-rophim
2. Click: tampermonkey.user.js
3. Click: "Raw"
4. Tampermonkey popup → "Install"
5. ✅ Done!
```

### ✅ Cách Thủ Công (Trước khi push):

```
1. Mở file core.js
2. Copy toàn bộ code
3. Tampermonkey → Create new script
4. Paste code
5. Thêm header (metadata)
6. Save
7. ✅ Done!
```

### ✅ Verify Hoạt Động:

```
1. Vào www.rophim.li
2. Đăng nhập
3. F5 (Reload)
4. Check coin → 999,999,999
5. ✅ Success!
```

---

## 📞 CẦN TRỢ GIÚP?

**Nếu vẫn gặp vấn đề:**

1. Check Console (F12) xem có lỗi gì
2. Check Tampermonkey logs
3. Reinstall extension
4. Thử browser khác

**Common URLs:**

```
Repo:     https://github.com/z3rokaze/bypass-rophim
Raw File: https://raw.githubusercontent.com/z3rokaze/bypass-rophim/main/tampermonkey.user.js
CDN:      https://cdn.jsdelivr.net/gh/z3rokaze/bypass-rophim@main/core.js
```

---

**Made with ❤️ by z3rokaze**

**Educational Purpose Only - Use Responsibly**
