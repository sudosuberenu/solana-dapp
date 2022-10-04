import create, { State } from 'zustand'
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js'

interface UserTxsStore extends State {
  txs: Array<any>;
  buckets: Array<any>;
  getUserLast24HoursTxs: (publicKey: PublicKey, connection: Connection) => void;
  getUserBuckets: (publicKey: PublicKey, connection: Connection) => void;
}

const useUserSOLTxsStore = create<UserTxsStore>((set, _get) => ({
  txs: [],
  buckets: [],
  getUserLast24HoursTxs: async (publicKey, connection) => {
    let last24Txs = [];
    try {
      last24Txs = await fetchUserLast24HoursTxs(publicKey, connection);
    } catch (e) {
      console.log(`error getting balance: `, e);
    }
    set((s) => {
      s.txs = last24Txs;
      console.log(`txs updated, `, s.txs);
    })
  },
  getUserBuckets: async (publicKey, connection) => {
    let buckets = new Array(24).fill({}).map((_item, index) => (
      {
        hour: index,
        avg: 0,
        txs: []
      }));

    try {
      const last24Txs = await fetchUserLast24HoursTxs(publicKey, connection);

      const groupByHour = (txs) => {
        return txs.reduce((groups, tx) => {
          const date = new Date(tx.blockTime * 1000);
          const hour = date.getHours();

          groups[hour]['txs'].push(tx);
          return groups
        }, buckets)
      };

      const groupedByHour = groupByHour(last24Txs);
      
      for (let [key, value] of Object.entries(groupedByHour)) {
        const bucket = value;

        if (bucket.txs.length) {
          const totalBalance = bucket.txs.reduce((prev, current) => {
            return prev + current.meta.postBalances[1] 
          }, 0);
          const avgBalance = ((totalBalance / LAMPORTS_PER_SOL) / bucket.txs.length);
          bucket.avg = avgBalance;
        }
      }

    } catch (e) {
      console.log(`error getting balance: `, e);
    }

    set((s) => {
      s.buckets = buckets;
    })
  },
  processBuckets: (txs) => {
    for (let i = 0; i < txs.length; i++) {
      const tx = txs[i];

      console.log(tx)
    }
  }
}));

async function fetchUserLast24HoursTxs(publicKey, connection): Promise<[]> {
  const txs = await connection.getSignaturesForAddress(publicKey);
  let previousDayDate = new Date();
  previousDayDate.setDate(previousDayDate.getDate() - 1);
  const previousDayUnixTimeStamp = Math.floor(previousDayDate.getTime() / 1000);
    
  const last24txs = txs.filter(tx => tx.blockTime >= previousDayUnixTimeStamp);
  const signatureTxs = last24txs.map(tx => tx.signature);
  let last24txsDetails = await connection.getParsedTransactions(signatureTxs);

  return last24txsDetails;
}

export default useUserSOLTxsStore;