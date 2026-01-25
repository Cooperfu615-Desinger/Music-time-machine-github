# 音樂時光機 (Music Time Machine) 技術架構規格文件

## 1. 專案概況

「音樂時光機」是一個基於 Web 的互動式應用程式，旨在帶領使用者探索不同年代的音樂流派發展。透過時間軸與百科雙視圖模式，使用者可以直觀地了解世界音樂歷史的演進。

## 2. 技術棧 (Technology Stack)

### 2.1 前端核心

- **框架**: [React 18.2.0](https://react.dev/) - 用於建構組件化使用者介面。
- **建置工具**: [Vite 4.4.5](https://vitejs.dev/) - 提供極速的開發開發環境與最佳化後的正式產出。
- **語言**: JavaScript (ESM)。

### 2.2 樣式與 UI

- **CSS 框架**: [Tailwind CSS 3.3.3](https://tailwindcss.com/) - 採用 Utility-first 概念，快速實現響應式與現代化設計。
- **圖標庫**: [Lucide React](https://lucide.dev/) - 提供專業且輕量化的向量圖標。
- **動畫**: 結合 Tailwind 內建過渡效果與自定義 CSS 動畫 (如 `fade-in`, `fade-in-up`)。

### 2.3 測試工具

- **測試框架**: [Vitest](https://vitest.dev/) - 與 Vite 深度整合的單元測試工具。
- **測試庫**: [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) - 模擬真實操作進行組件測試。

---

## 3. 專案系統架構 (System Architecture)

### 3.1 目錄結構

```text
/
├── public/              # 靜態資源 (如 CNAME, 圖片)
├── src/
│   ├── components/      # 共用組件 (如 GenreCard.jsx)
│   ├── data/            # 靜態資料庫 (音樂歷史數據)
│   ├── test/            # 全域測試配置
│   ├── App.jsx          # 主要邏輯與路由切換中心
│   ├── main.jsx         # 應用程式入口
│   └── index.css        # 全域樣式配置與 Tailwind 指令
├── tailwind.config.js    # Tailwind 客製化配置
├── vite.config.js       # Vite 插件與建置配置
└── package.json         # 專案相依套件與腳本定義
```

### 3.2 視圖模式與單頁面邏輯 (SPA)

本專案採用單頁面應用程式 (SPA) 架構，透過 `useState` 管理當前模式：

- **時間軸模式 (Timeline View)**: 以年份為維度捲動展示。
- **百科模式 (Encyclopedia View)**: 全域流派搜尋與過濾。

---

## 4. 核心功能規格

### 4.1 時間軸探索 (Year Discovery)

- **年份切換**: 提供從 1960 年代至今的年份選擇器，點擊後觸發流派卡片更新。
- **捲動機制**: 支援桌面端群組捲動與移動端橫向滑動。

### 4.2 音樂流派百科 (Music Encyclopedia)

- **全域搜尋**: 支援關鍵字篩選流派名稱與內容描述。
- **動態更新**: 搜尋結果即時呈現，並顯示符合數量的統計。

### 4.3 互動流派卡片 (Genre Card Component)

- **視覺呈現**: 支援漸層背景與精確的排版佈局。
- **衍生搜尋**: 提供點擊卡片內部的衍生類別 (Origin/Influence) 進行二次搜尋的功能。
- **外部連接**: 點擊藝術家名稱連結至外部搜尋引擎。

---

## 5. 資料規格 (Data Model)

資料儲存於 `src/data/musicData.js`，以物件格式組織，Key 為年份，Value 為流派陣列：

```javascript
{
  "1960": [
    {
      "genre": "Rock",
      "desc": "描述文字...",
      "artist": "代表人物",
      "origin": ["來源1", "來源2"]
    }
  ]
}
```

---

## 6. 開發與部署指令

### 6.1 本地開發

```bash
npm run dev
```

### 6.2 專案測試

```bash
npm run test
```

### 6.3 生產環境建置

```bash
npm run build
```

---

## 7. 設計規範

- **色彩計畫**: 深色背景模式 (Neutral 900 / Black)，主要強調色為紫色 (Purple) 與粉色 (Pink) 漸層。
- **字體**: 使用系統無襯線字體，強調可讀性與現代感。
- **響應式設計**: 完全相容於行動裝置 (Mobile-first 考量)。
