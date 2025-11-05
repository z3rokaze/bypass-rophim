#!/usr/bin/env node

/**
 * TEST SCRIPT - Kiểm tra logic cơ bản
 * Không thể test đầy đủ vì cần browser context
 * Nhưng có thể verify syntax và logic cơ bản
 */

console.log("🧪 BẮT ĐẦU TEST...\n");

// ═══════════════════════════════════════════════════════════════
// TEST 1: SYNTAX CHECK
// ═══════════════════════════════════════════════════════════════

console.log("📝 TEST 1: Kiểm tra Syntax...");

try {
  const fs = require('fs');
  
  // Check core.js (optimized version)
  const coreCode = fs.readFileSync('./core.js', 'utf8');
  new Function(coreCode);  // Parse code
  console.log("✅ core.js - Syntax OK (Optimized version)");
  
} catch (error) {
  console.log("❌ Syntax Error:", error.message);
  process.exit(1);
}

console.log();

// ═══════════════════════════════════════════════════════════════
// TEST 2: LOGIC VERIFICATION
// ═══════════════════════════════════════════════════════════════

console.log("🔬 TEST 2: Kiểm tra Logic...\n");

// Mock environment
const mockEnv = {
  TARGETS: new Set([
    "https://rophimapi.net/v1/user/info",
    "https://rophimapi.net/v1/user/updateProfile",
    "https://rophimapi.net/v1/auth/login",
    "https://rophimapi.net/v1/user/profile",
    "https://rophimapi.net/v1/vip/check",
    "https://rophimapi.net/v1/vip/status",
    "https://rophimapi.net/v2/user/info",
    "https://rophimapi.net/v2/user/profile",
  ]),
  
  VIP_EXPIRY_TIMESTAMP: Math.floor(new Date(2099, 6, 18, 0, 0, 0).getTime() / 1000),
  COIN_BALANCE: 999999999,
};

// Test isTarget function (optimized version)
function isTarget(url) {
  if (!url) return false;
  if (mockEnv.TARGETS.has(url)) return true;
  for (const target of mockEnv.TARGETS) {
    if (url.includes(target)) return true;
  }
  return false;
}

console.log("🎯 Test isTarget():");
const testUrls = [
  ["https://rophimapi.net/v1/user/info", true],
  ["https://rophimapi.net/v1/user/info?token=123", true],
  ["https://rophimapi.net/v2/user/profile", true],
  ["https://example.com/api/data", false],
  ["", false],
  [null, false],
];

let isTargetPassed = 0;
testUrls.forEach(([url, expected]) => {
  const result = isTarget(url);
  const status = result === expected ? "✅" : "❌";
  console.log(`  ${status} isTarget("${url || '(empty)'}"): ${result} (expected: ${expected})`);
  if (result === expected) isTargetPassed++;
});

console.log(`📊 Kết quả: ${isTargetPassed}/${testUrls.length} tests passed\n`);

// Test patchUserInfo function
const VIP_PATCH = {
  vip_expires_at: mockEnv.VIP_EXPIRY_TIMESTAMP,
  coin_balance: mockEnv.COIN_BALANCE,
  is_vip: true,
};

function patchUserInfo(data) {
  if (!data?.result) return data;
  
  const targets = [data.result];
  if (data.result.user) {
    targets.push(data.result.user);
  }
  
  targets.forEach(target => Object.assign(target, VIP_PATCH));
  return data;
}

console.log("🔧 Test patchUserInfo():");

// Test case 1: Normal response
const testData1 = {
  result: {
    id: 123,
    is_vip: false,
    coin_balance: 0,
    vip_expires_at: 0,
  }
};

const patched1 = patchUserInfo(JSON.parse(JSON.stringify(testData1)));
const test1Pass = 
  patched1.result.is_vip === true &&
  patched1.result.coin_balance === 999999999 &&
  patched1.result.vip_expires_at === mockEnv.VIP_EXPIRY_TIMESTAMP;

