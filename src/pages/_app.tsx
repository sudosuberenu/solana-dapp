import { AppProps } from 'next/app';
import Head from 'next/head';
import { FC } from 'react';
import { ContextProvider } from '../contexts/ContextProvider';
import { Menu } from '../components/Menu';
import { ContentContainer } from '../components/ContentContainer';
import { Footer } from '../components/Footer';

require('@solana/wallet-adapter-react-ui/styles.css');
require('../styles/globals.css');

const App: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>Mean - Solana Dapp</title>
      </Head>

      <ContextProvider>
        <div className="flex flex-col h-screen">
          <Menu/>
          <ContentContainer>
            <Component {...pageProps} />
          </ContentContainer>
          <Footer/>
        </div>
      </ContextProvider>
    </>
  );
};

export default App;
