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
import { RainbowKitProvider, getDefaultWallets, darkTheme } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';

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
});

// Initialize react-query client
const queryClient = new QueryClient();

// Get default wallets
const { wallets } = getDefaultWallets({
  appName: 'AI Trading Assistant',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '44b9e059520fc796204a1c3d8e873da7',
});

export function Providers({ children }: { children: React.ReactNode }) {
  // Create custom theme that matches our app
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
          wallets={[
            ...wallets,
            {
              groupName: 'Other',
              wallets: [argentWallet, trustWallet, ledgerWallet],
            },
          ]}
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