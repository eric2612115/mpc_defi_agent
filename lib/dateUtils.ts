/**
 * 安全地将任何时间戳格式转换为ISO字符串
 * 
 * @param timestamp 输入时间戳，可以是字符串、数字、Date对象或undefined
 * @returns ISO格式的日期字符串
 */
export function formatTimestamp(timestamp: any): string {
  // 如果未提供时间戳，使用当前时间
  if (timestamp === undefined || timestamp === null) {
    return new Date().toISOString();
  }
    
  // 如果已经是字符串且看起来有效，直接返回
  if (typeof timestamp === 'string' && isValidISOString(timestamp)) {
    return timestamp;
  }
    
  // 尝试转换为Date对象
  try {
    return new Date(timestamp).toISOString();
  } catch (e) {
    console.warn("Invalid timestamp format, using current time instead:", timestamp);
    return new Date().toISOString();
  }
}
  
/**
   * 安全地将任何时间戳格式转换为Date对象
   * 
   * @param timestamp 输入时间戳，可以是字符串、数字、Date对象或undefined
   * @returns Date对象
   */
export function parseTimestamp(timestamp: any): Date {
  // 如果未提供时间戳，使用当前时间
  if (timestamp === undefined || timestamp === null) {
    return new Date();
  }
    
  // 如果已经是Date对象，直接返回
  if (timestamp instanceof Date) {
    return timestamp;
  }
    
  // 尝试转换为Date对象
  try {
    const date = new Date(timestamp);
    // 检查是否为有效的日期
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date');
    }
    return date;
  } catch (e) {
    console.warn("Invalid timestamp format, using current time instead:", timestamp);
    return new Date();
  }
}
  
/**
   * 格式化日期为本地时间显示格式
   * 
   * @param timestamp 任何格式的时间戳
   * @param options 格式化选项
   * @returns 格式化的日期字符串
   */
export function formatDateTime(
  timestamp: any, 
  options: Intl.DateTimeFormatOptions = { 
    hour: '2-digit', 
    minute: '2-digit' 
  }
): string {
  const date = parseTimestamp(timestamp);
  return date.toLocaleTimeString([], options);
}
  
/**
   * 检查字符串是否为有效的ISO日期格式
   */
function isValidISOString(str: string): boolean {
  try {
    // 尝试解析为日期
    const d = new Date(str);
    // 检查是否为有效的日期且包含T (ISO格式的标志)
    return !isNaN(d.getTime()) && str.includes('T');
  } catch (e) {
    return false;
  }
}
  
/**
   * 获取相对时间描述（例如，"5分钟前"）
   */
export function getRelativeTimeString(timestamp: any): string {
  const date = parseTimestamp(timestamp);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
  if (diffInSeconds < 60) {
    return "刚刚";
  }
    
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}分钟前`;
  }
    
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}小时前`;
  }
    
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays}天前`;
  }
    
  // 如果超过30天，直接显示日期
  return date.toLocaleDateString();
}