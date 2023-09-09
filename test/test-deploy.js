const { ethers } = require("hardhat");
const { assert, expect } = require("chai");
const {
	isCallTrace,
} = require("hardhat/internal/hardhat-network/stack-traces/message-trace");

describe("SimpleStorage", function () {
	let SimpleStorageFactory, simpleStorage;
	beforeEach(async function () {
		SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
		simpleStorage = await SimpleStorageFactory.deploy();
	});

	it("Should start with a favourite number of 0", async function () {
		const currentValue = await simpleStorage.retrieve();
		const expectedValue = "0";
		assert.equal(currentValue.toString(), expectedValue);
	});
	it("Should update when we call store", async () => {
		const expectedValue = "7";
		const transactionResponse = await simpleStorage.store(expectedValue);
		await transactionResponse.wait(1);

		const currentValue = await simpleStorage.retrieve();
		assert.equal(currentValue.toString(), expectedValue);
	});
	// it("Should return the right fav number", async () => {
	// 	const person = "Patrick";
	// 	const favNumber = "10";
	// 	await simpleStorage.addPerson(person, favNumber);

	// 	const fNumber = await simpleStorage.nameToFavoriteNumber.get(person);
	// 	assert.equal(favNumber, fNumber);
	// });
});
