// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { ethers } = require("hardhat");
require("dotenv").config();
const web3 = require('web3');
const { Contract, Provider } = require('ethers-multicall')
const createClient = require("urql").createClient;
require("isomorphic-unfetch");
var fs = require('fs');
var erc20jsonFile = "./artifacts/contracts/ERC20.sol/ERC20.json"
var erc20Parsed = JSON.parse(fs.readFileSync(erc20jsonFile));
var erc20Abi = erc20Parsed.abi

const API_URL = "https://api.thegraph.com/subgraphs/name/tkernell/hundred-finance-polygon"
const query = `
    query {
        transfers(first: 1000) {
            id
            contract
            to
        } 	
    }
`
const client = createClient({ url: API_URL });
const provider = new ethers.providers.JsonRpcProvider(process.env.NODE_URL_POLYGON)

// hToken addresses
const ethTokenAddress = "0x243E33aa7f6787154a8E59d3C27a66db3F8818ee";
const daiTokenAddress = "0xE4e43864ea18d5E5211352a4B810383460aB7fcC";
const usdcTokenAddress = "0x607312a5C671D0C511998171e634DE32156e69d0";
const usdtTokenAddress = "0x103f2CA2148B863942397dbc50a425cc4f4E9A27";
const fraxTokenAddress = "0x2c7a9d9919f042C4C120199c69e126124d09BE7c";
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

let ethSnapshot = null
let daiSnapshot = null
let usdcSnapshot = null
let usdtSnapshot = null
let fraxSnapshot = null
let wbtcSnapshot = null
let maticSnapshot = null
let linkSnapshot = null

let collateral = []
let ethCollateral = []
let daiCollateral = []
let usdcCollateral = []
let usdtCollateral = []
let fraxCollateral = []
let wbtcCollateral = []
let maticCollateral = []
let linkCollateral = []

let debt = []
let ethDebt = []
let daiDebt = []
let usdcDebt = []
let usdtDebt = []
let fraxDebt = []
let wbtcDebt = []
let maticDebt = []
let linkDebt = []

let ethPrice = 1500
let daiPrice = 1
let usdcPrice = 1
let usdtPrice = 1
let fraxPrice = 20
let wbtcPrice = 20000
let maticPrice = 0.97
let linkPrice = 2.50

const ethLtv = 0.80
const daiLtv = 0.85
const usdcLtv = 0.85
const usdtLtv = 0.85
const fraxLtv = 0.85
const maticLtv = 0.75
const wbtcLtv = 0.80
const linkLtv = 0.75

const ethInc = 1.08
const daiInc = 1.08
const usdcInc = 1.08
const usdtInc = 1.08
const fraxInc = 1.08
const maticInc = 1.08
const wbtcInc = 1.08
const linkInc = 1.08

let rShare = []
let LByAsset = null
let incLoanWeightedAvg = null
let ltvLoanWeightedAvg = null
let cTotal = []

