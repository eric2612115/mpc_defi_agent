// app/providers.tsx
'use client';
import {
  argentWallet,
  trustWallet,
  ledgerWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { mainnet, sepolia, polygon, arbitrum, optimism, base } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, getDefaultWallets, darkTheme, connectorsForWallets } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
// Configure wallets
const { wallets } = getDefaultWallets({
  appName: 'AI Trading Assistant',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '44b9e059520fc796204a1c3d8e873da7',
});

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Other',
      wallets: [argentWallet, trustWallet, ledgerWallet],
    },
  ],
  {
    appName: 'My RainbowKit App',
    projectId: 'YOUR_PROJECT_ID',
  }
);

// Create wagmi config
const config = createConfig({
  chains: [
    mainnet,
    polygon,
    optimism,
    arbitrum,
    base,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [sepolia] : []),
  ],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [optimism.id]: http(),
    [arbitrum.id]: http(),
    [base.id]: http(),
    [sepolia.id]: http(), 
  },
  connectors: connectors,
});

const queryClient = new QueryClient();


export function Providers({ children }: { children: React.ReactNode }) {
// Get default wallets

  const customRainbowTheme = darkTheme({
    accentColor: '#CBA076', // Match our primary color
    accentColorForeground: '#1C160D', // Match our primary contrast text
    borderRadius: 'medium',
    fontStack: 'system',
    overlayBlur: 'small',
  });

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider 
          theme={customRainbowTheme}
          appInfo={{
            appName: 'AI Trading Assistant',
            learnMoreUrl: '/about',
          }}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default Providers;