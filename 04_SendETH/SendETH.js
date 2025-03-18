import { ethers } from "ethers";

// 利用Alchemy的rpc节点连接以太坊sepolia测试网络
const ALCHEMY_MAINNET_URL = `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_ID}`;
const provider = new ethers.JsonRpcProvider(ALCHEMY_MAINNET_URL);

// 创建随机的wallet对象
const wallet1 = ethers.Wallet.createRandom();
const wallet1WithProvider = wallet1.connect(provider);
const mnemonic = wallet1.mnemonic; //获取助记词

// 利用私钥和provider创建wallet对象，私钥从metamask导出，放在env里
const privateKey = process.env.WALLET_PRIVATE_KEY;
const wallet2 = new ethers.Wallet(privateKey, provider);

// 从wallet1的助记词创建wallet3
const wallet3 = ethers.Wallet.fromPhrase(mnemonic.phrase);

const main = async () => {
  // 1. 获取钱包地址
  const address1 = await wallet1.getAddress();
  const address2 = await wallet2.getAddress();
  const address3 = await wallet3.getAddress();
  console.log(`1. 获取钱包地址`);
  console.log(`钱包1地址: ${address1}`);
  console.log(`钱包2地址: ${address2}`);
  console.log(`钱包3地址: ${address3}`);
  console.log(`钱包1和钱包3的地址是否相同: ${address1 === address3}`);

  // 2. 获取助记词
  console.log(`\n2. 获取助记词`);
  console.log(`钱包1助记词: ${wallet1.mnemonic.phrase}`);

  // 3. 获取私钥前8位
  console.log(`\n3. 获取私钥前8位`);
  console.log(`钱包1私钥前8位: ${wallet1.privateKey.slice(0, 8)}`);
  console.log(`钱包2私钥前8位: ${wallet2.privateKey.slice(0, 8)}`);

  // 4. 获取链上交易次数
  console.log(`\n4.获取链上交易次数`);
  const txCount1 = await provider.getTransactionCount(wallet1WithProvider);
  const txCount2 = await provider.getTransactionCount(wallet2);
  console.log(`钱包1交易次数: ${txCount1}`);
  console.log(`钱包2交易次数: ${txCount2}`);

  // 5. 发送ETH
  console.log(`\n5. 发送ETH(测试网)`);
  // i. 打印交易前余额
  console.log(`i. 发送前余额`);
  console.log(
    `钱包1: ${ethers.formatEther(
      await provider.getBalance(wallet1WithProvider)
    )} ETH`
  );
  console.log(
    `钱包2: ${ethers.formatEther(await provider.getBalance(wallet2))} ETH`
  );
  // ii. 构造交易请求，参数：to为接收地址，value为ETH数额
  const tx = {
    to: address1,
    value: ethers.parseEther("0.001"),
  };
  // iii.  发送交易，获得收据
  console.log(`\niii. 等待交易在区块链确认(需要几分钟) `);
  const receipt = await wallet2.sendTransaction(tx);
  await receipt.wait(); // 等待链上确认交易
  console.log(receipt); // 打印交易详情
  // iv. 打印交易后余额
  console.log(`\niv. 发送后余额`);
  console.log(
    `钱包1: ${ethers.formatEther(
      await provider.getBalance(wallet1WithProvider)
    )} ETH`
  );
  console.log(
    `钱包2: ${ethers.formatEther(await provider.getBalance(wallet2))} ETH`
  );
};

main();
