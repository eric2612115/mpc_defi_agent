// app/api/messages/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get the wallet address from query params
    const searchParams = request.nextUrl.searchParams;
    const walletAddress = searchParams.get('wallet_address')?.toLowerCase();
    const showHistory = searchParams.get('show_history') === 'true';
    
    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }
    
    // Call the backend API
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://0.0.0.0:8000';
    const apiUrl = `${backendUrl}/api/messages?wallet_address=${walletAddress}&show_history=${showHistory}`;
    
    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        // If backend returns error, log it
        const errorText = await response.text();
        console.error(`Backend error (${response.status}): ${errorText}`);
        
        // Return empty messages array instead of error for better UX
        return NextResponse.json({ messages: [] }, { status: 200 });
      }
      
      const data = await response.json();
      return NextResponse.json(data);
    } catch (fetchError) {
      console.error('Error fetching from backend:', fetchError);
      // Return empty messages array on fetch error
      return NextResponse.json({ messages: [] }, { status: 200 });
    }
  } catch (error) {
    console.error('Error in messages API route:', error);
    
    // For development, return welcome message
    if (process.env.NODE_ENV !== 'production') {
      console.warn('⚠️ Returning demo message for development');
      return NextResponse.json({
        messages: [
          {
            id: '1',
            sender: 'agent',
            text: "Hello! I'm your AI Trading Assistant. How can I help you today?",
            timestamp: new Date().toISOString(),
            message_type: 'normal',
          }
        ]
      });
    }
    
    return NextResponse.json(
      { error: 'Internal server error', messages: [] },
      { status: 500 }
    );
  }
}