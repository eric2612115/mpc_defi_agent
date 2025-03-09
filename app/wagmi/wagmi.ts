import { arbitrum, arbitrumSepolia, base, mainnet, optimism, polygon, sonic } from 'wagmi/chains';
import {
  argentWallet,
  ledgerWallet,
  trustWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { connectorsForWallets, getDefaultConfig, getDefaultWallets } from '@rainbow-me/rainbowkit';
import { http } from 'viem';
import { createConfig } from 'wagmi';

export const { wallets } = getDefaultWallets();

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Other',
      wallets: [argentWallet, trustWallet, ledgerWallet],
    },
  ],
  {
    appName: 'Gun.AI{Safe}',
    projectId: 'YOUR_PROJECT_ID',
  }
);

// Create wagmi config
export const wagmiConfig = createConfig({
  chains: [
    mainnet,
    polygon,
    optimism,
    arbitrum,
    sonic,
    base,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [arbitrumSepolia] : []),
  ],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [optimism.id]: http(),
    [arbitrum.id]: http(),
    [sonic.id]: http(),
    [base.id]: http(),
    [arbitrumSepolia.id]: http(), 
  },
  connectors: connectors,
});

// export const wagmiConfig = getDefaultConfig({
//   appName: 'Gun.AI{Wallet}',
//   projectId: '44b9e059520fc796204a1c3d8e873da7',
//   wallets: [
//     ...wallets,
//     {
//       groupName: 'Other',
//       wallets: [argentWallet, trustWallet, ledgerWallet],
//     },
//   ],
//   chains: [
//     // ...testnetChains,
//     // base,
//     // sonic,
//     // mainnet,
//     // polygon,
//     // optimism,
//     // arbitrum,
//   ] as any,
//   ssr: true,
// });