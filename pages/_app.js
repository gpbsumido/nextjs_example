import React from 'react';
import '../styles/globals.css';
import { WagmiConfig, createClient } from 'wagmi'
import { getDefaultProvider } from 'ethers'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Analytics } from '@vercel/analytics/react';

 
const client = createClient({
  autoConnect: true,
  provider: getDefaultProvider(),
})

export default function App({ Component, pageProps }) {
  return (
    <WagmiConfig client={client}>
      <ToastContainer />
      <Component {...pageProps} />
      <Analytics />
    </WagmiConfig>
  );
}