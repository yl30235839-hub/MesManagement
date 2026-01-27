# Vulkan Digital Twin - 製造業 MES 管理系統

本專案是一套專為製造業設計的數字孿生（Digital Twin）與 MES 管理系統，包含 3D 產線監控、人員考勤、設備維護及 FACA 故障分析功能。

## 🚀 生產環境部署指南 (Tailwind CSS)

目前開發版本為了快速原型設計使用了 Tailwind CDN。在部署至生產環境時，建議切換至標準編譯流程以優化效能。

### 1. 初始化專案環境 (若尚未執行)
在專案根目錄執行以下指令，確保環境中存有 `package.json`：

```bash
npm init -y
```

### 2. 安裝 Tailwind CSS 及其依賴
執行安裝指令。若遇到權限問題，請確認您具有寫入權限。

```bash
npm install -D tailwindcss postcss autoprefixer
```

### 3. 初始化配置文件
如果執行 `npx tailwindcss init -p` 報錯 `could not determine executable`，請嘗試以下任一指令：

**方案 A (推薦)：** 使用最新版本標籤執行
```bash
npx tailwindcss@latest init -p
```

**方案 B：** 直接調用本地二進制路徑 (Windows)
```bash
.\node_modules\.bin\tailwindcss init -p
```

**方案 C：** 直接調用本地二進制路徑 (macOS/Linux)
```bash
./node_modules/.bin/tailwindcss init -p
```

### 4. 配置 `tailwind.config.js`
修改產生的 `tailwind.config.js` 文件：

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./index.tsx",
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

### 5. 建立 CSS 進入點
建立文件 `style.css`：

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
```

### 6. 執行編譯與生產環境構建
在 `index.html` 中引入 `./dist/output.css` 後，執行：

```bash
# 生產環境壓縮編譯
NODE_ENV=production npx tailwindcss -i ./style.css -o ./dist/output.css --minify
```

## 🛠️ 後端連線配置
系統預設連線：`https://localhost:7201/api`。
若遇到 `Network Error`，請在瀏覽器打開該網址並點擊「進階 -> 繼續前往（不安全）」以信任 SSL 憑證。

---
© 2024 Vulkan Systems. All rights reserved.
