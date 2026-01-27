# Vulkan Digital Twin - 製造業 MES 管理系統

本專案是一套專為製造業設計的數字孿生（Digital Twin）與 MES 管理系統，採用 **Tailwind CSS v4** 最新架構開發。

## 🚀 生產環境部署指南 (Node 24 + npm 11 + Tailwind v4)

Tailwind CSS v4 採用全新的「CSS-first」引擎。不再需要 `tailwind.config.js`，所有配置直接在 CSS 中完成。

### 1. 環境準備
確保開發環境符合以下版本要求：
- **Node.js**: v24.x
- **npm**: v11.x

### 2. 初始化項目與安裝 v4 依賴
```bash
# 初始化項目
npm init -y

# 安裝核心依賴與 CLI
npm install tailwindcss @tailwindcss/cli @tailwindcss/postcss postcss
```

### 3. 配置 CSS 與解決 IDE 報錯
1. 建立 `style.css` 並寫入 `@import "tailwindcss";`。
2. 建立 `.vscode/settings.json` 並設置 `"css.lint.unknownAtRules": "ignore"` 以消除 `@theme` 警告。

### 4. 執行生產環境編譯 (重要)
在執行編譯前，請確保輸出目錄已建立，否則 `npx` 可能無法寫入文件。

```bash
# 建立輸出目錄
mkdir -p dist

# 執行一次性編譯並壓縮
npx @tailwindcss/cli -i ./style.css -o ./dist/output.css --minify

# 開發模式 (實時監控)
npx @tailwindcss/cli -i ./style.css -o ./dist/output.css --watch
```

### 5. 更新 index.html (解決空白頁面問題)
確保您的 `index.html` 包含以下兩個關鍵部分：

1.  **引用編譯後的 CSS**：
    ```html
    <link href="./dist/output.css" rel="stylesheet">
    ```
2.  **引入 React 入口腳本 (不可省略)**：
    ```html
    <body>
      <div id="root"></div>
      <script type="module" src="./index.tsx"></script>
    </body>
    ```

## 🛠️ 後端連線配置
系統預設連線至後端 API 服務：`https://localhost:7201/api`。

### SSL 憑證信任步驟 (解決 Network Error)
若頁面顯示通訊異常：
1. 在瀏覽器手動打開：`https://localhost:7201/api/RegistPage/Verify`。
2. 點擊「進階」->「繼續前往（不安全）」。
3. 返回 MES 系統刷新頁面即可。

---
© 2024 Vulkan Systems. All rights reserved.