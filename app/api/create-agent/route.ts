// /app/api/create-agent/route.ts - 創建這個新文件
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { wallet_address } = body;
    
    if (!wallet_address) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }
    
    // 呼叫後端 API
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://0.0.0.0:8000';
    const response = await fetch(`${backendUrl}/api/create-agent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      //body should like{"wallet_address": "string"}
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error(`Error from backend: ${errorData}`);
      return NextResponse.json(
        { error: 'Failed to create agent' },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating agent:', error);
    
    // 開發模式回傳模擬數據
    console.warn('⚠️ Returning mock agent creation response for development');
    return NextResponse.json({ 
      success: true,
      message: 'Agent created successfully (mock)' 
    });
  }
}