import { ethers } from "ethers";

// 利用Alchemy的rpc节点连接以太坊sepolia测试网络
const ALCHEMY_MAINNET_URL = `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_ID}`;
const provider = new ethers.JsonRpcProvider(ALCHEMY_MAINNET_URL);

// 利用私钥和provider创建wallet对象，私钥从metamask导出，放在env里
const privateKey = process.env.WALLET_PRIVATE_KEY;
const wallet = new ethers.Wallet(privateKey, provider);

// WETH的ABI
const abiWETH = [
  "function balanceOf(address) public view returns(uint)",
  "function deposit() public payable",
  "function transfer(address, uint) public returns (bool)",
  "function withdraw(uint) public",
];

// WETH合约地址（Sepolia测试网）
const addressWETH = "0x7b79995e5f793a07bc00c21412e50ecae098e7f9";
// WETH Contract
// 声明可写合约
const contractWETH = new ethers.Contract(addressWETH, abiWETH, wallet);
// 也可以声明一个只读合约，再用connect(wallet)函数转换成可写合约。
// const contractWETH = new ethers.Contract(addressWETH, abiWETH, provider)
// contractWETH.connect(wallet)

const main = async () => {
  const address = await wallet.getAddress();
  // 1. 读取WETH合约的链上信息（WETH abi）
  console.log(`\n1. 读取WETH余额`);
  const balanceWETH = await contractWETH.balanceOf(address);
  console.log(`存款前WETH持仓: ${ethers.formatEther(balanceWETH)}\n`);
  // 读取钱包内ETH余额
  const balanceETH = await provider.getBalance(wallet);

  // 如果钱包内ETH足够
  if (ethers.formatEther(balanceETH) > 0.0015) {
    // 2. 调用deposit()函数，将0.001 ETH转为WETH
    console.log("\n2. 调用deposit()函数，存入0.001 ETH");
    const tx = await contractWETH.deposit({
      value: ethers.parseEther("0.001"),
    });
    // 等待交易上链
    await tx.wait();
    console.log(`交易详情：`);
    console.log(tx);
    const balanceWETH_deposit = await contractWETH.balanceOf(address);
    console.log(`存款后WETH持仓: ${ethers.formatEther(balanceWETH_deposit)}\n`);

    // 3.调用transfer()函数，将0.001 WETH转给 vitalik
    console.log("\n3. 调用transfer()函数，给vitalik转账0.001 WETH");
    const tx2 = await contractWETH.transfer(
      "vitalik.eth",
      ethers.parseEther("0.001")
    );
    // 等待交易上链
    await tx2.wait();
    console.log(`交易详情：`);
    console.log(tx2);
    const balanceWETH_transfer = await contractWETH.balanceOf(address);
    console.log(
      `转账后WETH持仓: ${ethers.formatEther(balanceWETH_transfer)}\n`
    );
    // 发起交易
  } else {
    console.log(`钱包内ETH不足，请充值`);
  }
};

main();
