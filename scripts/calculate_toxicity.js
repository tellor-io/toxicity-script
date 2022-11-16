const { ethers } = require("hardhat");
const web3 = require('web3');
const { Contract, Provider } = require('ethers-multicall')
const createClient = require("urql").createClient;
const axios = require('axios');
require("isomorphic-unfetch");
require("dotenv").config();
var fs = require('fs');
var erc20jsonFile = "./artifacts/contracts/ERC20.sol/ERC20.json"
var erc20Parsed = JSON.parse(fs.readFileSync(erc20jsonFile));
var erc20Abi = erc20Parsed.abi

// NOTICE: change these variables
// choices: eth, dai, usdc, usdt, frax, wbtc, matic, link
const COLLATERAL_ASSET = 'matic'
const DEBT_ASSET = 'dai'

const abiCoder = new ethers.utils.AbiCoder()
const ONE_INCH_URL = "https://api.1inch.io/v4.0/137/quote?"
const API_URL = "https://api.thegraph.com/subgraphs/name/tkernell/hundred-finance-polygon"
const client = createClient({ url: API_URL });
const provider = new ethers.providers.JsonRpcProvider(process.env.NODE_URL_POLYGON)
const privateKey = process.env.TESTNET_PK
const wallet = new ethers.Wallet(privateKey, provider)

// hToken addresses
const hEthTokenAddress = "0x243E33aa7f6787154a8E59d3C27a66db3F8818ee";
const hDaiTokenAddress = "0xE4e43864ea18d5E5211352a4B810383460aB7fcC";
const hUsdcTokenAddress = "0x607312a5C671D0C511998171e634DE32156e69d0";
const hUsdtTokenAddress = "0x103f2CA2148B863942397dbc50a425cc4f4E9A27";
const hFraxTokenAddress = "0x2c7a9d9919f042C4C120199c69e126124d09BE7c";
const hWbtcTokenAddress = "0xb4300e088a3AE4e624EE5C71Bc1822F68BB5f2bc";
const hMaticTokenAddress = "0xEbd7f3349AbA8bB15b897e03D6c1a4Ba95B55e31";
const hLinkTokenAddress = "0x5B9451B1bFAE2A74D7b9D0D45BdD0E9a27F7bB22";

// underlying token addresss
const ethTokenAddress = "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619";
const daiTokenAddress = "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063";
const usdcTokenAddress = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
const usdtTokenAddress = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F";
const fraxTokenAddress = "0x45c32fA6DF82ead1e2EF74d17b76547EDdFaFF89";
const wbtcTokenAddress = "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6";
const maticTokenAddress = "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270"; // wrapped matic
const linkTokenAddress = "0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39";

let ethPrice = 0
let daiPrice = 0
let usdcPrice = 0
let usdtPrice = 0
let fraxPrice = 0
let wbtcPrice = 0
let maticPrice = 0
let linkPrice = 0

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

const ethLtv = 0.80
const daiLtv = 0.85
const usdcLtv = 0.85
const usdtLtv = 0.85
const fraxLtv = 0.85
const maticLtv = 0.75
const wbtcLtv = 0.80
const linkLtv = 0.75

const ethInc = 1.08 - 1
const daiInc = 1.08 - 1
const usdcInc = 1.08 - 1
const usdtInc = 1.08 - 1
const fraxInc = 1.08 - 1
const maticInc = 1.08 - 1
const wbtcInc = 1.08 - 1
const linkInc = 1.08 - 1

let ethExchangeRate = null
let daiExchangeRate = null
let usdcExchangeRate = null
let usdtExchangeRate = null
let fraxExchangeRate = null
let wbtcExchangeRate = null
let maticExchangeRate = null
let linkExchangeRate = null

let rShare = []
let LByAsset = null
let incLoanWeightedAvg = null
let ltvLoanWeightedAvg = null
let cTotal = []

