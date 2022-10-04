import { FC, useEffect } from 'react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js'

import { useWallet, useConnection } from '@solana/wallet-adapter-react';

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
      <div className="bg-neutral rounded-lg text-center bg-neutral rounded-lg text-center">
      {
        wallet.publicKey && txs.length ?
          <table className="min-w-max w-full">
            <thead>
              <tr className="bg-gray-700 text-gray-300 uppercase text-l leading-normal">
                <th className="py-3 px-6 text-center">Timestamp</th>
                <th className="py-3 px-6 text-center">From</th>
                <th className="py-3 px-6 text-center">To</th>
                <th className="py-3 px-6 text-center">Change (SOL)</th>
                <th className="py-3 px-6 text-center">Explorer</th>
              </tr>
            </thead>
            <tbody className="text-gray-400 text-center">    
          { txs.length > 1 &&
            txs.map(tx => {
              return (
                <tr key={tx.blockTime} className="hover:bg-gray-700">
                  <td>{tx.blockTime}</td>
                  <td className="cursor-default">{tx.transaction.message.instructions[0].parsed.info.source}</td>
                  <td className="cursor-default">{tx.transaction.message.instructions[0].parsed.info.destination}</td>
                  <td className="cursor-default">{tx.transaction.message.instructions[0].parsed.info.lamports / LAMPORTS_PER_SOL}</td>
                  <td className="cursor-default text-center">
                    <a className="text-center" href={`https://explorer.solana.com/tx/` + tx.transaction.signatures[0] + `?cluster=devnet`} target="_blank">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 inline">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                      </svg>
                    </a>
                  </td>
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
