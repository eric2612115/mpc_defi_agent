// utils/explorerUtils.ts

// Map of blockchain explorers by chain ID
export const BLOCKCHAIN_EXPLORERS: Record<string, string> = {
  // Mainnets
  '1': 'https://etherscan.io/address/', // Ethereum
  '56': 'https://bscscan.com/address/', // BNB Smart Chain
  '137': 'https://polygonscan.com/address/', // Polygon
  '42161': 'https://arbiscan.io/address/', // Arbitrum
  '10': 'https://optimistic.etherscan.io/address/', // Optimism
  '8453': 'https://basescan.org/address/', // Base
  '43114': 'https://snowtrace.io/address/', // Avalanche
  '250': 'https://ftmscan.com/address/', // Fantom
  '42220': 'https://celoscan.io/address/', // Celo
  
  // Testnets
  '5': 'https://goerli.etherscan.io/address/', // Goerli
  '80001': 'https://mumbai.polygonscan.com/address/', // Mumbai
  '421613': 'https://goerli.arbiscan.io/address/', // Arbitrum Goerli
  '420': 'https://goerli-optimism.etherscan.io/address/', // Optimism Goerli
  '84531': 'https://goerli.basescan.org/address/', // Base Goerli
};

/**
 * Get explorer URL for a wallet address based on chain ID
 * @param walletAddress The wallet address to view
 * @param chainId The chain ID (defaults to Ethereum mainnet)
 * @returns The full explorer URL
 */
export const getExplorerUrl = (walletAddress: string, chainId?: number | string): string => {
  const chainIdStr = chainId?.toString() || '1';
  const baseUrl = BLOCKCHAIN_EXPLORERS[chainIdStr] || BLOCKCHAIN_EXPLORERS['1']; // Default to Ethereum
  return `${baseUrl}${walletAddress}`;
};

/**
 * Open blockchain explorer in a new window
 * @param walletAddress The wallet address to view
 * @param chainId The chain ID (defaults to Ethereum mainnet)
 */
export const openExplorer = (walletAddress: string, chainId?: number | string): void => {
  if (walletAddress) {
    window.open(getExplorerUrl(walletAddress, chainId), '_blank', 'noopener,noreferrer');
  }
}; 