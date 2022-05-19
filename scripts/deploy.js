const fs = require('fs');
const { ethers } = require('hardhat');
async function main() {
  const [deployer, user1] = await ethers.getSigners();
  // We get the contract factory to deploy
  const DtweetFactory = await ethers.getContractFactory("Dtweet");
  // Deploy contract
  const dtweet = await DtweetFactory.deploy();
  // Save contract address file in project
  const contractsDir = __dirname + "/../src/contractsData";
  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + `/dtweet-address.json`,
    JSON.stringify({ address: dtweet.address }, undefined, 2)
  );

  const contractArtifact = artifacts.readArtifactSync("Dtweet");

  fs.writeFileSync(
    contractsDir + `/dtweet.json`,
    JSON.stringify(contractArtifact, null, 2)
  );
  console.log("Dtweet deployed to:", dtweet.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
