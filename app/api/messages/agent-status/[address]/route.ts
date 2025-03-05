import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { address: string } }
) {
  try {
    const address = params.address.toLowerCase();
    
    // Make an API call to your FastAPI backend
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://0.0.0.0:8000';
    const response = await fetch(`${backendUrl}/api/agent-status/${address}`);
    
    if (!response.ok) {
      // If backend returns an error, pass it through
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
    
    // For development/testing purposes, return a successful response
    // with mock data to bypass the agent creation flow
    // Remove this in production and use proper error handling
    console.warn('⚠️ Returning mock agent status data for development');
    return NextResponse.json({
      has_agent: true,
      multisig_address: `0xms${params.address.substring(2, 10)}`
    });
  }
}