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
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_DEVELOPMENT_MODE === 'true';
  
/**
   * Generic API fetcher with error handling
   */
async function fetchApi<T>(
  endpoint: string, 
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
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
    return {
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      status: 500
    };
  }
}
  
/**
   * Check if a user has an agent
   */
// /lib/apiClient.ts - 找到 checkAgentStatus 函數，整個替換為:
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
    
  return fetchApi<{ has_agent: boolean, multisig_address?: string }>(`/api/user-status?wallet_address=${walletAddress}`);
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
    
  return fetchApi<{ success: boolean, message: string }>('/api/create-agent', {
    method: 'POST',
    body: JSON.stringify({ wallet_address: walletAddress }),
  });
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
    
  return fetchApi<{ messages: any[] }>(`/api/messages?wallet_address=${walletAddress}&show_history=${showHistory}`);
}
  
/**
   * Deploy multisig wallet
   */
export async function deployMultisigWallet(walletAddress: string): Promise<ApiResponse<{ success: boolean, multisig_address: string }>> {
  return fetchApi<{ success: boolean, multisig_address: string }>('/api/deploy-multisig', {
    method: 'POST',
    body: JSON.stringify({ wallet_address: walletAddress }),
  });
}
  
/**
   * Submit user signature for transaction
   */
export async function submitUserSignature(
  walletAddress: string, 
  txHash: string, 
  userSignature: string
): Promise<ApiResponse<{ success: boolean, tx_hash: string }>> {
  return fetchApi<{ success: boolean, tx_hash: string }>('/api/user-signature', {
    method: 'POST',
    body: JSON.stringify({ 
      wallet_address: walletAddress, 
      tx_hash: txHash, 
      user_signature: userSignature 
    }),
  });
}
  
/**
   * Reject transaction
   */
export async function rejectTransaction(
  walletAddress: string, 
  txHash: string, 
  reason: string = 'User rejected transaction'
): Promise<ApiResponse<{ success: boolean }>> {
  return fetchApi<{ success: boolean }>('/api/user-reject-transaction', {
    method: 'POST',
    body: JSON.stringify({ 
      wallet_address: walletAddress, 
      tx_hash: txHash, 
      reason 
    }),
  });
}
  
export default {
  checkAgentStatus,
  createAgent,
  getUserMessages,
  deployMultisigWallet,
  submitUserSignature,
  rejectTransaction
};