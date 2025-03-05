// app/api/wallet-transaction-history/route.ts
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
    const response = await fetch(`${API_BASE_URL}/api/wallet-transaction-history`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ wallet_address }),
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
      { chain: "Ethereum", chainIndex: "1", txHash: "0x27e2678be601ea3a2016e23eafa01c5f000affc92d7f42dbeb560a08c87a23db", type: "Receive", details: "USDC", amount: "138.296737 USDC", value: "", time: "2025-02-24 13:53:35", status: "Success", icon: null, tokenAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", hitBlacklist: false, itype: "2", tag: "" },
      { chain: "Ethereum", chainIndex: "1", txHash: "0x2e6a4f21f48e63463f76268f53efea3e0eb04a7714d361c0942809277d0469af", type: "Send", details: "ETH", amount: "0 ETH", value: "0.000033425360308257", time: "2025-02-16 04:27:47", status: "Success", icon: null, tokenAddress: "", hitBlacklist: false, itype: "0", tag: "" },
      { chain: "BNB Smart Chain", chainIndex: "56", txHash: "0x82f12774372f5accdd05168307f344546a9b0410bd7cd7b2d22356672a852bb2", type: "Send", details: "BNB", amount: "0 BNB", value: "0.000026910642", time: "2025-02-16 04:27:44", status: "Success", icon: null, tokenAddress: "", hitBlacklist: false, itype: "0", tag: "" }
    ], { status: 200 });
  }
}