const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Royal1155LDA Contract Tests", function () {
    let Royal1155LDA;
    let ldaContract;
    let owner;
    let addr1;
    let addr2;
    let addrs;

    const tierIdExample = 1;
    const ldaIdExample = ethers.toBigInt('1');
    const maxSupplyExample = 1000;

    before(async function () {
        Royal1155LDA = await ethers.getContractFactory("fanatixContract");
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    });

    beforeEach(async function () {
        ldaContract = await Royal1155LDA.deploy();
        await ldaContract.initialize("tokenURI");
    });

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            expect(await ldaContract.owner()).to.equal(owner.address);
        });
    });

    describe("Minting", function () {
        beforeEach(async function() {
            await ldaContract.createTier(tierIdExample, maxSupplyExample);
        })
        it("Should allow the owner to create a new tier", async function () {
            expect(await ldaContract.mintable(tierIdExample)).to.equal(true);
        });

        it("Should fail if a non-owner tries to create a new tier", async function () {
            await expect(ldaContract.connect(addr1).createTier(tierIdExample, maxSupplyExample))
                .to.be.revertedWith("Ownable: caller is not the owner");
        });
        it("mint nft",async function() {
            var val = await ldaContract.composeLDA_ID(1,1);
            var hello = await ldaContract.mintfantixToOwner(addr1.address,val,"hello");
            hello = await hello.wait();
            expect(await ldaContract.ownerOf(val)).to.equal(addr1.address);
            console.log(hello);
        });
    });

    describe("Token URI Management", function () {
        it("Should allow the owner to update the token URI", async function () {
            const newTokenUri = "newTokenURI"
            await ldaContract.updateTokenURI(newTokenUri);
            expect(await ldaContract.uri(ldaIdExample)).to.equal(newTokenUri);
        });
        
    });
});