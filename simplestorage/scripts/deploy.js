const { ethers, run, network } = require("hardhat");

async function main() {
	const SimpleStorageFactory = await ethers.getContractFactory(
		"SimpleStorage"
	);
	console.log("Deploying contract...");
	const simpleStorage = await SimpleStorageFactory.deploy();
	await simpleStorage.deployed();
	console.log(`Deployed to: ${simpleStorage.address}`);
	if (network.config.chainId === 11155111 && process.env.ETHERSCAN_API_KEY) {
		await simpleStorage.deployTransaction.wait(6);
		await verify(simpleStorage.address, []);
	}

	const currentValue = await simpleStorage.retrieve();
	console.log(`Current value: ${currentValue}`);

  // Update current value 
	const transactionResponse = await simpleStorage.store(7);
	await transactionResponse.wait(1);
	const updatedValue = await simpleStorage.retrieve();
	console.log(`Updated value: ${updatedValue}`);
}

async function verify(contractAddress, args) {
	console.log("Verifying contract...");
	try {
		await run("verify:verify", {
			address: contractAddress,
			constructorArguments: args,
		});
	} catch (e) {
		if (e.message.lowercase().includes("already verified"))
			console.log("Already verified");
		else console.log(e);
	}
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
