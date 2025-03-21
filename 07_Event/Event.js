// 检索事件的方法：
// const transferEvents = await contract.queryFilter("事件名", [起始区块高度，结束区块高度])
// 其中起始区块高度和结束区块高度为选填参数。

import { ethers } from "ethers";

// 利用Alchemy的rpc节点连接以太坊sepolia测试网络
const ALCHEMY_MAINNET_URL = `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_ID}`;
const provider = new ethers.JsonRpcProvider(ALCHEMY_MAINNET_URL);

// WETH ABI，只包含我们关心的Transfer事件
const abiWETH = [
  "event Transfer(address indexed from, address indexed to, uint amount)",
];

// sepolia测试网WETH地址
const addressWETH = "0x7b79995e5f793a07bc00c21412e50ecae098e7f9";
// 声明合约实例
const contract = new ethers.Contract(addressWETH, abiWETH, provider);

const main = async () => {
  // 获取过去10个区块内的Transfer事件
  console.log("\n1. 获取过去10个区块内的Transfer事件，并打印出1个");
  // 获取当前block
  const block = await provider.getBlockNumber();
  console.log(`当前区块高度: ${block}`);
  console.log("打印事件详情:");
  const transferEvents = await contract.queryFilter(
    "Transfer",
    block - 10,
    block
  );
  // 打印第1个Transfer事件
  console.log(transferEvents[0]);

  // 解析Transfer事件的数据（变量在args中）
  const amount = ethers.formatUnits(
    ethers.getBigInt(transferEvents[0].args["amount"]),
    "ether"
  );
  console.log(
    `地址 ${transferEvents[0].args["from"]} 转账${amount} WETH 到地址 ${transferEvents[0].args["to"]}`
  );
};

main();
