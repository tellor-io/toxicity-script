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
var cEtherAddress = "0xEbd7f3349AbA8bB15b897e03D6c1a4Ba95B55e31";

// token prices hardcoded for now
var price1 = 100
var price2 = 200
var price3 = 300

// converting cToken amount to underlying token amount:
// exchangeRate = (getCash() + totalBorrows() - totalReserves()) / totalSupply()
// underlyingTokenAmount = cTokenAmount * exchangeRate


async function main(_nodeURL) {

    // setup all tokens - will connect to already deployed tokens in production
    const Token = await ethers.getContractFactory("ERC20")
    const token1 = await Token.deploy("Test Token 1", "TEST1")
    await token1.deployed()
    const token2 = await Token.deploy("Test Token 2", "TEST2")
    await token2.deployed()
    const token3 = await Token.deploy("Test Token 3", "TEST3")
    await token3.deployed()
    const accounts = await ethers.getSigners()

    // mint tokens to accounts
    await token1.mint(accounts[0].address, web3.utils.toWei("10000"))
    await token2.mint(accounts[0].address, web3.utils.toWei("10000"))
    await token3.mint(accounts[0].address, web3.utils.toWei("10000"))

    // transfer tokens to accounts
    for(i = 0; i < accounts.length; i++) {
        await token1.transfer(accounts[i].address, web3.utils.toWei(i.toString()))
        await token2.transfer(accounts[i].address, web3.utils.toWei((100 + i).toString()))
        await token3.transfer(accounts[i].address, web3.utils.toWei((100 - i).toString()))
    }

    // add some duplicates
    for(i = 0; i < accounts.length/2; i++) {
        await token1.transfer(accounts[i].address, web3.utils.toWei(i.toString()))
        await token2.transfer(accounts[i].address, web3.utils.toWei((100 - i).toString()))
        await token3.transfer(accounts[i].address, web3.utils.toWei((100 + i).toString()))
    }

    // filter Transfer events
    let filterAllTransfers = token1.filters.Transfer(null)
    let events1 = await token1.queryFilter(filterAllTransfers, 0, "latest")
    let events2 = await token2.queryFilter(filterAllTransfers, 0, "latest")
    let events3 = await token3.queryFilter(filterAllTransfers, 0, "latest")

    // get addresses who have received tokens
    let tokenRecipientAddresses1 = []
    for(i = 0; i < events1.length; i++) {
        if(!tokenRecipientAddresses1.includes(events1[i].args.to)) {
            tokenRecipientAddresses1.push(events1[i].args.to)
        }
    }
    let tokenRecipientAddresses2 = []
    for(i = 0; i < events2.length; i++) {
        if(!tokenRecipientAddresses2.includes(events1[i].args.to)) {
            tokenRecipientAddresses2.push(events1[i].args.to)
        }
    }
    let tokenRecipientAddresses3 = []
    for(i = 0; i < events3.length; i++) {
        if(!tokenRecipientAddresses3.includes(events1[i].args.to)) {
            tokenRecipientAddresses3.push(events1[i].args.to)
        }
    }

    // query addresses current state, convert to dollars
    // usdDebt = debt * tokenPrice
    // usdCollateral = cTokenBalance * exchangeRate * tokenPrice
    let collateralSub1 = []
    let debtSub1 = []
    for(i = 0; i < tokenRecipientAddresses1.length; i++) {
        snapshot = await token1.getAccountSnapshot(tokenRecipientAddresses1[i])
        if(snapshot[1] > 0 || snapshot[2] > 0) {
            collateralUsd = web3.utils.fromWei(snapshot[1].toString()) * price1 // cTokenBalance * exchangeRate * tokenPrice
            debtUsd = web3.utils.fromWei(snapshot[2].toString()) * price1 // debt * tokenPrice
            // [address, collateralTokenBalance, debt]
            collateralSub1.push({address: tokenRecipientAddresses1[i], token1: collateralUsd})
            debtSub1.push({address: tokenRecipientAddresses1[i], token1: debtUsd})
        }
    }

    let collateralSub2 = []
    let debtSub2 = []
    for(i = 0; i < tokenRecipientAddresses2.length; i++) {
        snapshot = await token2.getAccountSnapshot(tokenRecipientAddresses2[i])
        if(snapshot[1] > 0 || snapshot[2] > 0) {
            collateralUsd = web3.utils.fromWei(snapshot[1].toString()) * price1 // cTokenBalance * exchangeRate * tokenPrice
            debtUsd = web3.utils.fromWei(snapshot[2].toString()) * price1 // debt * tokenPrice
            // [address, collateralTokenBalance, debt]
            collateralSub2.push({address: tokenRecipientAddresses2[i], token2: collateralUsd})
            debtSub2.push({address: tokenRecipientAddresses2[i], token2: debtUsd})
        }
    }

    let collateralSub3 = []
    let debtSub3 = [] 
    for(i = 0; i < tokenRecipientAddresses3.length; i++) {
        snapshot = await token3.getAccountSnapshot(tokenRecipientAddresses3[i])
        if(snapshot[1] > 0 || snapshot[2] > 0) {
            collateralUsd = web3.utils.fromWei(snapshot[1].toString()) * price1 // cTokenBalance * exchangeRate * tokenPrice
            debtUsd = web3.utils.fromWei(snapshot[2].toString()) * price1 // debt * tokenPrice
            // [address, collateralTokenBalance, debt]
            collateralSub3.push({address: tokenRecipientAddresses3[i], token3: collateralUsd})
            debtSub3.push({address: tokenRecipientAddresses3[i], token3: debtUsd})
        }
    }

    // merge into two arrays for debt and collateral
    let collateral = []
    collateral = mergeByAddress(collateralSub1, collateralSub2)
    collateral = mergeByAddress(collateral, collateralSub3)

    let debt = []
    debt = mergeByAddress(debtSub1, debtSub2)
    debt = mergeByAddress(debt, debtSub3)

    // get L, total $-value owed by each address
    for(i = 0; i < debt.length; i++) {
        debt[i].L = debt[i].token1 + debt[i].token2 + debt[i].token3
    }

    console.log("debt: ", debt)
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

function mergeByAddress(arr1, arr2) {
    const map = new Map();
    arr1.forEach(item => map.set(item.address, item));
    arr2.forEach(item => map.set(item.address, {...map.get(item.address), ...item}));
    return Array.from(map.values());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main(process.env.NODE_URL_POLYGON).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});