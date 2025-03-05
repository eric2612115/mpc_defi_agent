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
    
    // Make an API call to your FastAPI backend
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://0.0.0.0:8000';
    const response = await fetch(`${backendUrl}/api/agent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ wallet_address }),
    });
    
    if (!response.ok) {
      // If backend returns an error, pass it through
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
    
    // For development/testing, return a successful response
    // Remove this in production
    console.warn('⚠️ Returning mock agent creation response for development');
    return NextResponse.json({ 
      success: true,
      agentId: `agent-${Math.random().toString(36).substring(2, 9)}`,
      message: 'Agent created successfully (mock)' 
    });
  }
}