async function main(_nodeURL) {
    // get prices
    await getPrices()

    // get all transfer events from the graph
    let txTransfers = await fetchTransfers()
    let txMints = await fetchMints()

    // separate the addresses into different arrays based on token
    parseTransfersAndMints(txTransfers, txMints)

    // get the balance of each address and hToken exchange rates
    await getSnapshots()

    // get toxicity
    await getToxicity()
}

async function getPrices() {
    const COINGECKO_API_PART1 = "https://api.coingecko.com/api/v3/simple/price?ids="
    const COINGECKO_API_PART2 = "&vs_currencies=usd&include_market_cap=false&include_24hr_vol=false&include_24hr_change=false&include_last_updated_at=false"

    result = await axios.get(COINGECKO_API_PART1 + "ethereum" + COINGECKO_API_PART2)
    ethPrice = result.data.ethereum.usd

    result = await axios.get(COINGECKO_API_PART1 + "dai" + COINGECKO_API_PART2)
    daiPrice = result.data.dai.usd

    result = await axios.get(COINGECKO_API_PART1 + "usd-coin" + COINGECKO_API_PART2)
    usdcPrice = result.data["usd-coin"].usd

    result = await axios.get(COINGECKO_API_PART1 + "tether" + COINGECKO_API_PART2)
    usdtPrice = result.data.tether.usd

    result = await axios.get(COINGECKO_API_PART1 + "frax" + COINGECKO_API_PART2)
    fraxPrice = result.data.frax.usd

    result = await axios.get(COINGECKO_API_PART1 + "bitcoin" + COINGECKO_API_PART2)
    wbtcPrice = result.data.bitcoin.usd

    result = await axios.get(COINGECKO_API_PART1 + "matic-network" + COINGECKO_API_PART2)
    maticPrice = result.data["matic-network"].usd

    result = await axios.get(COINGECKO_API_PART1 + "chainlink" + COINGECKO_API_PART2)
    linkPrice = result.data.chainlink.usd
}

async function fetchTransfers() {
    console.log("fetching transfers...")
    let responseTransfers = await client.query(queryTransfers('')).toPromise()
    let responseAllTransfers = []

    while(responseTransfers.data.transfers.length > 0) {
        responseAllTransfers = responseAllTransfers.concat(responseTransfers.data.transfers);
        lastID = responseTransfers.data.transfers[responseTransfers.data.transfers.length - 1].id
        responseTransfers = await client.query(queryTransfers(lastID)).toPromise()
    }

    return responseAllTransfers
}

async function fetchMints() {
    console.log("fetching mints...")
    let responseMints = await client.query(queryMints('')).toPromise()
    let responseAllMints = []

    while(responseMints.data.mints.length > 0) {
        responseAllMints = responseAllMints.concat(responseMints.data.mints);
        lastID = responseMints.data.mints[responseMints.data.mints.length - 1].id
        responseMints = await client.query(queryMints(lastID)).toPromise()
    }

    return responseAllMints
}

