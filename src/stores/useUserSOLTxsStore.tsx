import create, { State } from 'zustand'
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js'

interface UserTxsStore extends State {
  txs: Array<any>;
  buckets: Map<Number, any>;
  getUserLast24HoursTxs: (publicKey: PublicKey, connection: Connection) => void;
  getUserBuckets: (publicKey: PublicKey, connection: Connection) => void;
}

const useUserSOLTxsStore = create<UserTxsStore>((set, _get) => ({
  txs: [],
  buckets: new Map(),
  getUserLast24HoursTxs: async (publicKey, connection) => {
    let last24Txs = [];
    try {
      last24Txs = await fetchUserLast24HoursTxs(publicKey, connection);
    } catch (e) {
      console.log(`error getting last txs: `, e);
    }
    set((s) => {
      s.txs = last24Txs;
    })
  },
  getUserBuckets: async (publicKey, connection) => {
    let buckets = new Map();
    try {
      const lastTxs = await fetchUserTxs(publicKey, connection);
      const last24Txs = await fetchUserLast24HoursTxs(publicKey, connection);

      const date = new Date();
      const hour = date.getHours();

      for (let i = hour; i >= 0; i--) {
        const today = new Date();
        today.setHours(i);

        let bucket = {
          hour: i,
          date: today,
          avg: 0,
          txs: []
        };

        buckets.set(i, bucket);
      }

      for (let i = 23; i > hour; i--) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(i)
        let bucket = {
          hour: i,
          date: yesterday,
          avg: 0,
          txs: []
        };

        buckets.set(i, bucket);
      }

    
      const groupByHour = (txs) => {
        return txs.reduce((groups, tx) => {
          const date = new Date(tx.blockTime * 1000);
          const hour = date.getHours();

          const bucket = groups.get(hour);
          bucket['txs'].push(tx);
          return groups
        }, buckets)
      };

      const groupedByHour = groupByHour(last24Txs);

      // Set up the AVGs
      for (let value of groupedByHour.values()) {
        const bucket = value;

        /* @ts-ignore */
        if (bucket.txs.length) {
          /* @ts-ignore */
          const totalBalance = bucket.txs.reduce((prev, current) => {
            if (current.transaction.message.instructions[0].parsed.info.destination === publicKey.toString()) {
              return prev + current.meta.postBalances[1] 
            }
            return prev + current.meta.postBalances[0] 
          }, 0);
          /* @ts-ignore */
          const avgBalance = ((totalBalance / LAMPORTS_PER_SOL) / bucket.txs.length);
          /* @ts-ignore */
          bucket.avg = avgBalance;
        }
      }


      // Filling up the empty buckets
      if (lastTxs.length === 0) {
        set((s) => {
          s.buckets = buckets;
        })
        return;
      }

      const lastTx = last24Txs[last24Txs.length - 1];
      /* @ts-ignore */
      const lastTxDate = new Date(lastTx.blockTime * 1000);

      
      /* @ts-ignore */
      for (let value of groupedByHour.values()) {
        const txs = value.txs;
        
        if (txs.length === 0) {
          
          /* @ts-ignore */
          if (lastTx.transaction.message.instructions[0].parsed.info.destination === publicKey.toString()) {
            /* @ts-ignore */
            value.avg = (value.date > lastTxDate ) ? lastTx.meta.postBalances[1] / LAMPORTS_PER_SOL: lastTx.meta.preBalances[1] / LAMPORTS_PER_SOL;
          } else {
            /* @ts-ignore */
            value.avg = (value.date > lastTxDate ) ? lastTx.meta.postBalances[0] / LAMPORTS_PER_SOL: lastTx.meta.preBalances[0] / LAMPORTS_PER_SOL;
          }
        }
      }

    } catch (e) {
      console.log(`error getting balance: `, e);
    }

    set((s) => {
      s.buckets = buckets;
    })
  },
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

async function fetchUserTxs(publicKey, connection): Promise<[]> {
  const txs = await connection.getSignaturesForAddress(publicKey);    
  const signatureTxs = txs.map(tx => tx.signature);
  const txsDetails = await connection.getParsedTransactions(signatureTxs);

  return txsDetails;
}

export default useUserSOLTxsStore;