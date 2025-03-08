// utils/date-utils.ts

// 日期標籤類型定義
export interface DateTabItem {
    date: string; // YYYY-MM-DD format
    label: string;
  }
  
/**
   * 將日期格式化為 YYYY-MM-DD 字符串
   */
export const formatDateString = (date: Date): string => {
  return date.toISOString().split('T')[0];
};
  
/**
   * 生成日期標籤（今天和前4天）
   */
export const generateDateTabs = (): DateTabItem[] => {
  const tabs: DateTabItem[] = [];
  const today = new Date();
    
  for (let i = 0; i < 5; i++) {
    const date = new Date();
    date.setDate(today.getDate() - i);
      
    const formattedDate = formatDateString(date);
    const label = i === 0 ? 'Today' : 
      i === 1 ? 'Yesterday' : 
        date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
    tabs.push({
      date: formattedDate,
      label
    });
  }
    
  return tabs;
};
  
/**
   * 格式化自定義日期標籤
   */
export const formatCustomDateLabel = (date: Date): string => {
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
};
  
/**
   * 格式化日期顯示（完整日期）
   */
export const formatFullDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
};
  
/**
   * 檢查日期是否有效
   */
export const isValidDate = (dateString: string): boolean => {
  // 驗證輸入格式（YYYY-MM-DD）
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateString)) {
    return false;
  }
    
  // 檢查是否為有效日期
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return false;
  }
    
  // 檢查是否為未來日期
  if (date > new Date()) {
    return false;
  }
    
  return true;
};