import { arbitrum, base, mainnet, optimism, polygon, sepolia, sonic } from 'wagmi/chains';
import {
  argentWallet,
  ledgerWallet,
  trustWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { getDefaultConfig, getDefaultWallets } from '@rainbow-me/rainbowkit';

export const { wallets } = getDefaultWallets();

export const wagmiConfig = getDefaultConfig({
  appName: 'Gun.AI{Wallet}',
  projectId: '44b9e059520fc796204a1c3d8e873da7',
  wallets: [
    ...wallets,
    {
      groupName: 'Other',
      wallets: [argentWallet, trustWallet, ledgerWallet],
    },
  ],
  chains: [
    base,
    sonic,
    mainnet,
    polygon,
    optimism,
    arbitrum,
    sepolia,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [sepolia] : []),
  ],
  ssr: true,
});