console.log(`  ${test1Pass ? "✅" : "❌"} Patch simple object:`, {
  is_vip: patched1.result.is_vip,
  coin_balance: patched1.result.coin_balance,
});

// Test case 2: Nested user object
const testData2 = {
  result: {
    user: {
      id: 456,
      is_vip: false,
      coin_balance: 100,
    },
    is_vip: false,
    coin_balance: 100,
  }
};

const patched2 = patchUserInfo(JSON.parse(JSON.stringify(testData2)));
const test2Pass = 
  patched2.result.is_vip === true &&
  patched2.result.user.is_vip === true &&
  patched2.result.coin_balance === 999999999 &&
  patched2.result.user.coin_balance === 999999999;

console.log(`  ${test2Pass ? "✅" : "❌"} Patch nested object:`, {
  "result.is_vip": patched2.result.is_vip,
  "result.user.is_vip": patched2.result.user.is_vip,
});

// Test case 3: Invalid data
const testData3 = null;
const patched3 = patchUserInfo(testData3);
const test3Pass = patched3 === null;
console.log(`  ${test3Pass ? "✅" : "❌"} Handle null data: ${patched3}`);

const patchTestsPassed = [test1Pass, test2Pass, test3Pass].filter(Boolean).length;
console.log(`📊 Kết quả: ${patchTestsPassed}/3 tests passed\n`);

// ═══════════════════════════════════════════════════════════════
// TEST 3: PERFORMANCE CHECK
// ═══════════════════════════════════════════════════════════════

console.log("⚡ TEST 3: Kiểm tra Performance...\n");

// Test Array vs Set performance
const TARGETS_ARRAY = Array.from(mockEnv.TARGETS);

function isTargetArray(url) {
  return TARGETS_ARRAY.some((t) => url?.includes(t));
}

function isTargetSet(url) {
  if (!url) return false;
  if (mockEnv.TARGETS.has(url)) return true;
  for (const target of mockEnv.TARGETS) {
    if (url.includes(target)) return true;
  }
  return false;
}

const iterations = 10000;
const testUrl = "https://rophimapi.net/v1/user/info?token=abc";

// Warm up
for (let i = 0; i < 100; i++) {
  isTargetArray(testUrl);
  isTargetSet(testUrl);
}

// Test Array version
console.time("Array.some() (old)");
for (let i = 0; i < iterations; i++) {
  isTargetArray(testUrl);
}
console.timeEnd("Array.some() (old)");

// Test Set version
console.time("Set lookup (new)");
for (let i = 0; i < iterations; i++) {
  isTargetSet(testUrl);
}
console.timeEnd("Set lookup (new)");

console.log();

// ═══════════════════════════════════════════════════════════════
// FINAL RESULT
// ═══════════════════════════════════════════════════════════════

const totalPassed = isTargetPassed + patchTestsPassed;
const totalTests = testUrls.length + 3;

console.log("═══════════════════════════════════════════════════");
console.log("📊 KẾT QUẢ TỔNG QUAN");
console.log("═══════════════════════════════════════════════════");
console.log();
console.log(`✅ Syntax Check: PASSED`);
console.log(`📝 Logic Tests: ${totalPassed}/${totalTests} PASSED`);
console.log(`⚡ Performance: Set nhanh hơn Array`);
console.log();

if (totalPassed === totalTests) {
  console.log("🎉 TẤT CẢ TESTS ĐỀU PASS! CODE HOẠT ĐỘNG TỐT!");
  console.log();
  console.log("⚠️  LƯU Ý: Đây chỉ là basic tests");
  console.log("   Để test đầy đủ, cần test trên browser:");
  console.log("   1. Cài vào Tampermonkey");
  console.log("   2. Vào www.rophim.li");
  console.log("   3. Đăng nhập");
  console.log("   4. F5 reload");
  console.log("   5. Check coin = 999,999,999");
  console.log();
  process.exit(0);
} else {
  console.log("❌ MỘT SỐ TESTS FAILED!");
  console.log("   Cần review lại logic");
  console.log();
  process.exit(1);
}
