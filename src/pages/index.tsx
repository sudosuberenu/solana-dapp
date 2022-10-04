import type { NextPage } from "next";
import Head from "next/head";
import { HomeView } from "../views";

const Home: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Mean - Solana Dapp</title>
        <meta
          name="description"
          content="Solana Dapp - Transaction tracker"
        />
      </Head>
      <HomeView />
    </div>
  );
};

export default Home;
