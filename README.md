# Vulkan Digital Twin - 製造業 MES 管理系統

本專案是一套專為製造業設計的數字孿生（Digital Twin）與 MES 管理系統，包含 3D 產線監控、人員考勤、設備維護及 FACA 故障分析功能。

## 🚀 生產環境部署指南 (Tailwind CSS)

目前開發版本為了快速原型設計使用了 Tailwind CDN (`<script src="https://cdn.tailwindcss.com"></script>`)。在部署至生產環境時，強烈建議切換至標準的編譯流程，以移除未使用的樣式並優化載入速度。

### 1. 安裝必要依賴
首先，確保您的開發環境已安裝 Node.js，然後在專案根目錄執行：

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 2. 配置 `tailwind.config.js`
修改產生的配置文件，確保 Tailwind 知道要掃描哪些文件中的 Class 名稱：

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

### 3. 建立 CSS 進入點
建立一個文件 `style.css` 並加入 Tailwind 指令：

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* 您可以在此處添加自定義樣式 */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
```

### 4. 更新 `index.html`
移除 `<script src="https://cdn.tailwindcss.com"></script>`，並改為引用編譯後的 CSS 文件：

```html
<!-- 生產環境中請移除 CDN 腳本 -->
<!-- <script src="https://cdn.tailwindcss.com"></script> -->
<link href="./dist/output.css" rel="stylesheet">
```

### 5. 執行編譯腳本
在 `package.json` 中添加編譯命令，或直接在終端機執行：

```bash
# 開發監控模式
npx tailwindcss -i ./style.css -o ./dist/output.css --watch

# 生產環境編譯 (會進行壓縮與最佳化)
NODE_ENV=production npx tailwindcss -i ./style.css -o ./dist/output.css --minify
```

## 🛠️ 後端連線配置

本系統預設連線至本地 API 服務：`https://localhost:7201/api`。

### SSL 憑證安全性提示
若後端使用自簽署憑證，瀏覽器可能會攔截請求並回報 `Network Error`：
1. 請確保後端服務已啟動。
2. 在瀏覽器打開 `https://localhost:7201/api/RegistPage/Verify`。
3. 點擊「進階」並選擇「繼續前往（不安全）」，以建立瀏覽器對該端口的信任。

## 📂 專案結構
- `components/`: UI 組件（3D 監控、設備管理、FACA 分析等）。
- `services/`: API 請求封裝。
- `types.ts`: 全域類型定義。
- `constants.ts`: 模擬數據與常量。

---
© 2024 Vulkan Systems. All rights reserved.
