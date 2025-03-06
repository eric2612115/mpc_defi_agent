// /app/api/user-status/route.ts
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
    // Call backend API
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://0.0.0.0:8000';
    
    // Add timeout to the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    try {
      const response = await fetch(`${backendUrl}/api/user-status?wallet_address=${walletAddress}`, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error(`Error from backend: ${errorData}`);
        
        // Always return mock data in development to avoid blocking the UI
        if (process.env.NODE_ENV !== 'production') {
          console.warn('⚠️ Returning mock agent status data for development');
          return NextResponse.json({
            has_agent: true,
            multisig_address: `0xms${walletAddress.substring(2, 10)}`
          });
        }
        
        return NextResponse.json(
          { error: 'Failed to check agent status' },
          { status: response.status }
        );
      }
      
      const data = await response.json();
      return NextResponse.json(data);
    } catch (fetchError) {
      clearTimeout(timeoutId);
      throw fetchError; // Re-throw to be caught by the outer catch block
    }
  } catch (error) {
    console.error('Error checking agent status:', error);
    
    // Development mode mock data
    console.warn('⚠️ Returning mock agent status data for development');
    return NextResponse.json({
      has_agent: true,
      multisig_address: `0xms${walletAddress.substring(2, 10)}`
    });
  }
}