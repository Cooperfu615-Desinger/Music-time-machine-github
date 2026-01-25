# Project Status: Music Time Machine

本文件記錄了「音樂時光機」專案目前的資料狀態、元件邏輯與資料結構。

## 1. 現有資料全清單 (Data Inventory)

### 流派清單與資源狀態

目前專案定義了 14 個年代（1960 - 2025），共計 58 個流派入口。以下為流派名稱及其對應的音檔狀態：

| 年代 | 流派名稱 (Genre) | 音檔檔名 (.mp3) | 資源狀態 |
| :--- | :--- | :--- | :--- |
| **1960** | 早期搖滾 (Rock and Roll) | rock_and_roll.mp3 | ✅ 已就緒 |
| **1960** | 靈魂樂 (Soul Music) | soul_music.mp3 | ✅ 已就緒 |
| **1960** | 民謠復興 (Folk Revival) | folk_revival.mp3 | ✅ 已就緒 |
| **1960** | 自由爵士 / 模態爵士 (Free / Modal Jazz) | free_modal_jazz.mp3 | ✅ 已就緒 |
| **1965** | 英倫入侵 (British Invasion) | british_Invasion.mp3 | ✅ 已就緒 |
| **1965** | 民謠搖滾 (Folk Rock) | folk_rock.mp3 | ✅ 已就緒 |
| **1965** | 摩城之聲 (Motown Sound) | motown_sound.mp3 | ✅ 已就緒 |
| **1965** | 後波普爵士 (Post-Bop) | post_bop.mp3 | ✅ 已就緒 |
| **1970** | 硬式搖滾 / 重金屬 (Hard Rock / Heavy Metal) | hard_rock_heavy_metal.mp3 | ✅ 已就緒 |
| **1970** | 前衛搖滾 (Progressive Rock) | progressive_rock.mp3 | ✅ 已就緒 |
| **1970** | 軟搖滾 (Soft Rock) | soft_rock.mp3 | ✅ 已就緒 |
| **1970** | 爵士融合 (Jazz Fusion) | jazz_fusion.mp3 | ✅ 已就緒 |
| **1975** | 迪斯可 (Disco) | disco.mp3 | ✅ 已就緒 |
| **1975** | 龐克搖滾 (Punk Rock) | punk_rock.mp3 | ✅ 已就緒 |
| **1975** | 放克 (Funk) | funk.mp3 | ✅ 已就緒 |
| **1975** | 雷鬼 (Reggae) | reggae.mp3 | ✅ 已就緒 |
| **1980** | 新浪潮 (New Wave) | new_wave.mp3 | ✅ 已就緒 |
| **1980** | 後迪斯可 / 流行舞曲 (Post-Disco / Dance-Pop) | post_disco_dance_pop.mp3 | ✅ 已就緒 |
| **1980** | 競技場搖滾 (Arena Rock) | arena_rock.mp3 | ❌ 僅文字 |
| **1980** | 平滑爵士 (Smooth Jazz) | smooth_jazz.mp3 | ✅ 已就緒 |
| **1980** | 城市流行 (City Pop) | city_pop.mp3 | ❌ 僅文字 |
| **1985** | 合成器流行 (Synth-pop) | synth_pop.mp3 | ✅ 已就緒 |
| **1985** | 華麗金屬 (Glam Metal) | glam_metal.mp3 | ✅ 已就緒 |
| **1985** | 黃金年代嘻哈 (Golden Age) | golden_age.mp3 | ❌ 僅文字 |
| **1985** | 另類搖滾 (Alternative Rock) | alternative_rock.mp3 | ✅ 已就緒 |
| **1990** | 油漬搖滾 (Grunge) | grunge.mp3 | ✅ 已就緒 |
| **1990** | 幫派饒舌 (Gangsta Rap) | gangsta_rap.mp3 | ✅ 已就緒 |
| **1990** | 浩室音樂 (House) | house.mp3 | ✅ 已就緒 |
| **1990** | 酸爵士 / 吹普霍普 (Acid Jazz / Trip-hop) | acid_jazz.mp3 | ✅ 已就緒 |
| **1995** | 英倫搖滾 (Britpop) | britpop.mp3 | ✅ 已就緒 |
| **1995** | 流行龐克 (Pop Punk) | pop_punk.mp3 | ✅ 已就緒 |
| **1995** | 節奏藍調 / 嘻哈靈魂樂 (R&B / Hip Hop Soul) | rnb_hip_hop_soul.mp3 | ✅ 已就緒 |
| **1995** | IDM (智慧舞曲) | (格式化失敗) | ❌ 僅文字 |
| **2000** | 新金屬 (Nu Metal) | nu_metal.mp3 | ✅ 已就緒 |
| **2000** | 青少年流行 (Teen Pop) | teen_pop.mp3 | ✅ 已就緒 |
| **2000** | 當代 R&B (Contemporary R&B) | contemporary_rnb.mp3 | ✅ 已就緒 |
| **2000** | 後搖滾 (Post-Rock) | post_rock.mp3 | ✅ 已就緒 |
| **2005** | 情緒搖滾 (Emo / Pop Punk) | emo_punk.mp3 | ✅ 已就緒 |
| **2005** | 南方嘻哈 (Crunk) | crunk.mp3 | ✅ 已就緒 |
| **2005** | 獨立搖滾復興 (Indie Rock Revival) | indie_rock.mp3 | ✅ 已就緒 |
| **2005** | 新靈魂樂 (Neo-Soul) | neo_soul.mp3 | ✅ 已就緒 |
| **2010** | 電氣流行 (EDM) | edm.mp3 | ✅ 已就緒 |
| **2010** | 主流嘻哈 (Mainstream Hip Hop) | mainstream_hip_hop.mp3 | ✅ 已就緒 |
| **2010** | 獨立流行 (Indie Pop) | indie_pop.mp3 | ✅ 已就緒 |
| **2010** | 蒸汽波 (Vaporwave) | vaporwave.mp3 | ❌ 僅文字 |
| **2015** | 陷阱音樂 (Trap) | trap.mp3 | ✅ 已就緒 |
| **2015** | 熱帶浩室 (Tropical House) | tropical_house.mp3 | ❌ 僅文字 |
| **2015** | 串流時代流行 (Streaming Pop) | streaming_pop.mp3 | ✅ 已就緒 |
| **2015** | 現代爵士 / 跨界爵士 (Modern Jazz / Crossover) | modern_jazz_crossover.mp3 | ✅ 已就緒 |
| **2015** | 放鬆饒舌 (Chill Rap) | chill_rap.mp3 | ❌ 僅文字 |
| **2020** | 臥室流行 (Bedroom Pop) | bedroom_pop.mp3 | ✅ 已就緒 |
| **2020** | 韓國流行音樂 (K-Pop) | k_pop.mp3 | ✅ 已就緒 |
| **2020** | 復古未來主義 (Nu-Disco) | nu_disco.mp3 | ✅ 已就緒 |
| **2020** | 馮克/甩尾馮克 (Phonk / Drift Phonk) | phonk_drift_phonk.mp3 | ❌ 僅文字 |
| **2025** | 超流行/故障電子 (Hyperpop / Glitchcore) | glitchcore.mp3 | ✅ 已就緒 |
| **2025** | 拉丁都市流行 (Latin Urban) | latin_urban.mp3 | ✅ 已就緒 |
| **2025** | AI 協作與短影音流行 | ai.mp3 | ❌ 僅文字 |
| **2025** | 新迷幻 / 全球律動 (Neo-Psych) | neo_psych.mp3 | ❌ 僅文字 |

