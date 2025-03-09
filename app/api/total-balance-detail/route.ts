// app/api/total-balance-detail/route.ts
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
    
    // Make a request to the backend API
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://0.0.0.0:8000';
    const response = await fetch(`${API_BASE_URL}/api/total-balance-detail`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // body={wallet_address: wallet_address}
      body: JSON.stringify({"wallet_address": wallet_address})
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error from backend: ${errorText}`);
      return NextResponse.json(
        { error: `Error from backend: ${response.status}` },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Error proxying to backend:', error);
    
    // For development/testing, you can use this mock data if needed
    return NextResponse.json([
      { chain: "Ethereum", chainIndex: "1", symbol: "ETH", balance: "0.1217", tokenPrice: "2231.34", value: "271.57", tokenAddress: "", tokenType: "1", isRiskToken: false, icon: null, transferAmount: "0", availableAmount: "0" },
      { chain: "Ethereum", chainIndex: "1", symbol: "USDC", balance: "251.2110", tokenPrice: "0.9999", value: "251.19", tokenAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", tokenType: "1", isRiskToken: false, icon: null, transferAmount: "0", availableAmount: "0" },
      { chain: "BNB Smart Chain", chainIndex: "56", symbol: "WBNB", balance: "0.1500", tokenPrice: "596.9", value: "89.53", tokenAddress: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c", tokenType: "1", isRiskToken: false, icon: null, transferAmount: "0", availableAmount: "0" }
    ], { status: 200 });
  }
}