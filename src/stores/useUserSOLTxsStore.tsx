import create, { State } from 'zustand'
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js'

interface UserTxsStore extends State {
  txs: Array<any>;
  getUserTxs: (publicKey: PublicKey, connection: Connection) => void
}

const useUserSOLTxsStore = create<UserTxsStore>((set, _get) => ({
  txs: [],
  getUserTxs: async (publicKey, connection) => {
    let txsDetails = [];
    try {
      const txs = await connection.getSignaturesForAddress(publicKey);
      let previousDayDate = new Date();
      previousDayDate.setDate(previousDayDate.getDate() - 1);
      const previousDayUnixTimeStamp = Math.floor(previousDayDate.getTime() / 1000);
        
      const last24txs = txs.filter(tx => tx.blockTime >= previousDayUnixTimeStamp);
      const signatureTxs = last24txs.map(tx => tx.signature);
      txsDetails = await connection.getParsedTransactions(signatureTxs);

      connection.onAccountChange(publicKey, () => {
        console.log('change!')
      }, 'confirmed')

    } catch (e) {
      console.log(`error getting balance: `, e);
    }
    set((s) => {
      s.txs = txsDetails;
      console.log(`txs updated, `, s.txs);
    })
  },
}));

export default useUserSOLTxsStore;