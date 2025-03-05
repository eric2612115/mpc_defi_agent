// /app/api/user-status/route.ts - 創建這個新文件
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const walletAddress = params.get('wallet_address')?.toLowerCase();
  
  if(!walletAddress) {
    return NextResponse.json(
      { error: 'Wallet address is required' },
      { status: 400 }
    );
  }
  
  try {    
    // 呼叫後端 API
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://0.0.0.0:8000';
    const response = await fetch(`${backendUrl}/api/user-status?wallet_address=${walletAddress}`);
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error(`Error from backend: ${errorData}`);
      return NextResponse.json(
        { error: 'Failed to check agent status' },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error checking agent status:', error);
    
    // 開發模式回傳模擬數據
    console.warn('Returning mock agent status data for development');
    return NextResponse.json({
      has_agent: false,
      multisig_address: null
    });
  }
}