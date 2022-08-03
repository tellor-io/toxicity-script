// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { ethers } = require("hardhat");
require("dotenv").config();
const web3 = require('web3');
const createClient = require("urql").createClient;
require("isomorphic-unfetch");

const API_URL = "https://api.thegraph.com/subgraphs/name/tkernell/hundred-finance-polygon"
const query = `
    query {
        transfers(first: 5) {
            id
            contract
            to
        } 	
    }
`

const client = createClient({ url: API_URL });

// hToken addresses
var tellorAddress = "0xFd45Ae72E81Adaaf01cC61c8bCe016b7060DD537";
var cEtherAddress = "0xEbd7f3349AbA8bB15b897e03D6c1a4Ba95B55e31";


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

    // let privateKey = process.env.TESTNET_PK
    // let provider = new ethers.providers.JsonRpcProvider(_nodeURL)
    // let wallet = new ethers.Wallet(privateKey, provider)
    // let cEther = await ethers.getContractAt("ERC20", cEtherAddress)
    // cEther = await cEther.connect(wallet)

    // let filterAllTransfers = cEther.filters.Transfer(null)
    // let events = await cEther.queryFilter(filterAllTransfers, 0, "latest")

    // let addressesWithBalance = []
    // for(i = 0; i < events.length; i++) {
    //     addressesWithBalance.push(events[i].args.to)
    // }
    // addressesWithBalance = uniq(addressesWithBalance)
    // console.log("addressesWithBalance:", addressesWithBalance)


    await fetchData()
    // await setupToken()
}

async function fetchData() {
    const response = await client.query(query).toPromise()
    console.log("response:", response)
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