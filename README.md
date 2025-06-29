# Jay's Personal Website with AI Chat

這是一個現代化的個人網站專案，包含 AI 聊天功能。網站使用純 HTML、CSS 和 JavaScript 構建，並計劃整合 Google Gemini API 實現智能對話功能。

## 功能特點

- 響應式設計，支援各種設備尺寸
- 現代化的 UI/UX 設計
- AI 聊天界面
- 語音輸入功能
- 支援中文對話

## 技術棧

- HTML5
- CSS3 (使用現代 CSS 特性和變量)
- JavaScript (原生 ES6+)
- Web Speech API (語音識別)
- Google Gemini API (待整合)

## 開始使用

1. 克隆專案到本地：
   ```bash
   git clone [your-repository-url]
   ```

2. 打開專案目錄：
   ```bash
   cd [project-directory]
   ```

3. 使用本地服務器運行專案（推薦使用 Live Server 或 Python 的 HTTP 服務器）：
   ```bash
   # 如果使用 Python 3
   python -m http.server 8000
   
   # 或者使用 VS Code 的 Live Server 擴展
   ```

4. 在瀏覽器中訪問：
   ```
   http://localhost:8000
   ```

## Gemini API 整合（待完成）

要啟用 AI 聊天功能，您需要：

1. 獲取 Google Gemini API 密鑰
2. 在 `js/main.js` 中配置 API 密鑰
3. 取消註釋相關代碼並實現 API 調用

## 注意事項

- 語音識別功能需要瀏覽器支援 Web Speech API
- 建議使用最新版本的 Chrome、Firefox 或 Safari 瀏覽器
- 需要網絡連接才能使用語音識別和 AI 聊天功能

## 待辦事項

- [ ] 整合 Google Gemini API
- [ ] 添加更多個人資訊板塊
- [ ] 實現聊天歷史保存功能
- [ ] 添加深色模式支援

## 授權

MIT License 