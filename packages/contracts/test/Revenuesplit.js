const { expect } = require("chai");
const { beforeEach } = require("mocha");

describe("Revenuesplit", function() {
    let creator,user1,user2,Revenue;
    beforeEach(async function() {
        [creator,user1,user2] = await ethers.getSignature();
         const revenue = ethers.connect(creator).getContracttFactory("Revenuesplit");
         Revenue = revenue.deploy();
    });
    describe("getRevenue", async function() {
        
    })
})