> [!NOTE]
> 目前共有 45 個流派已具備對應的 `.mp3` 檔案，13 個流派目前僅有文字描述。

---

## 2. 現有元件邏輯 (Component Logic)

### 衍生類別跳轉 (Sub-Genres Navigation)

目前在 `GenreCard.jsx` 中，對於「衍生類別 (subGenres)」的點擊事件處理如下：

* **跳轉方式**：單純的**關鍵字搜尋**。
* **實作細節**：
  * 點擊衍生類別標籤（Chip）時，會調用 `getGoogleSearchUrl(sub, "genre")`。
  * 該函數會生成一個 Google 搜尋連結：`https://www.google.com/search?q={query} music genre`。
  * 會在**新分頁**中開啟搜尋結果。
* **目前無內部 ID 對應**：目前尚無法在 App 內部直接跳轉到該衍生類別的卡片。

### 播放器實作 (Player Implementation)

* **技術選型**：使用瀏覽器**原生 `HTMLAudioElement` (`new Audio()`)**，無使用第三方套件。
* **核心邏輯**：
  * **音檔路徑計算**：優先使用 `item.musicFile`；若無，則自動提取 `genre` 字串中的英文名稱並轉換為小寫底線格式（例如：`Rock and Roll` -> `rock_and_roll.mp3`）。
  * **獨佔播放**：透過全域變數 `window.currentAudio` 確保同時間只有一個音軌在播放。播放新音軌前會觸發 `music-stop-all` 事件通知所有卡片更新 UI 狀態。
  * **存活性檢查**：在 `useEffect` 中使用 `fetch(url, { method: 'HEAD' })` 檢查音檔是否存在，若不存在則禁用播放按鈕。

---

## 3. 詳細的資料 Schema

目前 `src/data/musicData.js` 中單一音樂流派物件的最完整結構如下：

```javascript
{
    // 流派名稱，格式通常為「中文 (英文)」
    // 系統會自動提取括號內的內容作為音檔匹配關鍵字
    genre: "英倫入侵 (British Invasion)", 
    
    // (選填) 手動指定音檔名稱。若未提供，系統會根據 genre 產生預設檔名
    musicFile: "british_Invasion.mp3", 
    
    // 流派的簡短介紹描述
    desc: "英國搖滾樂團橫掃美國流行榜的文化現象，將搖滾樂推向了前所未有的藝術高度。",
    
    // 衍生出的細分流派或相關風格，目前點擊會觸發 Google 搜尋
    subGenres: ["Merseybeat", "Beat Music", "British Blues"],
    
    // 該流派的代表性藝人或團體，點擊會觸發 Google 搜尋
    artists: ["The Beatles", "The Rolling Stones", "The Kinks", "The Who"]
}
```

### 資料組織結構 (Root Structure)

```javascript
export const musicData = {
    "1960": [ { ... }, { ... } ],
    "1965": [ ... ],
    // ...以此類推至 2025
};
```
