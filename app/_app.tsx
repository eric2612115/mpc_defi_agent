// app/_app.tsx
'use client';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { WagmiProvider } from 'wagmi';
import { SessionProvider } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { darkTheme, Locale,RainbowKitProvider } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import ThemeWrapper from './ThemeWrapper'; // Correct relative path

import { useRouter } from 'next/router';
import { wagmiConfig } from './wagmi/wagmi';

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  const { locale } = useRouter() as { locale: Locale };
  return (
    <WagmiProvider config={wagmiConfig} >
      <SessionProvider refetchInterval={0} session={pageProps.session}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider locale={locale} theme={darkTheme()}>
            <ThemeWrapper>
              <Component {...pageProps} />
            </ThemeWrapper>
          </RainbowKitProvider>
        </QueryClientProvider>
      </SessionProvider>
    </WagmiProvider>
  );
}

export default MyApp;