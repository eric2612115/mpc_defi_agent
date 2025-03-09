// app/providers.tsx
'use client';
import {
  argentWallet,
  ledgerWallet,
  trustWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { createConfig, http, WagmiProvider } from 'wagmi';
import { arbitrum, arbitrumSepolia, base, mainnet, optimism, polygon, sepolia, sonic } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { connectorsForWallets, darkTheme, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { wagmiConfig } from './wagmi/wagmi';
// Configure wallets
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
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider 
          appInfo={{
            appName: 'AI Trading Assistant',
            learnMoreUrl: '/about',
          }}
          theme={customRainbowTheme}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default Providers;