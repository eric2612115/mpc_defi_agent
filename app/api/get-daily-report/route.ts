// app/api/get-daily-report/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // 獲取查詢參數
    const searchParams = request.nextUrl.searchParams;
    const year = searchParams.get('year');
    const month = searchParams.get('month');
    const day = searchParams.get('day');
    
    if (!year || !month || !day) {
      return NextResponse.json(
        { error: 'Year, month and day are required' },
        { status: 400 }
      );
    }
    
    // 轉發請求到後端API
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://0.0.0.0:7788';
    const apiUrl = `${backendUrl}/api/get-daily-report?year=${year}&month=${month}&day=${day}`;
    console.log(`redirect to: ${apiUrl}`);
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`backend error (${response.status}): ${errorText}`);
      
      // 檢查是否為404 - 數據不存在
      if (response.status === 404) {
        return NextResponse.json([], { status: 200 });
      }
      
      return NextResponse.json(
        { error: `Backend API error: ${response.status}` },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('每日報告API路由中的錯誤:', error);
    
    // 如果我們在開發環境中且沒有可用的後端，則返回一個空數組
    if (process.env.NODE_ENV !== 'production') {
      console.warn('⚠️ 返回空數組用於開發');
      return NextResponse.json([]);
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}