function parseTransfersAndMints(txTransfers, txMints) {
    for(let i=0; i<txTransfers.length; i++) {
        if(txTransfers[i].to != hEthTokenAddress && txTransfers[i].to != hDaiTokenAddress && txTransfers[i].to != hUsdcTokenAddress && txTransfers[i].to != hUsdtTokenAddress && txTransfers[i].to != hFraxTokenAddress && txTransfers[i].to != hWbtcTokenAddress && txTransfers[i].to != hMaticTokenAddress && txTransfers[i].to != hLinkTokenAddress) {
            ethUserAddresses.push(txTransfers[i].to)
            daiUserAddresses.push(txTransfers[i].to)
            usdcUserAddresses.push(txTransfers[i].to)
            usdtUserAddresses.push(txTransfers[i].to)
            fraxUserAddresses.push(txTransfers[i].to)
            wbtcUserAddresses.push(txTransfers[i].to)
            maticUserAddresses.push(txTransfers[i].to)
            linkUserAddresses.push(txTransfers[i].to)
        }
    }

    for(let i=0; i<txMints.length; i++) {
        if(txMints[i].contract == hEthTokenAddress) {
            if(txMints[i].minter != hEthTokenAddress) {
                ethUserAddresses.push(txMints[i].minter)
            }
        } else if(txMints[i].contract == hDaiTokenAddress) {
            if(txMints[i].minter != hDaiTokenAddress) {
                daiUserAddresses.push(txMints[i].minter)
            }
        } else if(txMints[i].contract == hUsdcTokenAddress) {
            if(txMints[i].minter != hUsdcTokenAddress) {
                usdcUserAddresses.push(txMints[i].minter)
            }
        } else if(txMints[i].contract == hUsdtTokenAddress) {
            if(txMints[i].minter != hUsdtTokenAddress) {
                usdtUserAddresses.push(txMints[i].minter)
            }
        } else if(txMints[i].contract == hFraxTokenAddress) {
            if(txMints[i].minter != hFraxTokenAddress) {
                fraxUserAddresses.push(txMints[i].minter)
            }
        } else if(txMints[i].contract == hWbtcTokenAddress) {
            if(txMints[i].minter != hWbtcTokenAddress) {
                wbtcUserAddresses.push(txMints[i].minter)
            }
        } else if(txMints[i].contract == hMaticTokenAddress) {
            if(txMints[i].minter != hMaticTokenAddress) {
                maticUserAddresses.push(txMints[i].minter)
            }
        } else if(txMints[i].contract == hLinkTokenAddress) {
            if(txMints[i].minter != hLinkTokenAddress) {
                linkUserAddresses.push(txMints[i].minter)
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
    console.log("querying contracts...")
    const callProvider = new Provider(provider)
    await callProvider.init()
    const ERC20 = ethers.getContractAt("ERC20", hEthTokenAddress)

    let ethContract = new Contract(hEthTokenAddress, erc20Abi)
    let daiContract = new Contract(hDaiTokenAddress, erc20Abi)
    let usdcContract = new Contract(hUsdcTokenAddress, erc20Abi)
    let usdtContract = new Contract(hUsdtTokenAddress, erc20Abi)
    let fraxContract = new Contract(hFraxTokenAddress, erc20Abi)
    let wbtcContract = new Contract(hWbtcTokenAddress, erc20Abi)
    let maticContract = new Contract(hMaticTokenAddress, erc20Abi)
    let linkContract = new Contract(hLinkTokenAddress, erc20Abi)

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


    ethContract = await ethers.getContractAt('ERC20', hEthTokenAddress, wallet)
    daiContract = await ethers.getContractAt('ERC20', hDaiTokenAddress, wallet)
    usdcContract = await ethers.getContractAt('ERC20', hUsdcTokenAddress, wallet)
    usdtContract = await ethers.getContractAt('ERC20', hUsdtTokenAddress, wallet)
    fraxContract = await ethers.getContractAt('ERC20', hFraxTokenAddress, wallet)
    wbtcContract = await ethers.getContractAt('ERC20', hWbtcTokenAddress, wallet)
    maticContract = await ethers.getContractAt('ERC20', hMaticTokenAddress, wallet)
    linkContract = await ethers.getContractAt('ERC20', hLinkTokenAddress, wallet)

    // get hToken -> underlying token exchange rates
    const cTokenDecimals = 8; // all cTokens have 8 decimal places
    const underlyingDecimals = 18;
    const mantissa = 18 + parseInt(underlyingDecimals) - cTokenDecimals;

    const ethExchangeRateCurrent = await ethContract.exchangeRateStored();
    ethExchangeRate = ethExchangeRateCurrent / Math.pow(10, mantissa);

    const daiExchangeRateCurrent = await daiContract.exchangeRateStored();
    daiExchangeRate = daiExchangeRateCurrent / Math.pow(10, mantissa);

    const usdcExchangeRateCurrent = await usdcContract.exchangeRateStored();
    usdcExchangeRate = usdcExchangeRateCurrent / Math.pow(10, mantissa);

    const usdtExchangeRateCurrent = await usdtContract.exchangeRateStored();
    usdtExchangeRate = usdtExchangeRateCurrent / Math.pow(10, mantissa);

    const fraxExchangeRateCurrent = await fraxContract.exchangeRateStored();
    fraxExchangeRate = fraxExchangeRateCurrent / Math.pow(10, mantissa);

    const wbtcExchangeRateCurrent = await wbtcContract.exchangeRateStored();
    wbtcExchangeRate = wbtcExchangeRateCurrent / Math.pow(10, mantissa);

    const maticExchangeRateCurrent = await maticContract.exchangeRateStored();
    maticExchangeRate = maticExchangeRateCurrent / Math.pow(10, mantissa);

    const linkExchangeRateCurrent = await linkContract.exchangeRateStored();
    linkExchangeRate = linkExchangeRateCurrent / Math.pow(10, mantissa);
}

async function getToxicity() {
    // eth
    for(i = 0; i < ethUserAddresses.length; i++) {
        if(ethSnapshot[i][1] > 0 || ethSnapshot[i][2] > 0) {
            // collateralUsd = web3.utils.fromWei((BigInt(ethSnapshot[i][1]) * ethExchangeRate).toString()) * ethPrice
            collateralUsd = web3.utils.fromWei(ethSnapshot[i][1].toString()) * ethExchangeRate * ethPrice
            debtUsd = web3.utils.fromWei(ethSnapshot[i][2].toString()) * ethPrice
            ethCollateral.push({address: ethUserAddresses[i], eth: collateralUsd})
            ethDebt.push({address: ethUserAddresses[i], eth: debtUsd})
        }
    }
    // dai
    for(i = 0; i < daiUserAddresses.length; i++) {
        if(daiSnapshot[i][1] > 0 || daiSnapshot[i][2] > 0) {
            // collateralUsd = web3.utils.fromWei((daiSnapshot[i][1] * daiExchangeRate).toString()) * daiPrice
            collateralUsd = web3.utils.fromWei(daiSnapshot[i][1].toString()) * daiExchangeRate * daiPrice
            debtUsd = web3.utils.fromWei(daiSnapshot[i][2].toString()) * daiPrice
            daiCollateral.push({address: daiUserAddresses[i], dai: collateralUsd})
            daiDebt.push({address: daiUserAddresses[i], dai: debtUsd})
        }
    }
    // usdc
    for(i = 0; i < usdcUserAddresses.length; i++) {
        if(usdcSnapshot[i][1] > 0 || usdcSnapshot[i][2] > 0) {
            // collateralUsd = web3.utils.fromWei((usdcSnapshot[i][1] * usdcExchangeRate).toString()) * usdcPrice
            collateralUsd = web3.utils.fromWei(usdcSnapshot[i][1].toString()) * usdcExchangeRate * usdcPrice
            debtUsd = web3.utils.fromWei(usdcSnapshot[i][2].toString()) * usdcPrice
            usdcCollateral.push({address: usdcUserAddresses[i], usdc: collateralUsd})
            usdcDebt.push({address: usdcUserAddresses[i], usdc: debtUsd})
        }
    }
    // usdt
    for(i = 0; i < usdtUserAddresses.length; i++) {
        if(usdtSnapshot[i][1] > 0 || usdtSnapshot[i][2] > 0) {
            // collateralUsd = web3.utils.fromWei((usdtSnapshot[i][1] * usdtExchangeRate).toString()) * usdtPrice
            collateralUsd = web3.utils.fromWei(usdtSnapshot[i][1].toString()) * usdtExchangeRate * usdtPrice
            debtUsd = web3.utils.fromWei(usdtSnapshot[i][2].toString()) * usdtPrice
            usdtCollateral.push({address: usdtUserAddresses[i], usdt: collateralUsd})
            usdtDebt.push({address: usdtUserAddresses[i], usdt: debtUsd})
        }
    }
    // frax
    for(i = 0; i < fraxUserAddresses.length; i++) {
        if(fraxSnapshot[i][1] > 0 || fraxSnapshot[i][2] > 0) {
            // collateralUsd = web3.utils.fromWei((fraxSnapshot[i][1] * fraxExchangeRate).toString()) * fraxPrice
            collateralUsd = web3.utils.fromWei(fraxSnapshot[i][1].toString()) * fraxExchangeRate * fraxPrice
            debtUsd = web3.utils.fromWei(fraxSnapshot[i][2].toString()) * fraxPrice
            fraxCollateral.push({address: fraxUserAddresses[i], frax: collateralUsd})
            fraxDebt.push({address: fraxUserAddresses[i], frax: debtUsd})
        }
    }
    // wbtc
    for(i = 0; i < wbtcUserAddresses.length; i++) {
        if(wbtcSnapshot[i][1] > 0 || wbtcSnapshot[i][2] > 0) {
            // collateralUsd = web3.utils.fromWei((wbtcSnapshot[i][1] * wbtcExchangeRate).toString()) * wbtcPrice
            collateralUsd = web3.utils.fromWei(wbtcSnapshot[i][1].toString()) * wbtcExchangeRate * wbtcPrice
            debtUsd = web3.utils.fromWei(wbtcSnapshot[i][2].toString()) * wbtcPrice
            wbtcCollateral.push({address: wbtcUserAddresses[i], wbtc: collateralUsd})
            wbtcDebt.push({address: wbtcUserAddresses[i], wbtc: debtUsd})
        }
    }
    // matic
    for(i = 0; i < maticUserAddresses.length; i++) {
        if(maticSnapshot[i][1] > 0 || maticSnapshot[i][2] > 0) {
            // collateralUsd = web3.utils.fromWei((maticSnapshot[i][1] * maticExchangeRate).toString()) * maticPrice
            collateralUsd = web3.utils.fromWei(maticSnapshot[i][1].toString()) * maticExchangeRate * maticPrice
            debtUsd = web3.utils.fromWei(maticSnapshot[i][2].toString()) * maticPrice
            maticCollateral.push({address: maticUserAddresses[i], matic: collateralUsd})
            maticDebt.push({address: maticUserAddresses[i], matic: debtUsd})
        }
    }
    // link
    for(i = 0; i < linkUserAddresses.length; i++) {
        if(linkSnapshot[i][1] > 0 || linkSnapshot[i][2] > 0) {
            // collateralUsd = web3.utils.fromWei((linkSnapshot[i][1] * linkExchangeRate).toString()) * linkPrice
            collateralUsd = web3.utils.fromWei(linkSnapshot[i][1].toString()) * linkExchangeRate * linkPrice
            debtUsd = web3.utils.fromWei(linkSnapshot[i][2].toString()) * linkPrice
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


    // convert all NaN to 0
    for(i = 0; i < collateral.length; i++) {
        if(isNaN(collateral[i].eth)) {
            collateral[i].eth = 0
        }
        if(isNaN(collateral[i].dai)) {
            collateral[i].dai = 0
        }
        if(isNaN(collateral[i].usdc)) {
            collateral[i].usdc = 0
        }
        if(isNaN(collateral[i].usdt)) {
            collateral[i].usdt = 0
        }
        if(isNaN(collateral[i].frax)) {
            collateral[i].frax = 0
        }
        if(isNaN(collateral[i].wbtc)) {
            collateral[i].wbtc = 0
        }
        if(isNaN(collateral[i].matic)) {
            collateral[i].matic = 0
        }
        if(isNaN(collateral[i].link)) {
            collateral[i].link = 0
        }

        if(isNaN(debt[i].eth)) {
            debt[i].eth = 0
        }
        if(isNaN(debt[i].dai)) {
            debt[i].dai = 0
        }
        if(isNaN(debt[i].usdc)) {
            debt[i].usdc = 0
        }
        if(isNaN(debt[i].usdt)) {
            debt[i].usdt = 0
        }
        if(isNaN(debt[i].frax)) {
            debt[i].frax = 0
        }
        if(isNaN(debt[i].wbtc)) {
            debt[i].wbtc = 0
        }
        if(isNaN(debt[i].matic)) {
            debt[i].matic = 0
        }
        if(isNaN(debt[i].link)) {
            debt[i].link = 0
        }
    }


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
    incLoanWeightedAvg.eth = ethInc //* LByAsset.eth / LByAsset.eth
    incLoanWeightedAvg.dai = daiInc //* LByAsset.dai / LByAsset.dai
    incLoanWeightedAvg.usdc = usdcInc //* LByAsset.usdc / LByAsset.usdc
    incLoanWeightedAvg.usdt = usdtInc //* LByAsset.usdt / LByAsset.usdt
    incLoanWeightedAvg.frax = fraxInc //* LByAsset.frax / LByAsset.frax
    incLoanWeightedAvg.wbtc = wbtcInc //* LByAsset.wbtc / LByAsset.wbtc
    incLoanWeightedAvg.matic = maticInc //* LByAsset.matic / LByAsset.matic
    incLoanWeightedAvg.link = linkInc //* LByAsset.link / LByAsset.link

    // get LTV loan weighted average
    ltvLoanWeightedAvg = {eth: 0, dai: 0, usdc: 0, usdt: 0, frax: 0, wbtc: 0, matic: 0, link: 0}
    ltvLoanWeightedAvg.eth = ethLtv //* LByAsset.eth / LByAsset.eth
    ltvLoanWeightedAvg.dai = daiLtv //* LByAsset.dai / LByAsset.dai
    ltvLoanWeightedAvg.usdc = usdcLtv //* LByAsset.usdc / LByAsset.usdc
    ltvLoanWeightedAvg.usdt = usdtLtv //* LByAsset.usdt / LByAsset.usdt
    ltvLoanWeightedAvg.frax = fraxLtv //* LByAsset.frax / LByAsset.frax
    ltvLoanWeightedAvg.wbtc = wbtcLtv //* LByAsset.wbtc / LByAsset.wbtc
    ltvLoanWeightedAvg.matic = maticLtv //* LByAsset.matic / LByAsset.matic
    ltvLoanWeightedAvg.link = linkLtv //* LByAsset.link / LByAsset.link

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

    if(COLLATERAL_ASSET == 'eth') {
        collateralPrice = ethPrice
        collateralTokenAddress = ethTokenAddress
        cTotalCollateral = "ethCollateral"
    } else if(COLLATERAL_ASSET == 'dai') {
        collateralPrice = daiPrice
        collateralTokenAddress = daiTokenAddress
        cTotalCollateral = "daiCollateral"
    } else if(COLLATERAL_ASSET == 'usdc') {
        collateralPrice = usdcPrice
        collateralTokenAddress = usdcTokenAddress
        cTotalCollateral = "usdcCollateral"
    } else if(COLLATERAL_ASSET == 'usdt') {
        collateralPrice = usdtPrice
        collateralTokenAddress = usdtTokenAddress
        cTotalCollateral = "usdtCollateral"
    } else if(COLLATERAL_ASSET == 'frax') {
        collateralPrice = fraxPrice
        collateralTokenAddress = fraxTokenAddress
        cTotalCollateral = "fraxCollateral"
    } else if(COLLATERAL_ASSET == 'wbtc') {
        collateralPrice = wbtcPrice
        collateralTokenAddress = wbtcTokenAddress
        cTotalCollateral = "wbtcCollateral"
    } else if(COLLATERAL_ASSET == 'matic') {
        collateralPrice = maticPrice
        collateralTokenAddress = maticTokenAddress
        cTotalCollateral = "maticCollateral"
    } else if(COLLATERAL_ASSET == 'link') {
        collateralPrice = linkPrice
        collateralTokenAddress = linkTokenAddress
        cTotalCollateral = "linkCollateral"
    }

    if(DEBT_ASSET == 'eth') {
        debtPrice = ethPrice
        debtTokenAddress = ethTokenAddress
    } else if(DEBT_ASSET == 'dai') {
        debtPrice = daiPrice
        debtTokenAddress = daiTokenAddress
    } else if(DEBT_ASSET == 'usdc') {
        debtPrice = usdcPrice
        debtTokenAddress = usdcTokenAddress
    } else if(DEBT_ASSET == 'usdt') {
        debtPrice = usdtPrice
        debtTokenAddress = usdtTokenAddress
    } else if(DEBT_ASSET == 'frax') {
        debtPrice = fraxPrice
        debtTokenAddress = fraxTokenAddress
    } else if(DEBT_ASSET == 'wbtc') {
        debtPrice = wbtcPrice
        debtTokenAddress = wbtcTokenAddress
    } else if(DEBT_ASSET == 'matic') {
        debtPrice = maticPrice
        debtTokenAddress = maticTokenAddress
    } else if(DEBT_ASSET == 'link') {
        debtPrice = linkPrice
        debtTokenAddress = linkTokenAddress
    }

    // get liquidity       
    console.log("getting liquidity...") 
    amountIn = 1
    amountOut = null
    let colIn1 = null
    let colIn2 = (incLoanWeightedAvg[COLLATERAL_ASSET] + ltvLoanWeightedAvg[COLLATERAL_ASSET]) * amountIn * collateralPrice
    let sOut = colIn2 + 1
    while(sOut > colIn2) {
        colIn1 = colIn2
        colIn2 = (incLoanWeightedAvg[COLLATERAL_ASSET] + ltvLoanWeightedAvg[COLLATERAL_ASSET]) * amountIn * collateralPrice
        result = await axios.get(ONE_INCH_URL + "fromTokenAddress=" + collateralTokenAddress + "&toTokenAddress=" + debtTokenAddress + "&amount=" + web3.utils.toWei(amountIn.toString()))
        amountOut = web3.utils.fromWei(result.data.toTokenAmount.toString())
        sOut = amountOut * debtPrice
        amountIn = amountIn * 2
    }
    amountIn = amountIn / 4
    increment = amountIn / 10
    amountIn = amountIn + increment
    colIn2 = colIn1
    while(sOut > colIn2) {
        colIn1 = colIn2
        colIn2 = (incLoanWeightedAvg[COLLATERAL_ASSET] + ltvLoanWeightedAvg[COLLATERAL_ASSET]) * amountIn * collateralPrice
        result = await axios.get(ONE_INCH_URL + "fromTokenAddress=" + collateralTokenAddress + "&toTokenAddress=" + debtTokenAddress + "&amount=" + web3.utils.toWei(amountIn.toString()))
        amountOut = web3.utils.fromWei(result.data.toTokenAmount.toString())
        sOut = amountOut * debtPrice
        amountIn = amountIn + increment
    }
    let toxicity = cTotal[cTotalCollateral][DEBT_ASSET] / ((colIn1 + colIn2) / 2)
    console.log("toxicity0: " + toxicity)
    console.log("Collateral: " + COLLATERAL_ASSET)
    console.log("Debt: " + DEBT_ASSET)
    console.log("toxicity1: ", cTotal[cTotalCollateral][DEBT_ASSET] / ((colIn1 + colIn2) / 2))

    // get queryId, queryData
    queryDataArgs = abiCoder.encode(["string", "string"], [COLLATERAL_ASSET, DEBT_ASSET])
    queryData = abiCoder.encode(["string", "bytes"], ["LendingPairToxicity", queryDataArgs])
    // keccak256 hash of queryData
    queryId = web3.utils.keccak256(queryData)
    console.log("queryId: " + queryId)
    console.log("queryData: " + queryData)
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

function queryTransfers(lastID) {
    let _query = `
    query {
        transfers(first: 1000, where:{ id_gt: "` + lastID + `"}) {
            id
            contract
            to
        } 	
    }
    `
    return _query
}

function queryMints(lastID) {
    let _query = `
    query {
        mints(first: 1000, where:{ id_gt: "` + lastID + `"}) {
            id
            contract
            minter
        }
    }
    `
    return _query
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});