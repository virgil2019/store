import Arweave from "arweave";

const arweave = Arweave.init({
  host: "testnet.redstone.tools",
  // host: "arweave.net",
  port: 443,
  protocol: "https",
  timeout: 20000, // Network request timeout in milliseconds
  logging: false, // Disable network request logging
});

 

export default arweave;
