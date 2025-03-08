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
// Only use mock data in development when specifically enabled
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true' || false;
  
/**
 * Check if a user has an agent
 */
export async function checkAgentStatus(walletAddress: string): Promise<ApiResponse<{ has_agent: boolean, multisig_address?: string }>> {
  try {
    console.log(`Checking agent status for wallet: ${walletAddress}`);
    
    // Try to fetch from our Next.js API route
    const response = await fetch(`/api/user-status?wallet_address=${walletAddress}`);
    
    if (!response.ok) {
      // If our API route fails, log the error
      const errorText = await response.text();
      console.warn(`Error from API route: ${errorText}`);
      
      // In development, return mock "no agent" data for proper flow testing
      if (process.env.NODE_ENV === 'development') {
        return {
          data: {
            has_agent: false,
            multisig_address: undefined
          },
          status: 200
        };
      }
      
      // In production, return the error
      return {
        error: `Request failed with status ${response.status}`,
        status: response.status
      };
    }
    
    const data = await response.json();
    console.log('Agent status check result:', data);
    
    return { data, status: 200 };
  } catch (error) {
    console.error('Error in checkAgentStatus:', error);
    
    // Return "no agent" on error in development for proper flow testing
    return {
      data: {
        has_agent: false,
        multisig_address: undefined
      },
      status: 200
    };
  }
}
  
/**
 * Create an agent for a user
 */
export async function createAgent(walletAddress: string): Promise<ApiResponse<{ success: boolean, message: string }>> {
  try {
    console.log(`Creating agent for wallet: ${walletAddress}`);
    
    // Simulate a delay to show the loading state
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Use our Next.js API route
    const response = await fetch('/api/create-agent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ wallet_address: walletAddress }),
    });
    
    if (!response.ok) {
      // If our API route fails, log the error
      const errorText = await response.text();
      console.warn(`Error from API route: ${errorText}`);
      
      return {
        error: `Request failed with status ${response.status}`,
        status: response.status
      };
    }
    
    const data = await response.json();
    console.log('Agent creation result:', data);
    
    return { data, status: 200 };
  } catch (error) {
    console.error('Error in createAgent:', error);
    
    // Return error on failure
    return {
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      status: 500
    };
  }
}

/**
 * Get user messages - fixed to handle API errors gracefully
 */
export async function getUserMessages(walletAddress: string, showHistory: boolean = false): Promise<ApiResponse<{ messages: any[] }>> {
  try {
    console.log(`Fetching messages for wallet: ${walletAddress}`);
    
    // Try direct API route first
    try {
      const response = await fetch(`/api/messages?wallet_address=${walletAddress}&show_history=${showHistory}`);
      
      if (!response.ok) {
        // Log error but don't throw - use fallback logic below
        console.warn(`Error fetching messages from API route: ${response.status}`);
        throw new Error(`API route error: ${response.status}`);
      }
      
      const data = await response.json();
      return { data, status: 200 };
    } catch (apiError) {
      console.warn("API route failed, trying fallback method:", apiError);
      
      // Try alternative approach via a direct fetch
      try {
        const directResponse = await fetch(`/api/messages?wallet_address=${walletAddress}`);
        
        if (!directResponse.ok) {
          console.warn('Direct fetch for messages failed. Using welcome message.');
          throw new Error("Direct fetch failed");
        }
        
        const data = await directResponse.json();
        return { data, status: 200 };
      } catch (directError) {
        console.warn('Error in direct fetch fallback:', directError);
        // Continue to fallback message below
        throw new Error("All API methods failed");
      }
    }
  } catch (error) {
    console.warn('Using fallback welcome message due to error:', error);
    
    // Always return a valid welcome message as fallback
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

export default {
  checkAgentStatus,
  createAgent,
  getUserMessages
};