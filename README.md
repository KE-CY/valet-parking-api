# valet-parking-api

使用 Express + TypeScript + TypeORM  建構的現代化 RESTful API 專案。


# 安裝
### 系統需求
```
node.js >= 22.17.0
PostgreSQL = 16.4
```
### 依賴套件
``` bash
git clone https://github.com/KE-CY/valet-parking-api.git
cd valet-parking-api

npm install
```


#  專案結構說明
專案採用分層式架構設計
```
src/
├── config/          # 設定檔（如 DB、環境變數）
├── controllers/     # 控制器，負責接收請求與回應
├── entities/        # 資料庫實體定義
├── enums/           # 列舉定義
├── interfaces/      # 介面定義
├── middlewares/     # Express 中介層（如驗證、錯誤處理）
├── repositories/    # 資料存取層
├── routes/          # 路由註冊與分派
├── services/        # 商業邏輯處理
├── types/           # 額外的型別定義
├── utils/           # 工具函式（共用邏輯）
├── validations/     # 請求資料驗證（使用 Joi）
├── app.ts           # 應用初始化（掛載中間件、路由等）
└── server.ts        # 啟動應用程式（監聽指定 port）
```

# 快速開始

### 1. 環境配置


環境變數設定
請依照專案根目錄中的 .env.sample 檔案建立 .env 檔案，並填入相對應的設定值

複製並配置環境變數：

``` bash
cp .env.example .env
```
編輯 .env 檔案

### 2. 啟動應用程式
``` bash
# 開發模式
npm run dev

# 生產模式
npm run build
npm start
```

### 3. 驗證安裝

``` bash
curl http://localhost:3000/health
```

# Git Flow 流程說明

本專案使用 Git Flow 流程來管理分支，主要包含 `main`和 `develop` 兩個常態分支。
