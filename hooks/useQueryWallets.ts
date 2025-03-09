import { useQuery } from '@tanstack/react-query';
import { WalletService } from '../lib/wallet/services/WalletService';
import type { ListWalletResponse } from '../lib/wallet/models/ListWalletResponse';

interface UseQueryWalletsParams {
  ownerAddress: string;
  chain?: string | number;
  enabled?: boolean;
}

/**
 * Hook to fetch multi-signature wallets for a specific owner address
 * 
 * This hook uses the wallet API to retrieve all multi-signature wallets
 * associated with the provided owner address. It returns the full React Query
 * result object including loading state, error state, and wallet data.
 */
export const useQueryWallets = ({ 
  ownerAddress, 
  chain, 
  enabled = true 
}: UseQueryWalletsParams) => {
  return useQuery<ListWalletResponse>({
    queryKey: ['wallets', ownerAddress, chain],
    queryFn: () => WalletService.walletControllerListWallets({ 
      ownerAddress, 
      chain 
    }),
    enabled: Boolean(ownerAddress) && enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};