async function main(_nodeURL) {

    const accounts = await ethers.getSigners()

    let privateKey = process.env.TESTNET_PK
    // let provider = new ethers.providers.JsonRpcProvider(_nodeURL)
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

    // get the balance of each address
    await getSnapshots()


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
                console.log("link " + i + ": " + tx[i].to)
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

async function getSnapshots() {
    const callProvider = new Provider(provider)
    await callProvider.init()
    const ERC20 = ethers.getContractAt("ERC20", ethTokenAddress)

    const ethContract = new Contract(ethTokenAddress, erc20Abi)
    const daiContract = new Contract(daiTokenAddress, erc20Abi)
    const usdcContract = new Contract(usdcTokenAddress, erc20Abi)
    const usdtContract = new Contract(usdtTokenAddress, erc20Abi)
    const fraxContract = new Contract(fraxTokenAddress, erc20Abi)
    const wbtcContract = new Contract(wbtcTokenAddress, erc20Abi)
    const maticContract = new Contract(maticTokenAddress, erc20Abi)
    const linkContract = new Contract(linkTokenAddress, erc20Abi)

    const ethContractCalls = ethUserAddresses.map(ethUserAddresses => ethContract.getAccountSnapshot(ethUserAddresses))
    const daiContractCalls = daiUserAddresses.map(daiUserAddresses => daiContract.getAccountSnapshot(daiUserAddresses))
    const usdcContractCalls = usdcUserAddresses.map(usdcUserAddresses => usdcContract.getAccountSnapshot(usdcUserAddresses))
    const usdtContractCalls = usdtUserAddresses.map(usdtUserAddresses => usdtContract.getAccountSnapshot(usdtUserAddresses))
    const fraxContractCalls = fraxUserAddresses.map(fraxUserAddresses => fraxContract.getAccountSnapshot(fraxUserAddresses))
    const wbtcContractCalls = wbtcUserAddresses.map(wbtcUserAddresses => wbtcContract.getAccountSnapshot(wbtcUserAddresses))
    const maticContractCalls = maticUserAddresses.map(maticUserAddresses => maticContract.getAccountSnapshot(maticUserAddresses))
    const linkContractCalls = linkUserAddresses.map(linkUserAddresses => linkContract.getAccountSnapshot(linkUserAddresses))

    ethSnapshot = await callProvider.all(ethContractCalls)
    daiSnapshot = await callProvider.all(daiContractCalls)
    usdcSnapshot = await callProvider.all(usdcContractCalls)
    usdtSnapshot = await callProvider.all(usdtContractCalls)
    fraxSnapshot = await callProvider.all(fraxContractCalls)
    wbtcSnapshot = await callProvider.all(wbtcContractCalls)
    maticSnapshot = await callProvider.all(maticContractCalls)
    linkSnapshot = await callProvider.all(linkContractCalls)
}

function getCollateralAndDebt() {
    // eth
    for(i = 0; i < ethUserAddresses.length; i++) {
        if(ethSnapshot[i][1] > 0 || ethSnapshot[i][2] > 0) {
            collateralUsd = ethSnapshot[i][1] * ethPrice
            debtUsd = ethSnapshot[i][2] * ethPrice
            ethCollateral.push({address: ethUserAddresses[i], eth: collateralUsd})
            ethDebt.push({address: ethUserAddresses[i], eth: debtUsd})
        }
    }
    // dai
    for(i = 0; i < daiUserAddresses.length; i++) {
        if(daiSnapshot[i][1] > 0 || daiSnapshot[i][2] > 0) {
            collateralUsd = daiSnapshot[i][1] * daiPrice
            debtUsd = daiSnapshot[i][2] * daiPrice
            daiCollateral.push({address: daiUserAddresses[i], dai: collateralUsd})
            daiDebt.push({address: daiUserAddresses[i], dai: debtUsd})
        }
    }
    // usdc
    for(i = 0; i < usdcUserAddresses.length; i++) {
        if(usdcSnapshot[i][1] > 0 || usdcSnapshot[i][2] > 0) {
            collateralUsd = usdcSnapshot[i][1] * usdcPrice
            debtUsd = usdcSnapshot[i][2] * usdcPrice
            usdcCollateral.push({address: usdcUserAddresses[i], usdc: collateralUsd})
            usdcDebt.push({address: usdcUserAddresses[i], usdc: debtUsd})
        }
    }
    // usdt
    for(i = 0; i < usdtUserAddresses.length; i++) {
        if(usdtSnapshot[i][1] > 0 || usdtSnapshot[i][2] > 0) {
            collateralUsd = usdtSnapshot[i][1] * usdtPrice
            debtUsd = usdtSnapshot[i][2] * usdtPrice
            usdtCollateral.push({address: usdtUserAddresses[i], usdt: collateralUsd})
            usdtDebt.push({address: usdtUserAddresses[i], usdt: debtUsd})
        }
    }
    // frax
    for(i = 0; i < fraxUserAddresses.length; i++) {
        if(fraxSnapshot[i][1] > 0 || fraxSnapshot[i][2] > 0) {
            collateralUsd = fraxSnapshot[i][1] * fraxPrice
            debtUsd = fraxSnapshot[i][2] * fraxPrice
            fraxCollateral.push({address: fraxUserAddresses[i], frax: collateralUsd})
            fraxDebt.push({address: fraxUserAddresses[i], frax: debtUsd})
        }
    }
    // wbtc
    for(i = 0; i < wbtcUserAddresses.length; i++) {
        if(wbtcSnapshot[i][1] > 0 || wbtcSnapshot[i][2] > 0) {
            collateralUsd = wbtcSnapshot[i][1] * wbtcPrice
            debtUsd = wbtcSnapshot[i][2] * wbtcPrice
            wbtcCollateral.push({address: wbtcUserAddresses[i], wbtc: collateralUsd})
            wbtcDebt.push({address: wbtcUserAddresses[i], wbtc: debtUsd})
        }
    }
    // matic
    for(i = 0; i < maticUserAddresses.length; i++) {
        if(maticSnapshot[i][1] > 0 || maticSnapshot[i][2] > 0) {
            collateralUsd = maticSnapshot[i][1] * maticPrice
            debtUsd = maticSnapshot[i][2] * maticPrice
            maticCollateral.push({address: maticUserAddresses[i], matic: collateralUsd})
            maticDebt.push({address: maticUserAddresses[i], matic: debtUsd})
        }
    }
    // link
    for(i = 0; i < linkUserAddresses.length; i++) {
        if(linkSnapshot[i][1] > 0 || linkSnapshot[i][2] > 0) {
            collateralUsd = linkSnapshot[i][1] * linkPrice
            debtUsd = linkSnapshot[i][2] * linkPrice
            linkCollateral.push({address: linkUserAddresses[i], link: collateralUsd})
            linkDebt.push({address: linkUserAddresses[i], link: debtUsd})
        }
    }

    collateral = mergeByAddress(ethCollateral, daiCollateral)
    collateral = mergeByAddress(collateral, usdcCollateral)
    collateral = mergeByAddress(collateral, usdtCollateral)
    collateral = mergeByAddress(collateral, fraxCollateral)
    collateral = mergeByAddress(collateral, wbtcCollateral)
    collateral = mergeByAddress(collateral, maticCollateral)
    collateral = mergeByAddress(collateral, linkCollateral)
    debt = mergeByAddress(ethDebt, daiDebt)
    debt = mergeByAddress(debt, usdcDebt)
    debt = mergeByAddress(debt, usdtDebt)
    debt = mergeByAddress(debt, fraxDebt)
    debt = mergeByAddress(debt, wbtcDebt)
    debt = mergeByAddress(debt, maticDebt)
    debt = mergeByAddress(debt, linkDebt)

    // get L^qP -- total $-value of assets owed by user q on platform P
    for(i = 0; i < debt.length; i++) {
        debt[i].L = debt[i].eth + debt[i].dai + debt[i].usdc + debt[i].usdt + debt[i].frax + debt[i].wbtc + debt[i].matic + debt[i].link
    }

    // get r_i^qP -- share of loans collateralized by asset i owned by user q on platform P
    for(i = 0; i < collateral.length; i++) {
        let denominator = ethLtv * collateral[i].eth + daiLtv * collateral[i].dai + usdcLtv * collateral[i].usdc + usdtLtv * collateral[i].usdt + fraxLtv * collateral[i].frax + wbtcLtv * collateral[i].wbtc + maticLtv * collateral[i].matic + linkLtv * collateral[i].link
        rEth = collateral[i].eth * ethLtv / denominator
        rDai = collateral[i].dai * daiLtv / denominator
        rUsdc = collateral[i].usdc * usdcLtv / denominator
        rUsdt = collateral[i].usdt * usdtLtv / denominator
        rFrax = collateral[i].frax * fraxLtv / denominator
        rWbtc = collateral[i].wbtc * wbtcLtv / denominator
        rMatic = collateral[i].matic * maticLtv / denominator
        rLink = collateral[i].link * linkLtv / denominator

        rShare.push({address: collateral[i].address, eth: rEth, dai: rDai, usdc: rUsdc, usdt: rUsdt, frax: rFrax, wbtc: rWbtc, matic: rMatic, link: rLink})
    }

    LByAsset = {eth: 0, dai: 0, usdc: 0, usdt: 0, frax: 0, wbtc: 0, matic: 0, link: 0}
    for(i = 0; i<collateral.length; i++) {
        LByAsset.eth += rShare[i].eth * debt[i].eth
        LByAsset.dai += rShare[i].dai * debt[i].dai
        LByAsset.usdc += rShare[i].usdc * debt[i].usdc
        LByAsset.usdt += rShare[i].usdt * debt[i].usdt
        LByAsset.frax += rShare[i].frax * debt[i].frax
        LByAsset.wbtc += rShare[i].wbtc * debt[i].wbtc
        LByAsset.matic += rShare[i].matic * debt[i].matic
        LByAsset.link += rShare[i].link * debt[i].link
    }

    // get inc loan weighted average
    incLoanWeightedAvg = {eth: 0, dai: 0, usdc: 0, usdt: 0, frax: 0, wbtc: 0, matic: 0, link: 0}
    incLoanWeightedAvg.eth = ethInc * LByAsset.eth / LbyAsset.eth
    incLoanWeightedAvg.dai = daiInc * LByAsset.dai / LbyAsset.dai
    incLoanWeightedAvg.usdc = usdcInc * LByAsset.usdc / LbyAsset.usdc
    incLoanWeightedAvg.usdt = usdtInc * LByAsset.usdt / LbyAsset.usdt
    incLoanWeightedAvg.frax = fraxInc * LByAsset.frax / LbyAsset.frax
    incLoanWeightedAvg.wbtc = wbtcInc * LByAsset.wbtc / LbyAsset.wbtc
    incLoanWeightedAvg.matic = maticInc * LByAsset.matic / LbyAsset.matic
    incLoanWeightedAvg.link = linkInc * LByAsset.link / LbyAsset.link

    // get LTV loan weighted average
    ltvLoanWeightedAvg = {eth: 0, dai: 0, usdc: 0, usdt: 0, frax: 0, wbtc: 0, matic: 0, link: 0}
    ltvLoanWeightedAvg.eth = ethLtv * LByAsset.eth / LbyAsset.eth
    ltvLoanWeightedAvg.dai = daiLtv * LByAsset.dai / LbyAsset.dai
    ltvLoanWeightedAvg.usdc = usdcLtv * LByAsset.usdc / LbyAsset.usdc
    ltvLoanWeightedAvg.usdt = usdtLtv * LByAsset.usdt / LbyAsset.usdt
    ltvLoanWeightedAvg.frax = fraxLtv * LByAsset.frax / LbyAsset.frax
    ltvLoanWeightedAvg.wbtc = wbtcLtv * LByAsset.wbtc / LbyAsset.wbtc
    ltvLoanWeightedAvg.matic = maticLtv * LByAsset.matic / LbyAsset.matic
    ltvLoanWeightedAvg.link = linkLtv * LByAsset.link / LbyAsset.link

    // get c_(i,j) total $-value of asset i collateralizing asset j loans 
    cTotal.ethCollateral = ({eth: 0, dai: 0, usdc: 0, usdt: 0, frax: 0, wbtc: 0, matic: 0, link: 0})
    cTotal.daiCollateral = ({eth: 0, dai: 0, usdc: 0, usdt: 0, frax: 0, wbtc: 0, matic: 0, link: 0})
    cTotal.usdcCollateral = ({eth: 0, dai: 0, usdc: 0, usdt: 0, frax: 0, wbtc: 0, matic: 0, link: 0})
    cTotal.usdtCollateral = ({eth: 0, dai: 0, usdc: 0, usdt: 0, frax: 0, wbtc: 0, matic: 0, link: 0})
    cTotal.fraxCollateral = ({eth: 0, dai: 0, usdc: 0, usdt: 0, frax: 0, wbtc: 0, matic: 0, link: 0})
    cTotal.wbtcCollateral = ({eth: 0, dai: 0, usdc: 0, usdt: 0, frax: 0, wbtc: 0, matic: 0, link: 0})
    cTotal.maticCollateral = ({eth: 0, dai: 0, usdc: 0, usdt: 0, frax: 0, wbtc: 0, matic: 0, link: 0})
    cTotal.linkCollateral = ({eth: 0, dai: 0, usdc: 0, usdt: 0, frax: 0, wbtc: 0, matic: 0, link: 0})
    colStrings = ['ethCollateral', 'daiCollateral', 'usdcCollateral', 'usdtCollateral', 'fraxCollateral', 'wbtcCollateral', 'maticCollateral', 'linkCollateral']
    debtStrings = ['eth', 'dai', 'usdc', 'usdt', 'frax', 'wbtc', 'matic', 'link']
    for(i = 0; i < debt.length; i++) {
        for(j = 0; j < 8; j++) {
            for(k = 0; k < 8; k++) {
                cTotal[colStrings[j]][debtStrings[k]] += rShare[i][debtStrings[k]] * debt[i][debtStrings[k]]
            }
        }
    }
        







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