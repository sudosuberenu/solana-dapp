import type { NextPage } from "next";
import Head from "next/head";
import { AvarageBalanceView } from "../views";

const AvarageBalance: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Mean - Solana Dapp</title>
        <meta
          name="description"
          content="Basic Functionality"
        />
      </Head>
      <AvarageBalanceView />
    </div>
  );
};

export default AvarageBalance;
