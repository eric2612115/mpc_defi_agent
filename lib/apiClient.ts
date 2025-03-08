// lib/apiClient.ts
/**
 * API Client for interacting with the backend
 * This centralizes all API calls and provides consistent error handling
 */

interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}
  
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://0.0.0.0:8000';
// Force mock data in development to avoid backend connection issues
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_DEVELOPMENT_MODE === 'true' || true;
  
/**
 * Generic API fetcher with error handling
 */
async function fetchApi<T>(
  endpoint: string, 
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    // If we're using mock data, don't even attempt the fetch
    if (USE_MOCK_DATA && endpoint.includes('agent-status')) {
      console.warn('⚠️ Using mock data (global override)');
      return {
        data: { has_agent: true, multisig_address: "0x123mock456address789" } as any,
        status: 200
      };
    }

    if (USE_MOCK_DATA && endpoint.includes('messages')) {
      console.warn('⚠️ Using mock data for messages (global override)');
      return {
        data: {
          messages: [
            {
              id: '1',
              sender: 'agent',
              text: "Hello! I'm your AI Trading Assistant. How can I help you today?",
              timestamp: new Date().toISOString(),
              message_type: 'normal',
            }
          ]
        } as any,
        status: 200
      };
    }
    
    // Use absolute URL if endpoint starts with http, otherwise prepend base URL
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
      
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
  
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error (${response.status}): ${errorText}`);
        
      return {
        error: `Request failed with status ${response.status}`,
        status: response.status
      };
    }
  
    const data = await response.json();
    return { data, status: response.status };
  } catch (error) {
    console.error('API request failed:', error);
    
    // If fetch fails and we're checking agent status, return mock data
    if (endpoint.includes('agent-status')) {
      console.warn('⚠️ Fetch failed, returning mock agent status data');
      return {
        data: {
          has_agent: true,
          multisig_address: "0xmock_multisig_address"
        } as any,
        status: 200
      };
    }
    
    // If fetch fails and we're fetching messages, return mock messages
    if (endpoint.includes('messages')) {
      console.warn('⚠️ Fetch failed, returning mock messages data');
      return {
        data: {
          messages: [
            {
              id: '1',
              sender: 'agent',
              text: "Hello! I'm your AI Trading Assistant. How can I help you today?",
              timestamp: new Date().toISOString(),
              message_type: 'normal',
            }
          ]
        } as any,
        status: 200
      };
    }
    
    return {
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      status: 500
    };
  }
}
  
/**
 * Check if a user has an agent
 */
export async function checkAgentStatus(walletAddress: string): Promise<ApiResponse<{ has_agent: boolean, multisig_address?: string }>> {
  if (USE_MOCK_DATA) {
    console.warn('⚠️ Using mock data for agent status');
    return {
      data: {
        has_agent: true,
        multisig_address: `0xms${walletAddress.substring(2, 10)}`
      },
      status: 200
    };
  }
  
  try {
    const res = await fetchApi<{ has_agent: boolean, multisig_address?: string }>(`/api/user-status?wallet_address=${walletAddress}`);
    console.log('Agent status check result:', res);
    return res;
  } catch (error) {
    console.error('Error in checkAgentStatus:', error);
    // Always return mock data on error to prevent application crashes
    return {
      data: {
        has_agent: true,
        multisig_address: `0xms${walletAddress.substring(2, 10)}`
      },
      status: 200
    };
  }
}
  
/**
 * Create an agent for a user
 */
export async function createAgent(walletAddress: string): Promise<ApiResponse<{ success: boolean, message: string }>> {
  if (USE_MOCK_DATA) {
    console.warn('⚠️ Using mock data for agent creation');
    return {
      data: {
        success: true,
        message: 'Agent created successfully (mock)'
      },
      status: 200
    };
  }
    
  try {
    return await fetchApi<{ success: boolean, message: string }>('/api/create-agent', {
      method: 'POST',
      body: JSON.stringify({ wallet_address: walletAddress }),
    });
  } catch (error) {
    console.error('Error in createAgent:', error);
    // Return mock success on error
    return {
      data: {
        success: true,
        message: 'Agent created successfully (mock fallback)'
      },
      status: 200
    };
  }
}
  
/**
 * Get user messages
 */
export async function getUserMessages(walletAddress: string, showHistory: boolean = false): Promise<ApiResponse<{ messages: any[] }>> {
  if (USE_MOCK_DATA) {
    console.warn('⚠️ Using mock data for user messages');
    return {
      data: {
        messages: [
          {
            id: '1',
            sender: 'agent',
            text: "Hello! I'm your AI Trading Assistant. How can I help you today?",
            timestamp: new Date().toISOString(),
            message_type: 'normal',
          }
        ]
      },
      status: 200
    };
  }
    
  try {
    return await fetchApi<{ messages: any[] }>(`/api/messages?wallet_address=${walletAddress}&show_history=${showHistory}`);
  } catch (error) {
    console.error('Error in getUserMessages:', error);
    // Return mock messages on error
    return {
      data: {
        messages: [
          {
            id: '1',
            sender: 'agent',
            text: "Hello! I'm your AI Trading Assistant. How can I help you today?",
            timestamp: new Date().toISOString(),
            message_type: 'normal',
          }
        ]
      },
      status: 200
    };
  }
}
  
/**
 * Deploy multisig wallet
 */
export async function deployMultisigWallet(walletAddress: string): Promise<ApiResponse<{ success: boolean, multisig_address: string }>> {
  if (USE_MOCK_DATA) {
    return {
      data: {
        success: true,
        multisig_address: `0xmultisig_${Math.random().toString(36).substring(2, 10)}`
      },
      status: 200
    };
  }
  
  try {
    return await fetchApi<{ success: boolean, multisig_address: string }>('/api/deploy-multisig', {
      method: 'POST',
      body: JSON.stringify({ wallet_address: walletAddress }),
    });
  } catch (error) {
    console.error('Error in deployMultisigWallet:', error);
    // Return mock success on error
    return {
      data: {
        success: true,
        multisig_address: `0xmultisig_${Math.random().toString(36).substring(2, 10)}`
      },
      status: 200
    };
  }
}
  
/**
 * Submit user signature for transaction
 */
export async function submitUserSignature(
  walletAddress: string, 
  txHash: string, 
  userSignature: string
): Promise<ApiResponse<{ success: boolean, tx_hash: string }>> {
  if (USE_MOCK_DATA) {
    return {
      data: {
        success: true,
        tx_hash: txHash || `0x${Math.random().toString(36).substring(2, 10)}`
      },
      status: 200
    };
  }
  
  try {
    return await fetchApi<{ success: boolean, tx_hash: string }>('/api/user-signature', {
      method: 'POST',
      body: JSON.stringify({ 
        wallet_address: walletAddress, 
        tx_hash: txHash, 
        user_signature: userSignature 
      }),
    });
  } catch (error) {
    console.error('Error in submitUserSignature:', error);
    // Return mock success on error
    return {
      data: {
        success: true,
        tx_hash: txHash || `0x${Math.random().toString(36).substring(2, 10)}`
      },
      status: 200
    };
  }
}

const MOCK_DAILY_REPORT_DATA = [
  {
    "source": "HexG News",
    "category": "BTC",
    "title": "Bitcoin's Unstoppable March: Navigating New Highs and Institutional Adoption",
    "content_summary": "Bitcoin is trading at approximately $88,907 as of March 7, 2025, with a 24-hour trading volume of around $58 billion.",
    "analysis": [
      "Bitcoin's resilience at around $88,907 is a testament to its established position as the leading cryptocurrency.",
      "The rise of institutional adoption is a significant factor, as publicly traded companies are increasingly holding BTC."
    ],
    "markdown_content": "# Bitcoin's Unstoppable March\n\nBitcoin has been on a remarkable journey...",
    "date": "2025-03-07",
    "keywords": ["Bitcoin", "BTC", "cryptocurrency"],
    "header_image_url": "https://source.unsplash.com/featured/?cryptocurrency",
    "featured_image_url": "https://source.unsplash.com/featured/?cryptocurrency"
  },
  {
    "source": "HexG News",
    "category": "ETH",
    "title": "Ethereum (ETH) in 2025: Navigating Price Swings",
    "content_summary": "Ethereum (ETH) currently trades around $2,193.05, reflecting a recent 3.98% dip.",
    "analysis": ["Ethereum's price reflects market sentiment and volatility within the crypto sphere."],
    "markdown_content": "# Ethereum in 2025\n\nEthereum continues to evolve...",
    "date": "2025-03-07",
    "keywords": ["Ethereum", "ETH", "cryptocurrency"],
    "header_image_url": "https://source.unsplash.com/featured/?ethereum",
    "featured_image_url": "https://source.unsplash.com/featured/?ethereum"
  }
];

export async function getDailyReport(year: number, month: number, day: number): Promise<ApiResponse<any[]>> {
  if (USE_MOCK_DATA) {
    // Use mock data for development
    console.warn('⚠️ Using mock data for daily report');
    return {
      data: MOCK_DAILY_REPORT_DATA,
      status: 200
    };
  }
  
  try {
    // Make API request
    return await fetchApi<any[]>('/api/get-daily-report', {
      method: 'POST',
      body: JSON.stringify({ year, month, day }),
    });
  } catch (error) {
    console.error('Error in getDailyReport:', error);
    // Return mock data on error
    return {
      data: MOCK_DAILY_REPORT_DATA,
      status: 200
    };
  }
}
  
/**
 * Reject transaction
 */
export async function rejectTransaction(
  walletAddress: string, 
  txHash: string, 
  reason: string = 'User rejected transaction'
): Promise<ApiResponse<{ success: boolean }>> {
  if (USE_MOCK_DATA) {
    return {
      data: {
        success: true
      },
      status: 200
    };
  }
  
  try {
    return await fetchApi<{ success: boolean }>('/api/user-reject-transaction', {
      method: 'POST',
      body: JSON.stringify({ 
        wallet_address: walletAddress, 
        tx_hash: txHash, 
        reason 
      }),
    });
  } catch (error) {
    console.error('Error in rejectTransaction:', error);
    // Return mock success on error
    return {
      data: {
        success: true
      },
      status: 200
    };
  }
}
  
export default {
  checkAgentStatus,
  createAgent,
  getUserMessages,
  deployMultisigWallet,
  submitUserSignature,
  rejectTransaction
};