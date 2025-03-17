import { ethers } from "ethers";
import dotenv from "dotenv";
// 配置dotenv，读取.env文件
// 执行代码需要在根目录下运行 node 02_Provider/Provider.js，否则环境变量读不到
dotenv.config();

// 使用同一个 API ID
const ALCHEMY_ID = process.env.ALCHEMY_ID;

const ALCHEMY_MAINNET_URL = `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_ID}`;
const ALCHEMY_SEPOLIA_URL = `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_ID}`;

// 连接以太坊主网
const providerETH = new ethers.JsonRpcProvider(ALCHEMY_MAINNET_URL);
// 连接Sepolia测试网
const providerSepolia = new ethers.JsonRpcProvider(ALCHEMY_SEPOLIA_URL);

const main = async () => {
  // 1. 查询vitalik在主网和Sepolia测试网的ETH余额
  console.log("1. 查询vitalik在主网和Sepolia测试网的ETH余额");
  const balance = await providerETH.getBalance(`vitalik.eth`);
  const balanceSepolia = await providerSepolia.getBalance(
    `0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045`
  );
  // 将余额输出在console（主网）
  console.log(`ETH Balance of vitalik: ${ethers.formatEther(balance)} ETH`);
  // 输出Sepolia测试网ETH余额
  console.log(
    `Sepolia ETH Balance of vitalik: ${ethers.formatEther(balanceSepolia)} ETH`
  );

  // 2. 查询provider连接到了哪条链
  console.log("\n2. 查询provider连接到了哪条链");
  const network = await providerETH.getNetwork();
  console.log(network.toJSON());

  // 3. 查询区块高度
  console.log("\n3. 查询区块高度");
  const blockNumber = await providerETH.getBlockNumber();
  console.log(blockNumber);

  // 4. 查询 vitalik 钱包历史交易次数
  console.log("\n4. 查询 vitalik 钱包历史交易次数");
  const txCount = await providerETH.getTransactionCount(`vitalik.eth`);
  console.log(txCount);

  // 5. 查询当前建议的gas设置
  console.log("\n5. 查询当前建议的gas设置");
  const feeData = await providerETH.getFeeData();
  console.log(feeData);

  // 6. 查询区块信息
  console.log("\n6. 查询区块信息");
  const block = await providerETH.getBlock(0);
  console.log(block);

  // 7. 给定合约地址查询合约的bytecode, 例子用的WETH地址
  console.log("\n7. 给定合约地址查询合约的bytecode, 例子用的WETH地址");
  const code = await providerETH.getCode(
    "0xc778417e063141139fce010982780140aa0cd5ab"
  );
  console.log(code);
};

main();
