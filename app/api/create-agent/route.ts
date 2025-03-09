// app/api/create-agent/route.ts
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
    
    console.log(`Creating agent for wallet: ${wallet_address}`);
    
    // Call backend API
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://0.0.0.0:8000';
    const response = await fetch(`${backendUrl}/api/create-agent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // body={wallet_address: wallet_address}
      body: JSON.stringify({"wallet_address": wallet_address})
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
    
    // For development mode, return a successful response
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️ Returning mock agent creation response for development');
      return NextResponse.json({ 
        success: true,
        agent_id: `agent-${Math.random().toString(36).substring(2, 9)}`,
        message: 'Agent created successfully (mock)' 
      });
    }
    
    return NextResponse.json(
      { error: 'Internal server error creating agent' },
      { status: 500 }
    );
  }
}