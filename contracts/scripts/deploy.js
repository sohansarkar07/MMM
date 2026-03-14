const hre = require("hardhat");

async function main() {
    console.log("Deploying AccessLog contract to Avalanche Fuji...");

    const AccessLog = await hre.ethers.getContractFactory("AccessLog");
    const accessLog = await AccessLog.deploy();

    await accessLog.waitForDeployment();

    const address = await accessLog.getAddress();
    console.log(`AccessLog deployed to: ${address}`);
    console.log("Keep this address for your .env file!");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
