import { contractAddress, abi } from "./constants.js";
import { ethers } from "./ethers-5.6.esm.min.js";

const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton");
const balanceButton = document.getElementById("balanceButton");
const withdrawButton = document.getElementById("withdrawButton");

connectButton.onclick = connect;
fundButton.onclick = fund;
balanceButton.onclick = getBalance;
withdrawButton.onclick = withdraw;

async function connect() {
	if (typeof window.ethereum !== "undefined") {
		try {
			await ethereum.request({ method: "eth_requestAccounts" });
		} catch (error) {
			console.log(error);
		}
		connectButton.innerHTML = "Connected";
		const accounts = await ethereum.request({ method: "eth_accounts" });
		console.log(accounts);
	} else {
		connectButton.innerHTML = "Please install MetaMask";
	}
}

async function getBalance() {
	if (typeof window.ethereum !== "undefined") {
		const provider = new ethers.providers.Web3Provider(window.ethereum);
		const balance = await provider.getBalance(contractAddress);
		console.log(`Balance: ` + ethers.utils.formatEther(balance) + `ETH`);
	}
}

async function fund() {
	const ethAmount = document.getElementById("ethAmount").value;
	console.log(`Funding with ${ethAmount}ETH`);
	if (typeof window.ethereum !== "undefined") {
		const provider = new ethers.providers.Web3Provider(window.ethereum);
		const signer = provider.getSigner();
		const contract = new ethers.Contract(contractAddress, abi, signer);
		try {
			const transactionResponse = await contract.fund({
				value: ethers.utils.parseEther(ethAmount),
			});
			await listenForTxMine(transactionResponse, provider);
			console.log(`Done`);
		} catch (error) {
			console.log(error);
		}
	}
}

function listenForTxMine(transactionResponse, provider) {
	console.log(`Mining ${transactionResponse.hash}...`);
	// listen for tx to finish
	return new Promise((resolve, reject) => {
		provider.once(transactionResponse.hash, (transactionReceipt) => {
			console.log(
				`Completed with ${transactionReceipt.confirmations} confirmations`
			);
			resolve();
		});
	});
}

async function withdraw() {
	if (typeof window.ethereum !== "undefined") {
		console.log("Withdrawing...");
		const provider = new ethers.providers.Web3Provider(window.ethereum);
		const signer = provider.getSigner();
		const contract = new ethers.Contract(contractAddress, abi, signer);
		try {
			const transactionResponse = await contract.withdraw();
			await listenForTxMine(transactionResponse, provider);
		} catch (error) {
			console.log(error);
		}
	}
}
