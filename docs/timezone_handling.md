# 時刻処理について（Timezone Handling）

## 概要

本プロジェクトでは、Vercel Postgresデータベースを使用しており、データベースの時刻はUTC（協定世界時）で保存されます。しかし、アプリケーションでは日本時間（JST: UTC+9）での表示と処理を行います。

## 実装方針

### 1. データベース
- **保存形式**: UTC時刻で統一
- **理由**: 
  - Vercel Postgresのデフォルト設定
  - 国際的な標準に準拠
  - タイムゾーンの変更に柔軟に対応可能

### 2. アプリケーション
- **表示**: 日本時間（JST）に変換して表示
- **処理**: 日本時間ベースでの日付比較・計算

## 実装詳細

### 日時ユーティリティ関数（`src/lib/dateUtils.ts`）

以下の関数を提供しています：

#### 基本変換関数
- `formatToJapanTime(utcDate)`: UTC時刻を日本時間の文字列に変換
- `formatToJapanDate(utcDate)`: UTC時刻を日本時間の日付文字列（YYYY-MM-DD）に変換
- `formatToJapanDateTime(utcDate)`: UTC時刻を日本時間のyyyy-mm-dd hh:mm:ss形式に変換
- `convertToJapanTime(utcDate)`: UTC時刻を日本時間のDateオブジェクトに変換

#### 現在時刻取得
- `getCurrentJapanTime()`: 現在の日本時間を取得
- `getTodayInJapan()`: 日本時間での今日の日付文字列を取得

#### カレンダー関連
- `getDaysInMonthJapan(month, year)`: 日本時間での月の日数を取得
- `getFirstDayOfMonthJapan(month, year)`: 日本時間での月の最初の日の曜日を取得
- `getCurrentYearMonthJapan()`: 日本時間での現在の年月を取得

#### 判定関数
- `isToday(date)`: 指定された日付が日本時間での今日かどうかを判定

### API実装

#### データベースからの取得
```typescript
// UTC時刻で保存されたデータを取得
const logs = await prisma.taskStatusLog.findMany({...});

// レスポンスではISO文字列として返す（フロントエンドで日本時間に変換）
const history = logs.map(log => ({
  logId: log.logId,
  timestamp: log.timestamp.toISOString(), // UTC時刻のISO文字列
  status: log.status,
}));
```

#### フロントエンドでの処理
```typescript
// 履歴データの日付比較（日本時間ベース）
const historyEntry = history.find(h => 
  formatToJapanDate(h.timestamp) === dateStr
);

// 今日の判定（日本時間ベース）
const isTodayJapan = isToday(dateStr);
```

## 使用例

### カレンダー表示
```typescript
// 日本時間での月の情報を取得
const numDays = getDaysInMonthJapan(month, year);
const firstDay = getFirstDayOfMonthJapan(month, year);

// UTC時刻のタイムスタンプを日本時間の日付と比較
const historyEntry = history.find(h => 
  formatToJapanDate(h.timestamp) === dateStr
);
```

### 時刻表示
```typescript
// UTC時刻を日本時間で表示
const displayTime = formatToJapanTime(utcTimestamp);
// 例: "2025/05/25 18:30:00"
```

## 注意事項

1. **データベース設定の変更は不要**
   - Vercel Postgresのタイムゾーン設定は変更できません
   - アプリケーションレベルでの対応が推奨されます

2. **一貫性の維持**
   - すべての日付比較は日本時間ベースで行う
   - 表示も日本時間に統一する

3. **将来の拡張性**
   - 他のタイムゾーンに対応する場合は、ユーティリティ関数を拡張
   - ユーザー設定でタイムゾーンを選択可能にすることも可能

## トラブルシューティング

### よくある問題

1. **カレンダーで日付がずれる**
   - 原因: UTC時刻での日付比較を行っている
   - 解決: `formatToJapanDate()`を使用して日本時間ベースで比較

2. **「今日」の判定が正しくない**
   - 原因: ブラウザのローカル時刻を使用している
   - 解決: `isToday()`関数を使用して日本時間ベースで判定

3. **時刻表示が9時間ずれる**
   - 原因: UTC時刻をそのまま表示している
   - 解決: `formatToJapanTime()`を使用して日本時間に変換

## 参考資料

- [JavaScript Date and Time API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat)
- [Vercel Postgres Documentation](https://vercel.com/docs/storage/vercel-postgres)
