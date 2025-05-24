# IoTタスク管理デバイス - API仕様書

## 1. はじめに

本文書は、IoTタスク管理デバイスアプリケーションのバックエンドAPI仕様を定義します。フロントエンドアプリケーションおよびIoTデバイスは、本文書に記載されたAPIエンドポイントを通じてサーバーと通信します。

## 2. 共通事項

* **ベースURL:** (Vercelデプロイ時のURL)/api
    * 例: `https://your-app-name.vercel.app/api`
* **データ形式:** リクエストボディ、レスポンスボディ共に原則としてJSON形式。
* **認証:**
    * `/api/auth` エンドポイントでアプリケーションパスワードによる認証を行う。
    * 他の保護されたエンドポイントへのアクセスには、将来的にセッショントークン等を利用することを想定（現状の簡易認証では、APIキーやリクエスト元チェックなどを検討）。
* **エラーレスポンス形式 (例):**
    ```json
    {
      "message": "エラーの概要メッセージ"
      // "details": "エラーの詳細情報 (任意)"
    }
    ```
* **日付・時刻形式:** 原則としてISO 8601形式の文字列 (例: `"2025-05-24T12:30:00.000Z"`)。

## 3. APIエンドポイント詳細

### 3.1. 認証 (Auth)

#### 3.1.1. `POST /api/auth` - アプリケーションパスワード認証

* **目的:** アプリケーションパスワードを検証し、アプリケーションへのアクセスを許可する。
* **リクエストボディ:**
    ```json
    {
      "password": "string" // ユーザーが入力したパスワード
    }
    ```
* **レスポンス:**
    * **成功時 (`200 OK`):**
        ```json
        {
          "success": true,
          "message": "認証に成功しました。"
          // "token": "string" // 将来的なトークン発行
        }
        ```
    * **失敗時 (`401 Unauthorized`):**
        ```json
        {
          "success": false,
          "message": "パスワードが正しくありません。"
        }
        ```
* **処理概要:** 環境変数に保存されたアプリケーションパスワードとリクエストのパスワードを比較検証する。

---

### 3.2. デバイス (Tasks/Devices)

#### 3.2.1. `GET /api/devices` - 登録済みデバイス一覧取得

* **目的:** 登録されている全デバイス（タスク）の一覧と、それぞれの最新の状態を取得する。ダッシュボードの初期表示用。
* **リクエストボディ:** なし
* **レスポンス:**
    * **成功時 (`200 OK`):**
        ```json
        [
          {
            "deviceId": "string",
            "taskName": "string",
            "currentStatus": "'済' | '未'",
            "lastUpdatedAt": "timestamp" // ISO 8601
          }
          // ... 他のデバイス情報が続く
        ]
        ```
    * **失敗時 (`500 Internal Server Error`):**
        ```json
        {
          "message": "デバイス一覧の取得中にエラーが発生しました。"
        }
        ```
* **処理概要:** データベースから全デバイスの基本情報と、各デバイスの最新のステータスログを取得して整形する。

#### 3.2.2. `POST /api/devices` - 新規デバイス登録

* **目的:** 新しいデバイス（タスク）をシステムに登録する。
* **リクエストボディ:**
    ```json
    {
      "deviceId": "string", // ESP32から取得した一意のID
      "taskName": "string", // 初期タスク名
      "userId": "string"    // 固定のユーザーID (今回は1ユーザーなので固定値)
    }
    ```
* **レスポンス:**
    * **成功時 (`201 Created`):**
        ```json
        {
          "message": "デバイスが正常に登録されました。",
          "device": {
            "deviceId": "string",
            "taskName": "string",
            "userId": "string",
            "createdAt": "timestamp", // ISO 8601
            "updatedAt": "timestamp"  // ISO 8601
          }
        }
        ```
    * **失敗時:**
        * `400 Bad Request`: 入力不足、型不正 (`{ "message": "deviceId, taskName, userId は必須です。" }`)
        * `409 Conflict`: `deviceId` が既に存在する場合 (`{ "message": "このdeviceIdは既に使用されています。" }`)
        * `500 Internal Server Error`: データベースエラーなど (`{ "message": "サーバーエラーが発生しました。" }`)
* **処理概要:** リクエストデータのバリデーション、`deviceId`の重複チェック後、データベースに新しいデバイス情報を保存する。

#### 3.2.3. `GET /api/devices/{deviceId}` - 特定デバイス詳細情報取得

* **目的:** 特定のデバイス（タスク）の詳細情報（タスク名、現在の状態、作成日時など）を取得する。
* **パスパラメータ:**
    * `deviceId` (string): 取得対象のデバイスID。
* **リクエストボディ:** なし
* **レスポンス:**
    * **成功時 (`200 OK`):**
        ```json
        {
          "deviceId": "string",
          "taskName": "string",
          "userId": "string",
          "currentStatus": "'済' | '未'",  // TaskStatusLog の最新から取得
          "lastUpdatedAt": "timestamp", // TaskStatusLog の最新のタイムスタンプ、またはDeviceのupdatedAt
          "createdAt": "timestamp",     // DeviceのcreatedAt
          "updatedAt": "timestamp"      // DeviceのupdatedAt (taskName変更時など)
        }
        ```
    * **失敗時:**
        * `404 Not Found`: 指定された `deviceId` が存在しない場合 (`{ "message": "デバイスが見つかりません。" }`)
        * `500 Internal Server Error`: データベースエラーなど。
