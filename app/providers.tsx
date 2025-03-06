// app/providers.tsx
'use client';
import {
  argentWallet,
  ledgerWallet,
  trustWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { createConfig, http, WagmiProvider } from 'wagmi';
import { arbitrum, base, mainnet, optimism, polygon, sepolia } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { connectorsForWallets, darkTheme, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
// Configure wallets

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