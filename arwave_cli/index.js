var Web3 = require('web3');
var provider = new Web3('https://api.avax-test.network/ext/bc/C/rpc');
var arweaveSave = require('./arweave')

const WALLET_KEY = 'd57bc284266f8bb2ee5ccc8cbe25c6c805e3c2608186ff40c3ce7ccfe9a503ae'
const WALLET = '0x39d87c0241C2084D3aAA2879Ae9766F3ED75679F'

const StoreAbi = require("./build/contracts/Store.json")
const storeAddress = '0xD0493460d2CA5D2753E441Aa627437c17caDc887'

// Get store contract instance
const contract = new provider.eth.Contract(StoreAbi, storeAddress);
provider.eth.accounts.wallet.add(WALLET_KEY)

let orderId = 0
let lastOrderId = 0

async function initOrderId() {
  orderId = await contract.methods.orderIds().call()
  lastOrderId = orderId
}

function wait(ms) {
  return new Promise(resolve => setTimeout(() => resolve(), ms));
};

async function loop() {
  // console.log("update", orderId)
  while (true) {
    orderId = await contract.methods.orderIds().call()
    console.log("orderId", orderId, "lastOrderId", lastOrderId)
    const order = await contract.methods.getOrder(orderId).call()
    if (orderId != lastOrderId) {
      console.log("==> save order", order)
      let arTx = await arweaveSave(order.data)
      console.log("==> arweave Tx", arTx)
      const trx = contract.methods.updateOrderArTx(orderId, arTx)
      const gas = await trx.estimateGas({ from: WALLET })
      const gasPrice = await provider.eth.getGasPrice()
      const data = trx.encodeABI()
      const nonce = await provider.eth.getTransactionCount(WALLET)
      // console.log("==> nonce", nonce)
      const transaction = {
        from: WALLET,
        to: storeAddress,
        data,
        gas,
        gasPrice,
        nonce,
      }

      try {
        console.log('Transaction ready to be sent')
        const receipt = await provider.eth.sendTransaction(transaction)
        console.log('receipt', receipt)
        lastOrderId = orderId
      } catch (error) {

      }
    }
    await wait(5000);
  }
}

(async () => {
  // await update()
  await initOrderId()
  loop()
})();