* **処理概要:** 指定された `deviceId` を基にデータベースからデバイス情報と最新のステータスを取得する。

#### 3.2.4. `PUT /api/devices/{deviceId}` - 特定デバイスタスク名変更

* **目的:** 特定のデバイス（タスク）のタスク名を変更する。オプションで履歴のリセットも行う。
* **パスパラメータ:**
    * `deviceId` (string): 更新対象のデバイスID。
* **リクエストボディ:**
    ```json
    {
      "taskName": "string", // 新しいタスク名
      "resetHistory": "boolean (optional, default: false)" // 履歴をリセットするかどうか
    }
    ```
* **レスポンス:**
    * **成功時 (`200 OK`):**
        ```json
        {
          "message": "デバイス情報が更新されました。",
          "device": {
            "deviceId": "string",
            "taskName": "string",
            "userId": "string",
            "createdAt": "timestamp",
            "updatedAt": "timestamp" // 更新後のタイムスタンプ
          }
        }
        ```
    * **失敗時:**
        * `400 Bad Request`: `taskName` がない、または不正な形式の場合。
        * `404 Not Found`: 指定された `deviceId` が存在しない場合。
        * `500 Internal Server Error`: データベースエラーなど。
* **処理概要:** 指定された `deviceId` のデバイスの `taskName` を更新。`resetHistory` が `true` の場合は、関連する全ての `TaskStatusLog` レコードを削除する。

#### 3.2.5. `DELETE /api/devices/{deviceId}` - 特定デバイス削除

* **目的:** 特定のデバイス（タスク）とそれに関連する全ての履歴を削除する。
* **パスパラメータ:**
    * `deviceId` (string): 削除対象のデバイスID。
* **リクエストボディ:** なし
* **レスポンス:**
    * **成功時 (`200 OK` または `204 No Content`):**
        ```json
        {
          "message": "デバイスと関連データが削除されました。"
        }
        ```
        または、ボディなしでステータスコード `204`。
    * **失敗時:**
        * `404 Not Found`: 指定された `deviceId` が存在しない場合。
        * `500 Internal Server Error`: データベースエラーなど。
* **処理概要:** 指定された `deviceId` のデバイス情報と、それに関連する全ての `TaskStatusLog` レコードをデータベースから削除する (DBのCASCADE制約利用を推奨)。

---

### 3.3. 状態履歴 (Status History)

#### 3.3.1. `POST /api/status` - IoTデバイスからの状態更新記録

* **目的:** IoTデバイスから送信されたタスクの最新状態を履歴として記録する。
* **リクエストボディ:**
    ```json
    {
      "deviceId": "string",
      "status": "'済' | '未'",
      "timestamp": "string" // ISO 8601形式のタイムスタンプ
    }
    ```
* **レスポンス:**
    * **成功時 (`201 Created`):**
        ```json
        {
          "message": "状態が正常に記録されました。",
          "log": {
            "logId": "string (または number)", // 生成されたログID
            "deviceId": "string",
            "timestamp": "timestamp", // ISO 8601
            "status": "'済' | '未'"
          }
        }
        ```
    * **失敗時:**
        * `400 Bad Request`: 入力不足、型不正。
        * `404 Not Found`: `deviceId` に対応するデバイスが登録されていない場合 (整合性チェック)。
        * `500 Internal Server Error`: データベースエラーなど。
* **処理概要:** リクエストデータのバリデーション後、`TaskStatusLog` テーブルに新しい状態レコードを保存する。

#### 3.3.2. `GET /api/devices/{deviceId}/history` - 特定デバイスの状態履歴取得

* **目的:** 特定のデバイス（タスク）の過去の状態履歴を取得する。
* **パスパラメータ:**
    * `deviceId` (string): 履歴取得対象のデバイスID。
* **クエリパラメータ (任意):**
    * `startDate` (string, YYYY-MM-DD): 取得開始日 (optional)。
    * `endDate` (string, YYYY-MM-DD): 取得終了日 (optional)。
    * `limit` (number): 取得する最大件数 (optional, pagination)。
    * `offset` (number) or `page` (number): 取得開始位置 (optional, pagination)。
    * `order` ("asc" | "desc", default: "desc"): 並び順 (optional, defaultは新しい順)。
* **リクエストボディ:** なし
* **レスポンス:**
    * **成功時 (`200 OK`):**
        ```json
        {
          "deviceId": "string",
          "taskName": "string", // 参考情報として現在のタスク名
          "history": [
            {
              "logId": "string (または number)",
              "timestamp": "timestamp", // ISO 8601
              "status": "'済' | '未'"
            }
            // ... 他の履歴エントリが続く
          ],
          "pageInfo": { // pagination利用時の情報 (任意)
            "totalCount": "number",  // 総履歴件数 (フィルタ適用後)
            "currentPage": "number",
            "totalPages": "number",
            "hasNextPage": "boolean",
            "hasPreviousPage": "boolean"
          }
        }
        ```
    * **失敗時:**
        * `404 Not Found`: 指定された `deviceId` が存在しない場合。
        * `500 Internal Server Error`: データベースエラーなど。
* **処理概要:** 指定された `deviceId` とクエリパラメータ（期間、ページネーションなど）に基づいて `TaskStatusLog` テーブルを検索し、結果を整形して返す。関連するデバイスの現在のタスク名も付加すると便利。
