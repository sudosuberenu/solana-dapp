// Next, React
import { FC, useEffect, useState } from 'react';

// Wallet
import { useWallet, useConnection } from '@solana/wallet-adapter-react';

// Store
import useUserSOLTxsStore from '../../stores/useUserSOLTxsStore';

export const AvarageBalanceView: FC = ({ }) => {
  const wallet = useWallet();
  const { connection } = useConnection();

  const txs = useUserSOLTxsStore((s: any) => s.txs)
  const { getUserTxs } = useUserSOLTxsStore()

  useEffect(() => {
    if (wallet.publicKey) {
      getUserTxs(wallet.publicKey, connection);
      
      connection.onAccountChange(
        wallet.publicKey,
        () => {
          getUserTxs(wallet.publicKey, connection);
        },
        "confirmed"
      );
    }
  }, [wallet.publicKey, connection, getUserTxs])

  return (
    <section className="flex flex-col items-center my-10">
      <h2 className="w-10/12 lg:w-2/3 text-center rounded-lg my-6 text-5xl p-4 bg-gradient-to-tr from-[#9945FF] to-[#14F195]">Avarage Balance in last 24 hours</h2>
    </section>
  );
};
