// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { ethers } = require("hardhat");
require("dotenv").config();
const web3 = require('web3');

// hToken addresses
var tellorAddress = "0xFd45Ae72E81Adaaf01cC61c8bCe016b7060DD537";


async function main(_nodeURL) {

    // setup all tokens


    

    await setupToken()
}

async function setupToken() {
    const Token = await ethers.getContractFactory("ERC20")
    const token = await Token.deploy("Test Token", "TEST")
    await token.deployed()
    const accounts = await ethers.getSigners()

    await token.mint(accounts[0].address, web3.utils.toWei("1000"))

    for(i = 0; i < accounts.length; i++) {
        await token.transfer(accounts[i].address, web3.utils.toWei(i.toString()))
    }
    // add some duplicates
    for(i = 0; i < accounts.length/2; i++) {
        await token.transfer(accounts[i].address, web3.utils.toWei(i.toString()))
    }

    let filterAllTransfers = token.filters.Transfer(null)
    let events = await token.queryFilter(filterAllTransfers, 0, "latest")

    let addressesWithBalance = []
    for(i = 0; i < events.length; i++) {
        addressesWithBalance.push(events[i].args.to)
    }
    addressesWithBalance = uniq(addressesWithBalance)
    console.log("addressesWithBalance:", addressesWithBalance)
    
    for(i = 0; i < addressesWithBalance.length; i++) {
        let balance = await token.getAccountSnapshot(addressesWithBalance[i])
        console.log("balance:", addressesWithBalance[i], balance[1])
    }
    // console.log("events:", events)
}

function uniq(a) {
    var prims = {"boolean":{}, "number":{}, "string":{}}, objs = [];

    return a.filter(function(item) {
        var type = typeof item;
        if(type in prims)
            return prims[type].hasOwnProperty(item) ? false : (prims[type][item] = true);
        else
            return objs.indexOf(item) >= 0 ? false : objs.push(item);
    });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main(process.env.NODE_URL_POLYGON).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});