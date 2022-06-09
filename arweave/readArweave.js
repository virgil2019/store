import process from 'process'
import arweave from "./arweave.js";

async function run() {
  const args = process.argv.slice(2)
  const txid = args[0]
  console.log(txid)

  // Read data back
  const transactionData = await arweave.transactions.getData(txid);
  console.log(
    "transaction data",
    Buffer.from(transactionData, "base64").toString()
  );
}

run();