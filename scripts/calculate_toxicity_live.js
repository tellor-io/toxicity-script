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
        transfers(first: 500) {
            id
            contract
            to
        } 	
    }
`
const client = createClient({ url: API_URL });

// hToken addresses
const ethTokenAddress = "0x243E33aa7f6787154a8E59d3C27a66db3F8818ee";
const daiTokenAddress = "0xE4e43864ea18d5E5211352a4B810383460aB7fcC";
const usdcTokenAddress = "0x607312a5C671D0C511998171e634DE32156e69d0";
const usdtTokenAddress = "0x103f2CA2148B863942397dbc50a425cc4f4E9A27";
const fraxTokenAddress = "0x103f2CA2148B863942397dbc50a425cc4f4E9A27";
const wbtcTokenAddress = "0xb4300e088a3AE4e624EE5C71Bc1822F68BB5f2bc";
const maticTokenAddress = "0xEbd7f3349AbA8bB15b897e03D6c1a4Ba95B55e31";
const linkTokenAddress = "0x5B9451B1bFAE2A74D7b9D0D45BdD0E9a27F7bB22";
let ethUserAddresses = []
let daiUserAddresses = []
let usdcUserAddresses = []
let usdtUserAddresses = []
let fraxUserAddresses = []
let wbtcUserAddresses = []
let maticUserAddresses = []
let linkUserAddresses = []

async function main(_nodeURL) {

    const accounts = await ethers.getSigners()

    let privateKey = process.env.TESTNET_PK
    let provider = new ethers.providers.JsonRpcProvider(_nodeURL)
    let wallet = new ethers.Wallet(privateKey, provider)
    let hEther = await ethers.getContractAt("ERC20", ethTokenAddress, wallet)
    let hDai = await ethers.getContractAt("ERC20", daiTokenAddress, wallet)
    // cEther = await cEther.connect(wallet)

    // let filterAllTransfers = cEther.filters.Transfer(null)
    // let events = await cEther.queryFilter(filterAllTransfers, 0, "latest")

    // let addressesWithBalance = []
    // for(i = 0; i < events.length; i++) {
    //     addressesWithBalance.push(events[i].args.to)
    // }
    // addressesWithBalance = uniq(addressesWithBalance)
    // console.log("addressesWithBalance:", addressesWithBalance)

    // get all transfer events from the graph
    tx = await fetchData()

    // separate the addresses into different arrays based on token
    parseTransfers(tx)




}

async function fetchData() {
    const response = await client.query(query).toPromise()
    // console.log("response:", response)
    // console.log("length: " + response.data.transfers.length)
    return response.data.transfers
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

function parseTransfers(tx) {

    for(let i=0; i<tx.length; i++) {
        if(tx[i].contract == ethTokenAddress) {
            if(tx[i].to != ethTokenAddress) {
                ethUserAddresses.push(tx[i].to)
            }
        } else if(tx[i].contract == daiTokenAddress) {
            if(tx[i].to != daiTokenAddress) {
                daiUserAddresses.push(tx[i].to)
            }
        } else if(tx[i].contract == usdcTokenAddress) {
            if(tx[i].to != usdcTokenAddress) {
                usdcUserAddresses.push(tx[i].to)
            }
        } else if(tx[i].contract == usdtTokenAddress) {
            if(tx[i].to != usdtTokenAddress) {
                usdtUserAddresses.push(tx[i].to)
            }
        } else if(tx[i].contract == fraxTokenAddress) {
            if(tx[i].to != fraxTokenAddress) {
                fraxUserAddresses.push(tx[i].to)
            }
        } else if(tx[i].contract == wbtcTokenAddress) {
            if(tx[i].to != wbtcTokenAddress) {
                wbtcUserAddresses.push(tx[i].to)
            }
        } else if(tx[i].contract == maticTokenAddress) {
            if(tx[i].to != maticTokenAddress) {
                maticUserAddresses.push(tx[i].to)
            }
        } else if(tx[i].contract == linkTokenAddress) {
            if(tx[i].to != linkTokenAddress) {
                linkUserAddresses.push(tx[i].to)
            }
        } 
    }
    ethUserAddresses = uniq(ethUserAddresses)
    daiUserAddresses = uniq(daiUserAddresses)
    usdcUserAddresses = uniq(usdcUserAddresses)
    usdtUserAddresses = uniq(usdtUserAddresses)
    fraxUserAddresses = uniq(fraxUserAddresses)
    wbtcUserAddresses = uniq(wbtcUserAddresses)
    maticUserAddresses = uniq(maticUserAddresses)
    linkUserAddresses = uniq(linkUserAddresses)
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