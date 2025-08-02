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
├── config/           # 設定檔（如 DB、環境變數）
├── controllers/      # 控制器，負責接收請求與回應
├── entities/         # 資料庫實體定義
├── enums/            # 列舉定義
├── implementations/  # 介面的具體實作類別
│   ├── storage/      # 儲存服務實作
│   │   ├── minio/    # MinIO 物件儲存實作
├── interfaces/       # 介面定義
│   ├── dto/          # 資料傳輸物件介面
│   ├── repositories/ # 資料存取層介面
│   ├── responses/    # API 回應格式介面
│   ├── services/     # 服務層介面
│   └── storage/      # 儲存服務介面
├── middlewares/      # Express 中介層（如驗證、錯誤處理）
├── repositories/     # 資料存取層
├── routes/           # 路由註冊與分派
├── services/         # 商業邏輯處理
│   ├── storage/      # 儲存相關服務
├── types/            # 額外的型別定義
├── utils/            # 工具函式（共用邏輯）
├── validations/      # 請求資料驗證（使用 Joi）
├── app.ts            # 應用初始化（掛載中間件、路由等）
└── server.ts         # 啟動應用程式（監聽指定 port）
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

# Logger 使用說明
採用物件格式來提供更好的日誌分析和追蹤能力。

## 基本用法

### Logger 方法

```typescript
import { logger } from './utils/logger';

// 資訊日誌
logger.info({ msg: '操作成功', userId: 123, action: 'login' });

// 警告日誌
logger.warn({ msg: '資源使用率過高', usage: '85%', threshold: '80%' });

// 錯誤日誌
logger.error({ msg: '資料庫連線失敗', error: error.message, retryCount: 3 });

// 除錯日誌
logger.debug({ msg: '函式執行', function: 'getUserById', params: { id: 123 } });
```

### 日誌格式規範
#### 標準物件結構
所有日誌都應該使用物件格式，包含以下基本欄位：

```typescript
{
  msg: '日誌訊息',           // 必填：描述性訊息
  requestId: 'XXXXXXX',    // 建議：請求追蹤 ID
  // 其他相關欄位...         // 選填：上下文資訊
}
```


# 其他資訊

### ERD
資料庫設計連結 [ERD](https://dbdiagram.io/d/Valet-parking-688b8322cca18e685caeff49)

### 技術文件

API 文件及範本： [postman](https://side-project-2577.postman.co/workspace/Side-Project-Workspace~be1d9cb4-cee3-4573-8548-ed2c8e1e4772/collection/25585578-08d1b2ac-a550-4936-8b3f-61e9b72c9a45?action=share&creator=25585578)