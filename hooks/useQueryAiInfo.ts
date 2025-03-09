import { useQuery } from '@tanstack/react-query';
import { WalletService } from '../lib/wallet/services/WalletService';
import type { AiInfoResponse } from '../lib/wallet/models/AiInfoResponse';

interface UseQueryAiInfoParams {
  ownerAddress: string;
  enabled?: boolean;
}

/**
 * Hook to fetch AI wallet information for a given owner address
 * @param params Parameters for the query
 * @returns Query result with AI wallet information
 */
export function useQueryAiInfo({ 
  ownerAddress, 
  enabled = true 
}: UseQueryAiInfoParams) {
  return useQuery<AiInfoResponse, Error>({
    queryKey: ['aiInfo', ownerAddress],
    queryFn: async () => {
      if (!ownerAddress) {
        throw new Error('Owner address is required');
      }
      
      return await WalletService.walletControllerGetAi({
        ownerAddress
      });
    },
    enabled: enabled && Boolean(ownerAddress),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}