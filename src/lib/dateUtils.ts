/**
 * 日本時間（JST）での日付処理ユーティリティ
 * 2025-07-30 バンクーバー時間を導入
 */

// 日本のタイムゾーン
const JAPAN_TIMEZONE = 'Asia/Tokyo';
// バンクーバー（カナダ太平洋時間）のタイムゾーン
const VANCOUVER_TIMEZONE = 'America/Vancouver';

/**
 * UTC時刻を日本時間の文字列に変換
 * @param utcDate UTC時刻のDateオブジェクトまたはISO文字列
 * @returns 日本時間でフォーマットされた文字列
 */
export function formatToJapanTime(utcDate: Date | string): string {
  const date = typeof utcDate === 'string' ? new Date(utcDate) : utcDate;
  return date.toLocaleString('ja-JP', {
    timeZone: JAPAN_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

/**
 * UTC時刻を日本時間のyyyy-mm-dd hh:mm:ss形式に変換
 * @param utcDate UTC時刻のDateオブジェクトまたはISO文字列
 * @returns 日本時間でフォーマットされた文字列（yyyy-mm-dd hh:mm:ss）
 */
export function formatToJapanDateTime(utcDate: Date | string): string {
  const date = typeof utcDate === 'string' ? new Date(utcDate) : utcDate;
  const japanDate = new Date(date.toLocaleString('en-US', { timeZone: JAPAN_TIMEZONE }));
  
  const year = japanDate.getFullYear();
  const month = String(japanDate.getMonth() + 1).padStart(2, '0');
  const day = String(japanDate.getDate()).padStart(2, '0');
  const hours = String(japanDate.getHours()).padStart(2, '0');
  const minutes = String(japanDate.getMinutes()).padStart(2, '0');
  const seconds = String(japanDate.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * UTC時刻を日本時間の日付文字列（YYYY-MM-DD）に変換
 * @param utcDate UTC時刻のDateオブジェクトまたはISO文字列
 * @returns 日本時間での日付文字列（YYYY-MM-DD）
 */
export function formatToJapanDate(utcDate: Date | string): string {
  const date = typeof utcDate === 'string' ? new Date(utcDate) : utcDate;
  return date.toLocaleDateString('ja-JP', {
    timeZone: JAPAN_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).replace(/\//g, '-');
}

/**
 * 現在の日本時間を取得
 * @returns 日本時間のDateオブジェクト
 */
export function getCurrentJapanTime(): Date {
  return new Date(new Date().toLocaleString('en-US', { timeZone: JAPAN_TIMEZONE }));
}

/**
 * 日本時間の今日の日付文字列（YYYY-MM-DD）を取得
 * @returns 日本時間での今日の日付文字列
 */
export function getTodayInJapan(): string {
  return formatToJapanDate(new Date());
}

/**
 * UTC時刻を日本時間のDateオブジェクトに変換
 * @param utcDate UTC時刻のDateオブジェクトまたはISO文字列
 * @returns 日本時間に調整されたDateオブジェクト
 */
export function convertToJapanTime(utcDate: Date | string): Date {
  const date = typeof utcDate === 'string' ? new Date(utcDate) : utcDate;
  return new Date(date.toLocaleString('en-US', { timeZone: JAPAN_TIMEZONE }));
}

/**
 * 日本時間での月の日数を取得
 * @param month 月（0-11）
 * @param year 年
 * @returns その月の日数
 */
export function getDaysInMonthJapan(month: number, year: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * 日本時間での月の最初の日の曜日を取得
 * @param month 月（0-11）
 * @param year 年
 * @returns 最初の日の曜日（0=日曜日）
 */
export function getFirstDayOfMonthJapan(month: number, year: number): number {
  return new Date(year, month, 1).getDay();
}

/**
 * 日本時間での現在の年月を取得
 * @returns {year: number, month: number} 現在の年と月（0-11）
 */
export function getCurrentYearMonthJapan(): { year: number; month: number } {
  const now = getCurrentJapanTime();
  return {
    year: now.getFullYear(),
    month: now.getMonth(),
  };
}

/**
 * 指定された日付が日本時間での今日かどうかを判定
 * @param date 判定する日付
 * @returns 今日の場合true
 */
export function isToday(date: Date | string): boolean {
  const targetDate = formatToJapanDate(date);
  const today = getTodayInJapan();
  return targetDate === today;
}

/**
 * UTC時刻をバンクーバー時間の文字列に変換
 * @param utcDate UTC時刻のDateオブジェクトまたはISO文字列
 * @returns バンクーバー時間でフォーマットされた文字列
 */
export function formatToVancouverTime(utcDate: Date | string): string {
  const date = typeof utcDate === 'string' ? new Date(utcDate) : utcDate;
  return date.toLocaleString('en-CA', {
    timeZone: VANCOUVER_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

/**
 * UTC時刻をバンクーバー時間のyyyy-mm-dd hh:mm:ss形式に変換
 * @param utcDate UTC時刻のDateオブジェクトまたはISO文字列
 * @returns バンクーバー時間でフォーマットされた文字列（yyyy-mm-dd hh:mm:ss）
 */
export function formatToVancouverDateTime(utcDate: Date | string): string {
  const date = typeof utcDate === 'string' ? new Date(utcDate) : utcDate;
  const vancouverDate = new Date(date.toLocaleString('en-US', { timeZone: VANCOUVER_TIMEZONE }));
  
  const year = vancouverDate.getFullYear();
  const month = String(vancouverDate.getMonth() + 1).padStart(2, '0');
  const day = String(vancouverDate.getDate()).padStart(2, '0');
  const hours = String(vancouverDate.getHours()).padStart(2, '0');
  const minutes = String(vancouverDate.getMinutes()).padStart(2, '0');
  const seconds = String(vancouverDate.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * UTC時刻をバンクーバー時間の日付文字列（YYYY-MM-DD）に変換
 * @param utcDate UTC時刻のDateオブジェクトまたはISO文字列
 * @returns バンクーバー時間での日付文字列（YYYY-MM-DD）
 */
export function formatToVancouverDate(utcDate: Date | string): string {
  const date = typeof utcDate === 'string' ? new Date(utcDate) : utcDate;
  return date.toLocaleDateString('en-CA', {
    timeZone: VANCOUVER_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

/**
 * 現在のバンクーバー時間を取得
 * @returns バンクーバー時間のDateオブジェクト
 */
export function getCurrentVancouverTime(): Date {
  return new Date(new Date().toLocaleString('en-US', { timeZone: VANCOUVER_TIMEZONE }));
}

/**
 * バンクーバー時間の今日の日付文字列（YYYY-MM-DD）を取得
 * @returns バンクーバー時間での今日の日付文字列
 */
export function getTodayInVancouver(): string {
  return formatToVancouverDate(new Date());
}

/**
 * UTC時刻をバンクーバー時間のDateオブジェクトに変換
 * @param utcDate UTC時刻のDateオブジェクトまたはISO文字列
 * @returns バンクーバー時間に調整されたDateオブジェクト
 */
export function convertToVancouverTime(utcDate: Date | string): Date {
  const date = typeof utcDate === 'string' ? new Date(utcDate) : utcDate;
  return new Date(date.toLocaleString('en-US', { timeZone: VANCOUVER_TIMEZONE }));
}

/**
 * 指定された日付がバンクーバー時間での今日かどうかを判定
 * @param date 判定する日付
 * @returns 今日の場合true
 */
export function isTodayVancouver(date: Date | string): boolean {
  const targetDate = formatToVancouverDate(date);
  const today = getTodayInVancouver();
  return targetDate === today;
}
