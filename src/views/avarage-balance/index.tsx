// Next, React
import { FC, useEffect, useState } from 'react';

// Wallet
import { useWallet, useConnection } from '@solana/wallet-adapter-react';

// Store
import useUserSOLTxsStore from '../../stores/useUserSOLTxsStore';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

export const AvarageBalanceView: FC = ({ }) => {
  const wallet = useWallet();
  const { connection } = useConnection();

  const buckets = useUserSOLTxsStore((s: any) => s.buckets)
  const { getUserBuckets } = useUserSOLTxsStore()

  useEffect(() => {
    if (wallet.publicKey) {
      getUserBuckets(wallet.publicKey, connection);
      
      connection.onAccountChange(
        wallet.publicKey,
        () => {
          getUserBuckets(wallet.publicKey, connection);
        },
        "confirmed"
      );
    }
  }, [wallet.publicKey, connection, getUserBuckets])

  return (
    <section className="flex flex-col items-center my-10">
      <h2 className="w-10/12 lg:w-2/3 text-center rounded-lg my-6 text-5xl p-4 bg-gradient-to-tr from-[#9945FF] to-[#14F195]">Avarage Balance in last 24 hours</h2>
      <div className="w-10/12 lg:w-2/3 bg-neutral rounded-lg text-center">
      {
        wallet.publicKey && buckets.length ?
          <table className="min-w-max w-full">
          <thead> 
            <tr className="bg-gray-700 text-gray-300 uppercase text-l leading-normal">
              <th className="py-3 px-6 text-center">Hour Bucket</th>
              <th className="py-3 px-6 text-center">AVG (SOL)</th>
              <th className="py-3 px-6 text-center">Num. Txs</th>
            </tr>
          </thead>
          <tbody className="text-gray-400"> 
            {
              buckets.map((bucket) => {
                return (
                  <tr key={bucket.hour} className="hover:bg-gray-700">
                    <td>{bucket.hour}:00</td>
                    <td>{bucket.avg}</td>
                    <td>{bucket.txs.length}</td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      :
        <p className="p-8 text-xl">Please, connect your wallet :) </p>
      }
      </div>
    </section>
  );
};
