import { ethers } from "ethers";

// 使用 Ankr 的公共节点
const provider = new ethers.JsonRpcProvider("https://rpc.ankr.com/eth");

const main = async () => {
  const balance = await provider.getBalance(`vitalik.eth`);
  console.log(`ETH balance of Vitalik: ${ethers.formatEther(balance)} ETH`);
};

main();
