// Next, React
import { FC, useEffect, useState } from 'react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js'

// Wallet
import { useWallet, useConnection } from '@solana/wallet-adapter-react';

// Components
import { RequestAirdrop } from '../../components/RequestAirdrop';

// Store
import useUserSOLTxsStore from '../../stores/useUserSOLTxsStore';

export const HomeView: FC = ({ }) => {
  const wallet = useWallet();
  const { connection } = useConnection();

  const txs = useUserSOLTxsStore((s: any) => s.txs)
  const { getUserLast24HoursTxs } = useUserSOLTxsStore()

  useEffect(() => {
    if (wallet.publicKey) {
      getUserLast24HoursTxs(wallet.publicKey, connection);
      
      connection.onAccountChange(
        wallet.publicKey,
        () => {
          getUserLast24HoursTxs(wallet.publicKey, connection);
        },
        "confirmed"
      );
    }
  }, [wallet.publicKey, connection, getUserLast24HoursTxs])

  return (
    <section className="flex flex-col items-center my-10">
      <h2 className="w-10/12 lg:w-2/3 text-center rounded-lg my-6 text-5xl p-4 bg-gradient-to-tr from-[#9945FF] to-[#14F195]">All transactions in last 24 hours</h2>
      <ul className="w-10/12 lg:w-2/3 bg-neutral rounded-lg text-center p-4">
        { txs.length > 1 ?
          txs.map(tx => {
            return <li key={tx.slot}>{tx.blockTime} | {tx.transaction.message.instructions[0].parsed.info.source} | {tx.transaction.message.instructions[0].parsed.info.destination} | {tx.transaction.message.instructions[0].parsed.info.lamports / LAMPORTS_PER_SOL}</li>
          })
          :
          <p>Please, connect your wallet :) </p>
        }
      </ul>
      <RequestAirdrop />
    </section>
  );
};
