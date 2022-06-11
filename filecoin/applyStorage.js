import process from 'process'
import Web3 from 'web3';
let provider = new Web3('http://localhost:6791');

const WALLET_KEY = 'd57bc284266f8bb2ee5ccc8cbe25c6c805e3c2608186ff40c3ce7ccfe9a503ae'
const WALLET = '0x39d87c0241C2084D3aAA2879Ae9766F3ED75679F'

import StoreAbi from "./build/contracts/Store.js"
const storeAddress = '0xeeA74Cc3565E96d4c420475E93Af603139b35e2a'

// Get store contract instance
const contract = new provider.eth.Contract(StoreAbi, storeAddress);
provider.eth.accounts.wallet.add(WALLET_KEY)

var inputData = process.argv.slice(2)
console.log('inputData', inputData[0])

var dataToSave = inputData[0]
async function main() {
    const trx = contract.methods.saveOrder(dataToSave)
    const gas = 2000000
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
    console.log('transaction', transaction);

    try {
        console.log('Transaction ready to be sent')
        const receipt = await provider.eth.sendTransaction(transaction)
        console.log('receipt', receipt)
    } catch (error) {
        console.log('error', error);
    }
}

(async () => {
    main()
})();