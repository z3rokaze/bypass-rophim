# ⚡ QUICK START - Bắt Đầu Nhanh trong 2 Phút

> Hướng dẫn cài đặt và sử dụng Rophim VIP Bypass nhanh nhất

---

## 🎯 3 BƯỚC ĐƠN GIẢN

### ✅ BƯỚC 1: Cài Tampermonkey (30 giây)

**Chrome / Edge:**
```
1. Vào: chrome.google.com/webstore
2. Tìm: "Tampermonkey"
3. Click: "Add to Chrome"
```

**Firefox:**
```
1. Vào: addons.mozilla.org
2. Tìm: "Tampermonkey"  
3. Click: "Add to Firefox"
```

---

### ✅ BƯỚC 2: Thêm Script (1 phút)

```bash
# Mở Tampermonkey Dashboard
1. Click icon Tampermonkey trên toolbar
2. Click "Create a new script"
3. Xóa code mẫu có sẵn
4. Copy TOÀN BỘ nội dung file deobfucated.js
5. Paste vào
6. Ctrl+S (Save)
```

---

### ✅ BƯỚC 3: Sử Dụng (10 giây)

```bash
1. Vào www.rophim.me
2. Đăng nhập tài khoản
3. Reload trang (F5)
4. Check VIP ✅
```

---

## 🎬 KẾT QUẢ

Sau khi cài đặt, bạn sẽ có:

| Tính năng | Trước | Sau |
|-----------|-------|-----|
| **VIP Status** | ❌ No | ✅ Active |
| **Coin Balance** | 0 | 999,999,999 |
| **VIP Expires** | N/A | +10 năm |
| **Ads** | ✅ Có | ❌ Không |

---

## 🔍 KIỂM TRA SCRIPT HOẠT ĐỘNG

### Cách 1: Check Account Info
```
1. Click vào avatar/username
2. Xem Coin Balance
3. Nếu thấy 999,999,999 → ✅ Thành công!
```

### Cách 2: Check Console
```
1. F12 → Console
2. Tìm message: "Rophim VIP Bypass activated"
3. Thấy message → ✅ Script đang chạy!
```

### Cách 3: Check Tampermonkey
```
1. Click icon Tampermonkey
2. Thấy số "1" → ✅ Script enabled
3. Tên script có ✅ màu xanh → Active
```

---

## ❌ KHÔNG HOẠT ĐỘNG?

### Fix Nhanh:

**Problem: VIP không hiển thị**
```javascript
// Solution:
1. F12 → Console
2. Gõ: localStorage.clear()
3. Enter
4. F5 (Reload)
```

**Problem: Script không chạy**
```javascript
// Solution:
1. Check Tampermonkey icon có "1" không?
2. Nếu không → Click script → Enable
3. Reload trang (F5)
```

**Problem: Coin vẫn = 0**
```javascript
// Solution:
1. Check @run-at document-start trong metadata
2. Nếu thiếu → Thêm vào
3. Ctrl+S và reload
```

---

## 📊 SO SÁNH VERSIONS

| | Code Obfuscated | Code Deobfuscated (Repo này) |
|---|-----------------|-------------------------------|
| **Cần key** | ✅ Yes | ❌ No - Miễn phí |
| **Đọc được code** | ❌ No | ✅ Yes - 642 dòng |
| **An toàn** | ⚠️ Không rõ | ✅ Đã kiểm tra |
| **Tùy chỉnh** | ❌ Khó | ✅ Dễ dàng |
| **Kill switch** | ✅ Yes | ❌ No - Luôn hoạt động |

---

## 🎯 FEATURES CHÍNH

```
✅ VIP trọn đời (10 năm)
✅ 999,999,999 coin
✅ Không cần key/telegram
✅ Code đã giải mã - an toàn
✅ Không thu thập dữ liệu
✅ Tự động hoạt động
```

---

## 💡 TIPS & TRICKS

### Tip 1: Tùy chỉnh coin amount
```javascript
// Mở script, tìm dòng:
data.result.coin_balance = 999999999;

// Đổi thành số khác để tự nhiên hơn:
data.result.coin_balance = 5000000;  // 5 triệu
```

### Tip 2: Bật debug mode
```javascript
// Thêm vào đầu script:
console.log("✅ Bypass activated!");
console.log("Current URL:", window.location.href);
```

### Tip 3: Multi-browser
```
# Dùng được trên:
- Chrome / Edge / Brave
- Firefox
- Safari (với Tampermonkey)
- Kiwi Browser (Android)
```

---

## 🔗 LIÊN KẾT NHANH

| Tài liệu | Thời gian đọc |
|----------|---------------|
| ⚡ [Quick Start](./QUICK_START.md) | 2 phút |
| 📖 [README đầy đủ](./README.md) | 10 phút |
| 📘 [Hướng dẫn chi tiết](./HUONG_DAN_SU_DUNG.md) | 30 phút |

---

## ❓ FAQ NHANH

**Q: An toàn không?**  
A: ✅ Code đã deobfuscate, kiểm tra được - KHÔNG có mã độc

**Q: Cần trả tiền không?**  
A: ❌ Hoàn toàn miễn phí

**Q: Mobile dùng được không?**  
A: ✅ Dùng Kiwi Browser (Android)

**Q: Bị ban không?**  
A: ⚠️ Rủi ro thấp, nhưng có thể xảy ra

---

<div align="center">

### 🚀 Sẵn sàng bắt đầu?

**[📖 Đọc Hướng Dẫn Đầy Đủ](./README.md)** • **[📘 Chi Tiết Kỹ Thuật](./HUONG_DAN_SU_DUNG.md)**

---

**Chúc bạn xem phim vui vẻ! 🎬**

</div>
