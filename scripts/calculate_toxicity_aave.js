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
// choices: eth, dai, usdc, usdt, wbtc, matic, link
let COLLATERAL_ASSET = 'matic'
let DEBT_ASSET = 'dai'
let sampleFraction = 5

const abiCoder = new ethers.utils.AbiCoder()
const ONE_INCH_URL = "https://api.1inch.io/v4.0/137/quote?"
const API_URL = "https://api.thegraph.com/subgraphs/name/tkernell/hundred-finance-polygon"
const API_URL2 = "https://api.thegraph.com/subgraphs/name/tkernell/aave-polygon"
const client = createClient({ url: API_URL });
const client2 = createClient({ url: API_URL2 });
const provider = new ethers.providers.JsonRpcProvider(process.env.NODE_URL_POLYGON)
const privateKey = process.env.TESTNET_PK
const wallet = new ethers.Wallet(privateKey, provider)

// aToken addresses
const aAaveAddress = "0xf329e36C7bF6E5E86ce2150875a84Ce77f477375"
const aDaiAddress = "0x82E64f49Ed5EC1bC6e43DAD4FC8Af9bb3A2312EE"
const aUsdtAddress = "0x6ab707Aca953eDAeFBc4fD23bA73294241490620"
const aLinkAddress = "0x191c10Aa4AF7C30e871E70C95dB0E4eb77237530"
const aWmaticAddress = "0x6d80113e533a2C0fe82EaBD35f1875DcEA89Ea97"
const aUsdcAddress = "0x625E7708f30cA75bfd92586e17077590C60eb4cD"
const aAgeurAddress = "0x8437d7C167dFB82ED4Cb79CD44B7a32A1dd95c77"
const aEursAddress = "0x38d693cE1dF5AaDF7bC62595A37D667aD57922e5"
const aWbtcAddress = "0x078f358208685046a11C85e8ad32895DED33A249"
const aWethAddress = "0xe50fA9b3c56FfB159cB0FCA61F5c9D750e8128c8"
const aCrvAddress = "0x513c7E3a9c69cA3e22550eF58AC1C0088e918FFf"
const aSushiAddress = "0xc45A479877e1e9Dfe9FcD4056c699575a1045dAA"
const aGhstAddress = "0x8Eb270e296023E9D92081fdF967dDd7878724424"
const aJeurAddress = "0x6533afac2E7BCCB20dca161449A13A32D391fb00"
const aDpiAddress = "0x724dc807b04555b71ed48a6896b6F41593b8C637"
const aBalAddress = "0x8ffDf2DE812095b1D19CB146E4c004587C0A0692"
const aMimaticAddress = "0xeBe517846d0F36eCEd99C735cbF6131e1fEB775D"
const aMaticxAddress = "0x80cA0d8C38d2e2BcbaB66aA1648Bd1C7160500FE"
const aStmaticAddress = "0xEA1132120ddcDDA2F119e99Fa7A27a0d036F7Ac9"

// aave debt token addresses
const aAaveSDebtAddress = "0xfAeF6A702D15428E588d4C0614AEFb4348D83D48"
const aAaveVDebtAddress = "0xE80761Ea617F66F96274eA5e8c37f03960ecC679"
const aAgeurSDebtAddress = "0x40B4BAEcc69B882e8804f9286b12228C27F8c9BF"
const aAgeurVDebtAddress = "0x3ca5FA07689F266e907439aFd1fBB59c44fe12f6"
const aSushiSDebtAddress = "0x78246294a4c6fBf614Ed73CcC9F8b875ca8eE841"
const aSushiVDebtAddress = "0x34e2eD44EF7466D5f9E0b782B5c08b57475e7907"
const aDaiSDebtAddress = "0xd94112B5B62d53C9402e7A60289c6810dEF1dC9B"
const aDaiVDebtAddress = "0x8619d80FB0141ba7F184CbF22fd724116D9f7ffC"
const aUsdtSDebtAddress = "0x70eFfc565DB6EEf7B927610155602d31b670e802"
const aUsdtVDebtAddress = "0xfb00AC187a8Eb5AFAE4eACE434F493Eb62672df7"
const aLinkSDebtAddress = "0x89D976629b7055ff1ca02b927BA3e020F22A44e4"
const aLinkVDebtAddress = "0x953A573793604aF8d41F306FEb8274190dB4aE0e"
const aWmaticSDebtAddress = "0xF15F26710c827DDe8ACBA678682F3Ce24f2Fb56E"
const aWmaticVDebtAddress = "0x4a1c3aD6Ed28a636ee1751C69071f6be75DEb8B8"
const aUsdcSDebtAddress = "0x307ffe186F84a3bc2613D1eA417A5737D69A7007"
const aUsdcVDebtAddress = "0xFCCf3cAbbe80101232d343252614b6A3eE81C989"
const aWbtcSDebtAddress = "0x633b207Dd676331c413D4C013a6294B0FE47cD0e"
const aWbtcVDebtAddress = "0x92b42c66840C7AD907b4BF74879FF3eF7c529473"
const aWethSDebtAddress = "0xD8Ad37849950903571df17049516a5CD4cbE55F6"
const aWethVDebtAddress = "0x0c84331e39d6658Cd6e6b9ba04736cC4c4734351"
const aEursSDebtAddress = "0x8a9FdE6925a839F6B1932d16B36aC026F8d3FbdB"
const aEursVDebtAddress = "0x5D557B07776D12967914379C71a1310e917C7555"
const aJeurSDebtAddress = "0x6B4b37618D85Db2a7b469983C888040F7F05Ea3D"
const aJeurVDebtAddress = "0x44705f578135cC5d703b4c9c122528C73Eb87145"
const aBalSDebtAddress = "0xa5e408678469d23efDB7694b1B0A85BB0669e8bd"
const aBalVDebtAddress = "0xA8669021776Bc142DfcA87c21b4A52595bCbB40a"
const aCrvSDebtAddress = "0x08Cb71192985E936C7Cd166A8b268035e400c3c3"
const aCrvVDebtAddress = "0x77CA01483f379E58174739308945f044e1a764dc"
const aDpiSDebtAddress = "0xDC1fad70953Bb3918592b6fCc374fe05F5811B6a"
const aDpiVDebtAddress = "0xf611aEb5013fD2c0511c9CD55c7dc5C1140741A6"
const aGhstSDebtAddress = "0x3EF10DFf4928279c004308EbADc4Db8B7620d6fc"
const aGhstVDebtAddress = "0xCE186F6Cccb0c955445bb9d10C59caE488Fea559"
const aMimaticVDebtAddress = "0x18248226C16BF76c032817854E7C83a2113B4f06"


// underlying token addresss
const ethTokenAddress = "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619";
const daiTokenAddress = "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063";
const usdcTokenAddress = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
const usdtTokenAddress = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F";
const wbtcTokenAddress = "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6";
const maticTokenAddress = "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270"; // wrapped matic
const linkTokenAddress = "0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39";
const aaveTokenAddress = "0xD6DF932A45C0f255f85145f286eA0b292B21C90B"
const ageurTokenAddress = "0xE0B52e49357Fd4DAf2c15e02058DCE6BC0057db4"
const sushiTokenAddress = "0x0b3F868E0BE5597D5DB7fEB59E1CADBb0fdDa50a" 

let aavePrice = 57.12
let ageurPrice = 1.03
let balPrice = 5.39
let crvPrice = 0.599
let daiPrice = 1
let dpiPrice = 67.14
let ethPrice = 1215.28
let eursPrice = 1.04
let ghstPrice = 1.04
let jeurPrice = 1.02
let linkPrice = 6.10
let maticPrice = 0.901
let sushiPrice = 1.21
let usdcPrice = 1
let usdtPrice = 1
let wbtcPrice = 16242.31
let mimaticPrice = 0.9875
let maticxPrice = 0.9295
let stmaticPrice = 0.937686

let collateral = {}

let debt = {}

const aaveLtvAave = 0.70
const ageurLtvAave = 0
const sushiLtvAave = 0.45
const daiLtvAave = 0.80
const usdtLtvAave = 0.80
const linkLtvAave = 0.65
const maticLtvAave = 0.70 // e-mode: 0.95
const usdcLtvAave = 0.85
const wbtcLtvAave = 0.75
const ethLtvAave = 0.825
const eursLtvAave = 0.70
const crvLtvAave = 0.80
const ghstLtvAave = 0.45
const jeurLtvAave = 0
const dpiLtvAave = 0.45
const balLtvAave = 0.45
const mimaticLtvAave = 0.80
const maticxLtvAave = 0.65 // e-mode: 0.95
const stmaticLtvAave = 0.65 // e-mode: 0.95

const aaveIncAave = 0.075
const ageurIncAave = 0
const sushiIncAave = 0.10
const daiIncAave = 0.05
const usdtIncAave = 0.05
const linkIncAave = 0.075
const maticIncAave = 0.10 // e-mode: 0.01
const usdcIncAave = 0.04
const wbtcIncAave = 0.065
const ethIncAave = 0.05
const eursIncAave = 0.075
const crvIncAave = 0.05
const ghstIncAave = 0.15
const jeurIncAave = 0
const dpiIncAave = 0.10
const balIncAave = 0.10
const mimaticIncAave = 0.05
const maticxIncAave = 0.10 // e-mode: 0.01
const stmaticIncAave = 0.10 // e-mode: 0.01

let rShare = []
let LByAsset = null
let incLoanWeightedAvg = null
let ltvLoanWeightedAvg = null
let cTotal = []

async function main(_nodeURL) {
    // get prices
    await getPrices()
    let txBalances1 = await fetchBalances(client)
    let txBalances2 = await fetchBalances(client2)
    txBalancesTemp = txBalances1
    parseBalances(txBalances1, txBalances2)

    // getLByUser()
    getRShare()
    // getLByAsset()
    getIncAndLTV()
    getCTotals()
    saveData(txBalances1, txBalances2)
    await returnToxicity("matic", "dai")
    await returnToxicity("matic", "usdc")
    await returnToxicity("matic", "usdt")
    await returnToxicity("eth", "dai")
    await returnToxicity("eth", "usdc")
    await returnToxicity("eth", "usdt")
    await returnToxicity("wbtc", "dai")
    await returnToxicity("wbtc", "usdc")
    await returnToxicity("wbtc", "usdt")
}

function saveData(_txBalances1, _txBalances2) {
    fs.writeFile('./scripts/data/txBalances1.json', JSON.stringify(_txBalances1), err => {
        if (err) {
            throw err;
        }
    })
    fs.writeFile('./scripts/txBalances2.json', JSON.stringify(_txBalances2), err => {
        if (err) {
            throw err;
        }
    })
    fs.writeFile('./scripts/data/collateral.json', JSON.stringify(collateral), err => {
        if (err) {
            throw err;
        }
    })
    fs.writeFile('./scripts/data/debt.json', JSON.stringify(debt), err => {
        if (err) {
            throw err;
        }
    })
    fs.writeFile('./scripts/data/rShare.json', JSON.stringify(rShare), err => {
        if (err) {
            throw err;
        }
    })
    fs.writeFile('./scripts/data/incLoanWeightedAvg.json', JSON.stringify(incLoanWeightedAvg), err => {
        if (err) {
            throw err;
        }
    })
    fs.writeFile('./scripts/data/ltvLoanWeightedAvg.json', JSON.stringify(ltvLoanWeightedAvg), err => {
        if (err) {
            throw err;
        }
    })
    fs.writeFile('./scripts/data/cTotal.json', JSON.stringify(cTotal), err => {
        if (err) {
            throw err;
        }
    })



}

function readSavedRawBalances() {
    let rawdata = fs.readFileSync('./scripts/data/txBalances1.json');
    let txBalances1 = JSON.parse(rawdata);
    rawdata = fs.readFileSync('./scripts/data/txBalances2.json');
    let txBalances2 = JSON.parse(rawdata);
    return (txBalances1, txBalances2)
}

async function getPrices() {
    console.log("getting prices")
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

    // aave
    result = await axios.get(COINGECKO_API_PART1 + "aave" + COINGECKO_API_PART2)
    aavePrice = result.data.aave.usd

    // ageur
    result = await axios.get(COINGECKO_API_PART1 + "ageur" + COINGECKO_API_PART2)
    ageurPrice = result.data.ageur.usd

    // eurs
    result = await axios.get(COINGECKO_API_PART1 + "stasis-eurs" + COINGECKO_API_PART2)
    eursPrice = result.data["stasis-eurs"].usd

    // crv
    result = await axios.get(COINGECKO_API_PART1 + "curve-dao-token" + COINGECKO_API_PART2)
    crvPrice = result.data["curve-dao-token"].usd

    // sushi
    result = await axios.get(COINGECKO_API_PART1 + "sushi" + COINGECKO_API_PART2)
    sushiPrice = result.data.sushi.usd

    // ghst
    result = await axios.get(COINGECKO_API_PART1 + "aavegotchi" + COINGECKO_API_PART2)
    ghstPrice = result.data.aavegotchi.usd

    // jeur
    result = await axios.get(COINGECKO_API_PART1 + "jarvis-synthetic-euro" + COINGECKO_API_PART2)
    jeurPrice = result.data["jarvis-synthetic-euro"].usd

    // dpi 
    result = await axios.get(COINGECKO_API_PART1 + "defipulse-index" + COINGECKO_API_PART2)
    dpiPrice = result.data["defipulse-index"].usd

    // bal
    result = await axios.get(COINGECKO_API_PART1 + "balancer" + COINGECKO_API_PART2)
    balPrice = result.data.balancer.usd
}

async function fetchBalances(_client) {
    console.log("fetching balances...")
    let responseBalances = await _client.query(queryBalances('')).toPromise()
    let responseAllBalances = []

    while(responseBalances.data.balances.length > 0) {
        responseAllBalances = responseAllBalances.concat(responseBalances.data.balances);
        lastID = responseBalances.data.balances[responseBalances.data.balances.length - 1].id
        responseBalances = await _client.query(queryBalances(lastID)).toPromise()
    }

    return responseAllBalances
}

function parseBalances(_txBalances1, _txBalances2) {
    console.log("Parsing balances1...")
    for(let i=0; i<_txBalances1.length; i++) {
    // for(let i=0; i<10000; i++) {
        if(_txBalances1[i].protocol == 'aavePolygon') {
            thisOwner = _txBalances1[i].owner.toLowerCase()
            if(collateral[thisOwner] == undefined) {
                collateral[thisOwner] = {}
                collateral[thisOwner].aave = 0
                collateral[thisOwner].ageur = 0
                collateral[thisOwner].sushi = 0
                collateral[thisOwner].dai = 0
                collateral[thisOwner].usdt = 0
                collateral[thisOwner].link = 0
                collateral[thisOwner].matic = 0
                collateral[thisOwner].usdc = 0
                collateral[thisOwner].wbtc = 0
                collateral[thisOwner].eth = 0
                collateral[thisOwner].eurs = 0
                collateral[thisOwner].jeur = 0
                collateral[thisOwner].bal = 0
                collateral[thisOwner].crv = 0
                collateral[thisOwner].dpi = 0
                collateral[thisOwner].ghst = 0
                collateral[thisOwner].mimatic = 0
                collateral[thisOwner].maticx = 0
                collateral[thisOwner].stmatic = 0

                debt[thisOwner] = {}
                debt[thisOwner].aave = 0
                debt[thisOwner].ageur = 0
                debt[thisOwner].sushi = 0
                debt[thisOwner].dai = 0
                debt[thisOwner].usdt = 0
                debt[thisOwner].link = 0
                debt[thisOwner].matic = 0
                debt[thisOwner].usdc = 0
                debt[thisOwner].wbtc = 0
                debt[thisOwner].eth = 0
                debt[thisOwner].eurs = 0
                debt[thisOwner].jeur = 0
                debt[thisOwner].bal = 0
                debt[thisOwner].crv = 0
                debt[thisOwner].dpi = 0
                debt[thisOwner].ghst = 0
                debt[thisOwner].mimatic = 0
                debt[thisOwner].maticx = 0
                debt[thisOwner].stmatic = 0
            }
            
            if(_txBalances1[i].contract.toLowerCase() == aAaveAddress.toLowerCase()) {
                collateral[thisOwner].aave += web3.utils.fromWei(_txBalances1[i].balance) * aavePrice
            } else if(_txBalances1[i].contract.toLowerCase() == aAgeurAddress.toLowerCase()) {
                collateral[thisOwner].ageur += web3.utils.fromWei(_txBalances1[i].balance) * ageurPrice
            } else if(_txBalances1[i].contract.toLowerCase() == aSushiAddress.toLowerCase()) {
                collateral[thisOwner].sushi += web3.utils.fromWei(_txBalances1[i].balance) * sushiPrice
            } else if(_txBalances1[i].contract.toLowerCase() == aDaiAddress.toLowerCase()) {
                collateral[thisOwner].dai += web3.utils.fromWei(_txBalances1[i].balance) * daiPrice
            } else if(_txBalances1[i].contract.toLowerCase() == aUsdtAddress.toLowerCase()) {
                collateral[thisOwner].usdt += web3.utils.fromWei(_txBalances1[i].balance) * usdtPrice
            } else if(_txBalances1[i].contract.toLowerCase() == aLinkAddress.toLowerCase()) {
                collateral[thisOwner].link += web3.utils.fromWei(_txBalances1[i].balance) * linkPrice
            } else if(_txBalances1[i].contract.toLowerCase() == aWmaticAddress.toLowerCase()) {
                collateral[thisOwner].matic += web3.utils.fromWei(_txBalances1[i].balance) * maticPrice
            } else if(_txBalances1[i].contract.toLowerCase() == aUsdcAddress.toLowerCase()) {
                collateral[thisOwner].usdc += web3.utils.fromWei(_txBalances1[i].balance) * usdcPrice
            } else if(_txBalances1[i].contract.toLowerCase() == aWbtcAddress.toLowerCase()) {
                collateral[thisOwner].wbtc += (web3.utils.fromWei(_txBalances1[i].balance, "gwei") * wbtcPrice * 10)
            } else if(_txBalances1[i].contract.toLowerCase() == aWethAddress.toLowerCase()) {
                collateral[thisOwner].eth += web3.utils.fromWei(_txBalances1[i].balance) * ethPrice
            } else if(_txBalances1[i].contract.toLowerCase() == aAaveSDebtAddress.toLowerCase()) {
                debt[thisOwner].aave += web3.utils.fromWei(_txBalances1[i].balance) * aavePrice
            } else if(_txBalances1[i].contract.toLowerCase() == aAaveVDebtAddress.toLowerCase()) {
                debt[thisOwner].aave += web3.utils.fromWei(_txBalances1[i].balance) * aavePrice
            } else if(_txBalances1[i].contract.toLowerCase() == aAgeurSDebtAddress.toLowerCase()) {
                debt[thisOwner].ageur += web3.utils.fromWei(_txBalances1[i].balance) * ageurPrice
            } else if(_txBalances1[i].contract.toLowerCase() == aAgeurVDebtAddress.toLowerCase()) { 
                debt[thisOwner].ageur += web3.utils.fromWei(_txBalances1[i].balance) * ageurPrice
            } else if(_txBalances1[i].contract.toLowerCase() == aSushiSDebtAddress.toLowerCase()) {
                debt[thisOwner].sushi += web3.utils.fromWei(_txBalances1[i].balance) * sushiPrice
            } else if(_txBalances1[i].contract.toLowerCase() == aSushiVDebtAddress.toLowerCase()) {
                debt[thisOwner].sushi += web3.utils.fromWei(_txBalances1[i].balance) * sushiPrice
            } else if(_txBalances1[i].contract.toLowerCase() == aDaiSDebtAddress.toLowerCase()) { 
                debt[thisOwner].dai += web3.utils.fromWei(_txBalances1[i].balance) * daiPrice
            } else if(_txBalances1[i].contract.toLowerCase() == aDaiVDebtAddress.toLowerCase()) { 
                debt[thisOwner].dai += web3.utils.fromWei(_txBalances1[i].balance) * daiPrice
            } else if(_txBalances1[i].contract.toLowerCase() == aUsdtSDebtAddress.toLowerCase()) { 
                debt[thisOwner].usdt += web3.utils.fromWei(_txBalances1[i].balance) * usdtPrice
            } else if(_txBalances1[i].contract.toLowerCase() == aUsdtVDebtAddress.toLowerCase()) { 
                debt[thisOwner].usdt += web3.utils.fromWei(_txBalances1[i].balance) * usdtPrice
            } else if(_txBalances1[i].contract.toLowerCase() == aLinkSDebtAddress.toLowerCase()) { 
                debt[thisOwner].link += web3.utils.fromWei(_txBalances1[i].balance) * linkPrice
            } else if(_txBalances1[i].contract.toLowerCase() == aLinkVDebtAddress.toLowerCase()) { 
                debt[thisOwner].link += web3.utils.fromWei(_txBalances1[i].balance) * linkPrice
            } else if(_txBalances1[i].contract.toLowerCase() == aWmaticSDebtAddress.toLowerCase()) { 
                debt[thisOwner].matic += web3.utils.fromWei(_txBalances1[i].balance) * maticPrice
            } else if(_txBalances1[i].contract.toLowerCase() == aWmaticVDebtAddress.toLowerCase()) { 
                debt[thisOwner].matic += web3.utils.fromWei(_txBalances1[i].balance) * maticPrice
            } else if(_txBalances1[i].contract.toLowerCase() == aUsdcSDebtAddress.toLowerCase()) { 
                debt[thisOwner].usdc += web3.utils.fromWei(_txBalances1[i].balance) * usdcPrice
            } else if(_txBalances1[i].contract.toLowerCase() == aUsdcVDebtAddress.toLowerCase()) {    
                debt[thisOwner].usdc += web3.utils.fromWei(_txBalances1[i].balance) * usdcPrice
            } else if(_txBalances1[i].contract.toLowerCase() == aWbtcSDebtAddress.toLowerCase()) { 
                debt[thisOwner].wbtc += (web3.utils.fromWei(_txBalances1[i].balance, "gwei") * wbtcPrice * 10)
            } else if(_txBalances1[i].contract.toLowerCase() == aWbtcVDebtAddress.toLowerCase()) { 
                debt[thisOwner].wbtc += (web3.utils.fromWei(_txBalances1[i].balance, "gwei") * wbtcPrice * 10)
            } else if(_txBalances1[i].contract.toLowerCase() == aWethSDebtAddress.toLowerCase()) { 
                debt[thisOwner].eth += web3.utils.fromWei(_txBalances1[i].balance) * ethPrice
            } else if(_txBalances1[i].contract.toLowerCase() == aWethVDebtAddress.toLowerCase()) { 
                debt[thisOwner].eth += web3.utils.fromWei(_txBalances1[i].balance) * ethPrice
            } else { 
                console.log("Unknown contract: {}", [_txBalances1[i].contract])
            }
        }
    }
    console.log("Parsing balances2")
    for(let i=0; i<_txBalances2.length; i++) {
    // for(let i=0; i<500; i++) {
        thisOwner = _txBalances2[i].owner.toLowerCase()
        if(collateral[thisOwner] == undefined) {
            // console.log("creating new collateral object")
            collateral[thisOwner] = {}
            collateral[thisOwner].aave = 0
            collateral[thisOwner].ageur = 0
            collateral[thisOwner].sushi = 0
            collateral[thisOwner].dai = 0
            collateral[thisOwner].usdt = 0
            collateral[thisOwner].link = 0
            collateral[thisOwner].matic = 0
            collateral[thisOwner].usdc = 0
            collateral[thisOwner].wbtc = 0
            collateral[thisOwner].eth = 0
            collateral[thisOwner].eurs = 0
            collateral[thisOwner].jeur = 0
            collateral[thisOwner].bal = 0
            collateral[thisOwner].crv = 0
            collateral[thisOwner].dpi = 0
            collateral[thisOwner].ghst = 0
            collateral[thisOwner].mimatic = 0
            collateral[thisOwner].maticx = 0
            collateral[thisOwner].stmatic = 0

            debt[thisOwner] = {}
            debt[thisOwner].aave = 0
            debt[thisOwner].ageur = 0
            debt[thisOwner].sushi = 0
            debt[thisOwner].dai = 0
            debt[thisOwner].usdt = 0
            debt[thisOwner].link = 0
            debt[thisOwner].matic = 0
            debt[thisOwner].usdc = 0
            debt[thisOwner].wbtc = 0
            debt[thisOwner].eth = 0
            debt[thisOwner].eurs = 0
            debt[thisOwner].jeur = 0
            debt[thisOwner].bal = 0
            debt[thisOwner].crv = 0
            debt[thisOwner].dpi = 0
            debt[thisOwner].ghst = 0
            debt[thisOwner].mimatic = 0
            debt[thisOwner].maticx = 0
            debt[thisOwner].stmatic = 0
        }

        if(_txBalances2[i].contract.toLowerCase() == aEursAddress.toLowerCase()) {
            collateral[thisOwner].eurs += web3.utils.fromWei(_txBalances2[i].balance) * eursPrice
        } else if(_txBalances2[i].contract.toLowerCase() == aJeurAddress.toLowerCase()) {
            collateral[thisOwner].jeur += web3.utils.fromWei(_txBalances2[i].balance) * jeurPrice
        } else if(_txBalances2[i].contract.toLowerCase() == aBalAddress.toLowerCase()) {
            collateral[thisOwner].bal += web3.utils.fromWei(_txBalances2[i].balance) * balPrice
        } else if(_txBalances2[i].contract.toLowerCase() == aCrvAddress.toLowerCase()) {
            collateral[thisOwner].crv += web3.utils.fromWei(_txBalances2[i].balance) * crvPrice
        } else if(_txBalances2[i].contract.toLowerCase() == aDpiAddress.toLowerCase()) {
            collateral[thisOwner].dpi += web3.utils.fromWei(_txBalances2[i].balance) * dpiPrice
        } else if(_txBalances2[i].contract.toLowerCase() == aGhstAddress.toLowerCase()) {
            collateral[thisOwner].ghst += web3.utils.fromWei(_txBalances2[i].balance) * ghstPrice
        } else if(_txBalances2[i].contract.toLowerCase() == aMimaticAddress.toLowerCase()) {
            collateral[thisOwner].mimatic += web3.utils.fromWei(_txBalances2[i].balance) * mimaticPrice
        } else if(_txBalances2[i].contract.toLowerCase() == aMaticxAddress.toLowerCase()) {
            collateral[thisOwner].maticx += web3.utils.fromWei(_txBalances2[i].balance) * maticxPrice
        } else if(_txBalances2[i].contract.toLowerCase() == aStmaticAddress.toLowerCase()) {
            collateral[thisOwner].stmatic += web3.utils.fromWei(_txBalances2[i].balance) * stmaticPrice
        } else if(_txBalances2[i].contract.toLowerCase() == aEursSDebtAddress.toLowerCase()) { 
            debt[thisOwner].eurs += web3.utils.fromWei(_txBalances2[i].balance) * eursPrice
        } else if(_txBalances2[i].contract.toLowerCase() == aEursVDebtAddress.toLowerCase()) {
            debt[thisOwner].eurs += web3.utils.fromWei(_txBalances2[i].balance) * eursPrice
        } else if(_txBalances2[i].contract.toLowerCase() == aJeurSDebtAddress.toLowerCase()) { 
            debt[thisOwner].jeur += web3.utils.fromWei(_txBalances2[i].balance) * jeurPrice
        } else if(_txBalances2[i].contract.toLowerCase() == aJeurVDebtAddress.toLowerCase()) { 
            debt[thisOwner].jeur += web3.utils.fromWei(_txBalances2[i].balance) * jeurPrice
        } else if(_txBalances2[i].contract.toLowerCase() == aBalSDebtAddress.toLowerCase()) { 
            debt[thisOwner].bal += web3.utils.fromWei(_txBalances2[i].balance) * balPrice
        } else if(_txBalances2[i].contract.toLowerCase() == aBalVDebtAddress.toLowerCase()) { 
            debt[thisOwner].bal += web3.utils.fromWei(_txBalances2[i].balance) * balPrice
        } else if(_txBalances2[i].contract.toLowerCase() == aCrvSDebtAddress.toLowerCase()) { 
            debt[thisOwner].crv += web3.utils.fromWei(_txBalances2[i].balance) * crvPrice
        } else if(_txBalances2[i].contract.toLowerCase() == aCrvVDebtAddress.toLowerCase()) { 
            debt[thisOwner].crv += web3.utils.fromWei(_txBalances2[i].balance) * crvPrice
        } else if(_txBalances2[i].contract.toLowerCase() == aDpiSDebtAddress.toLowerCase()) { 
            debt[thisOwner].dpi += web3.utils.fromWei(_txBalances2[i].balance) * dpiPrice
        } else if(_txBalances2[i].contract.toLowerCase() == aDpiVDebtAddress.toLowerCase()) { 
            debt[thisOwner].dpi += web3.utils.fromWei(_txBalances2[i].balance) * dpiPrice
        } else if(_txBalances2[i].contract.toLowerCase() == aGhstSDebtAddress.toLowerCase()) { 
            debt[thisOwner].ghst += web3.utils.fromWei(_txBalances2[i].balance) * ghstPrice
        } else if(_txBalances2[i].contract.toLowerCase() == aGhstVDebtAddress.toLowerCase()) { 
            debt[thisOwner].ghst += web3.utils.fromWei(_txBalances2[i].balance) * ghstPrice
        } else if(_txBalances2[i].contract.toLowerCase() == aMimaticVDebtAddress.toLowerCase()) { 
            debt[thisOwner].mimatic += web3.utils.fromWei(_txBalances2[i].balance) * mimaticPrice
        } else { 
            console.log("Unknown contract: {}", [_txBalances2[i].contract])
        }
    }
    console.log("Removing token contract balances from user balances...")
        if(collateral[aAaveAddress] != undefined) {
            delete collateral[aAaveAddress]
            delete debt[aAaveAddress]
        } 
        if(collateral[aAgeurAddress] != undefined) {
            delete collateral[aAgeurAddress]
            delete debt[aAgeurAddress]
        } 
        if(collateral[aSushiAddress] != undefined) {
            delete collateral[aSushiAddress]
            delete debt[aSushiAddress]
        }
        if(collateral[aDaiAddress] != undefined) {
            delete collateral[aDaiAddress]
            delete debt[aDaiAddress]
        }
        if(collateral[aUsdtAddress] != undefined) {
            delete collateral[aUsdtAddress]
            delete debt[aUsdtAddress]
        }
        if(collateral[aLinkAddress] != undefined) {
            delete collateral[aLinkAddress]
            delete debt[aLinkAddress]
        }
        if(collateral[aWmaticAddress] != undefined) {
            delete collateral[aWmaticAddress]
            delete debt[aWmaticAddress]
        }
        if(collateral[aUsdcAddress] != undefined) {
            delete collateral[aUsdcAddress]
            delete debt[aUsdcAddress]
        }
        if(collateral[aWbtcAddress] != undefined) {
            delete collateral[aWbtcAddress]
            delete debt[aWbtcAddress]
        }
        if(collateral[aWethAddress] != undefined) {
            delete collateral[aWethAddress]
            delete debt[aWethAddress]
        }
        if(collateral[aAaveSDebtAddress] != undefined) {
            delete collateral[aAaveSDebtAddress]
            delete debt[aAaveSDebtAddress]
        }
        if(collateral[aAaveVDebtAddress] != undefined) {
            delete collateral[aAaveVDebtAddress]
            delete debt[aAaveVDebtAddress]
        }
        if(collateral[aAgeurSDebtAddress] != undefined) {
            delete collateral[aAgeurSDebtAddress]
            delete debt[aAgeurSDebtAddress]
        }
        if(collateral[aAgeurVDebtAddress] != undefined) {
            delete collateral[aAgeurVDebtAddress]
            delete debt[aAgeurVDebtAddress]
        }
        if(collateral[aSushiSDebtAddress] != undefined) {
            delete collateral[aSushiSDebtAddress]
            delete debt[aSushiSDebtAddress]
        }
        if(collateral[aSushiVDebtAddress] != undefined) {
            delete collateral[aSushiVDebtAddress]
            delete debt[aSushiVDebtAddress]
        }
        if(collateral[aDaiSDebtAddress] != undefined) {
            delete collateral[aDaiSDebtAddress]
            delete debt[aDaiSDebtAddress]
        }
        if(collateral[aDaiVDebtAddress] != undefined) {
            delete collateral[aDaiVDebtAddress]
            delete debt[aDaiVDebtAddress]
        }
        if(collateral[aUsdtSDebtAddress] != undefined) {
            delete collateral[aUsdtSDebtAddress]
            delete debt[aUsdtSDebtAddress]
        }
        if(collateral[aUsdtVDebtAddress] != undefined) {
            delete collateral[aUsdtVDebtAddress]
            delete debt[aUsdtVDebtAddress]
        }
        if(collateral[aLinkSDebtAddress] != undefined) {
            delete collateral[aLinkSDebtAddress]
            delete debt[aLinkSDebtAddress]
        }
        if(collateral[aLinkVDebtAddress] != undefined) {
            delete collateral[aLinkVDebtAddress]
            delete debt[aLinkVDebtAddress]
        }
        if(collateral[aWmaticSDebtAddress] != undefined) {
            delete collateral[aWmaticSDebtAddress]
            delete debt[aWmaticSDebtAddress]
        }
        if(collateral[aWmaticVDebtAddress] != undefined) {
            delete collateral[aWmaticVDebtAddress]
            delete debt[aWmaticVDebtAddress]
        }
        if(collateral[aUsdcSDebtAddress] != undefined) {
            delete collateral[aUsdcSDebtAddress]
            delete debt[aUsdcSDebtAddress]
        }
        if(collateral[aUsdcVDebtAddress] != undefined) {
            delete collateral[aUsdcVDebtAddress]
            delete debt[aUsdcVDebtAddress]
        }
        if(collateral[aWbtcSDebtAddress] != undefined) {
            delete collateral[aWbtcSDebtAddress]
            delete debt[aWbtcSDebtAddress]
        }
        if(collateral[aWbtcVDebtAddress] != undefined) {
            delete collateral[aWbtcVDebtAddress]
            delete debt[aWbtcVDebtAddress]
        }
        if(collateral[aWethSDebtAddress] != undefined) {
            delete collateral[aWethSDebtAddress]
            delete debt[aWethSDebtAddress]
        }
        if(collateral[aWethVDebtAddress] != undefined) {
            delete collateral[aWethVDebtAddress]
            delete debt[aWethVDebtAddress]
        }
        if(collateral[aEursAddress] != undefined) {
            delete collateral[aEursAddress]
            delete debt[aEursAddress] 
        }
        if(collateral[aEursSDebtAddress] != undefined) {
            delete collateral[aEursSDebtAddress]
            delete debt[aEursSDebtAddress]
        }
        if(collateral[aEursVDebtAddress] != undefined) {
            delete collateral[aEursVDebtAddress]
            delete debt[aEursVDebtAddress]
        }
        if(collateral[aJeurAddress] != undefined) {
            delete collateral[aJeurAddress]
            delete debt[aJeurAddress]
        }
        if(collateral[aJeurSDebtAddress] != undefined) {
            delete collateral[aJeurSDebtAddress]
            delete debt[aJeurSDebtAddress]
        }
        if(collateral[aJeurVDebtAddress] != undefined) {
            delete collateral[aJeurVDebtAddress]
            delete debt[aJeurVDebtAddress]
        }
        if(collateral[aBalAddress] != undefined) {
            delete collateral[aBalAddress]
            delete debt[aBalAddress]
        }
        if(collateral[aBalSDebtAddress] != undefined) {
            delete collateral[aBalSDebtAddress]
            delete debt[aBalSDebtAddress]
        }
        if(collateral[aBalVDebtAddress] != undefined) {
            delete collateral[aBalVDebtAddress]
            delete debt[aBalVDebtAddress]
        }
        if(collateral[aCrvAddress] != undefined) {
            delete collateral[aCrvAddress]
            delete debt[aCrvAddress]
        }
        if(collateral[aCrvSDebtAddress] != undefined) {
            delete collateral[aCrvSDebtAddress]
            delete debt[aCrvSDebtAddress]
        }
        if(collateral[aCrvVDebtAddress] != undefined) {
            delete collateral[aCrvVDebtAddress]
            delete debt[aCrvVDebtAddress]
        }
        if(collateral[aDpiAddress] != undefined) {
            delete collateral[aDpiAddress]
            delete debt[aDpiAddress]
        }
        if(collateral[aDpiSDebtAddress] != undefined) {
            delete collateral[aDpiSDebtAddress]
            delete debt[aDpiSDebtAddress]
        }
        if(collateral[aDpiVDebtAddress] != undefined) {
            delete collateral[aDpiVDebtAddress]
            delete debt[aDpiVDebtAddress]
        }
        if(collateral[aGhstAddress] != undefined) {
            delete collateral[aGhstAddress]
            delete debt[aGhstAddress]
        }
        if(collateral[aGhstSDebtAddress] != undefined) {
            delete collateral[aGhstSDebtAddress]
            delete debt[aGhstSDebtAddress]
        }
        if(collateral[aGhstVDebtAddress] != undefined) {
            delete collateral[aGhstVDebtAddress]
            delete debt[aGhstVDebtAddress]
        }
        if(collateral[aMimaticAddress] != undefined) {
            delete collateral[aMimaticAddress]
            delete debt[aMimaticAddress]
        } 
        if(collateral[aMimaticVDebtAddress] != undefined) {
            delete collateral[aMimaticVDebtAddress]
            delete debt[aMimaticVDebtAddress]
        }
        if(collateral[aMaticxAddress] != undefined) {
            delete collateral[aMaticxAddress]
            delete debt[aMaticxAddress]
        }
        if(collateral[aStmaticAddress] != undefined) {
            delete collateral[aStmaticAddress]
            delete debt[aStmaticAddress]
        }

        console.log("Found " + Object.keys(collateral).length + " unique user addresses with balances")

        if(sampleFraction > 1) {
            console.log("minimizing collateral and debt arrays by sampling every " + sampleFraction + " users")
            let _collateral2 = {}
            let _debt2 = {}
            for(i = 0; i<Object.keys(collateral).length; i+=sampleFraction) {
                _collateral2[Object.keys(collateral)[i]] = collateral[Object.keys(collateral)[i]]
                _debt2[Object.keys(debt)[i]] = debt[Object.keys(debt)[i]]
            }
            collateral = _collateral2
            debt = _debt2
        }
        console.log("Using " + Object.keys(collateral).length + " unique user addresses with balances")
}

function getLByUser() {
    // get L^qP -- total $-value of assets owed by user q on platform P
    console.log("getting L^qP")
    for(i = 0; i < Object.keys(debt).length; i++) {
        debt[Object.keys(debt)[i]].L = debt[Object.keys(debt)[i]].aave + debt[Object.keys(debt)[i]].ageur + debt[Object.keys(debt)[i]].sushi + debt[Object.keys(debt)[i]].dai + debt[Object.keys(debt)[i]].usdt + debt[Object.keys(debt)[i]].link + debt[Object.keys(debt)[i]].matic + debt[Object.keys(debt)[i]].usdc + debt[Object.keys(debt)[i]].wbtc + debt[Object.keys(debt)[i]].eth + debt[Object.keys(debt)[i]].eurs + debt[Object.keys(debt)[i]].jeur + debt[Object.keys(debt)[i]].bal + debt[Object.keys(debt)[i]].crv + debt[Object.keys(debt)[i]].dpi + debt[Object.keys(debt)[i]].ghst + debt[Object.keys(debt)[i]].mimatic + debt[Object.keys(debt)[i]].maticx + debt[Object.keys(debt)[i]].stmatic
    }
}

function getRShare() {
    // get r_i^qP -- share of loans collateralized by asset i owned by user q on platform P
    console.log("getting r_i^qP concise")
    for(i = 0; i < Object.keys(collateral).length; i++) {
        let denominator = aaveLtvAave * collateral[Object.keys(collateral)[i]].aave + ageurLtvAave * collateral[Object.keys(collateral)[i]].ageur + sushiLtvAave * collateral[Object.keys(collateral)[i]].sushi + daiLtvAave * collateral[Object.keys(collateral)[i]].dai + usdtLtvAave * collateral[Object.keys(collateral)[i]].usdt + linkLtvAave * collateral[Object.keys(collateral)[i]].link + maticLtvAave * collateral[Object.keys(collateral)[i]].matic + usdcLtvAave * collateral[Object.keys(collateral)[i]].usdc + wbtcLtvAave * collateral[Object.keys(collateral)[i]].wbtc + ethLtvAave * collateral[Object.keys(collateral)[i]].eth + eursLtvAave * collateral[Object.keys(collateral)[i]].eurs + jeurLtvAave * collateral[Object.keys(collateral)[i]].jeur + balLtvAave * collateral[Object.keys(collateral)[i]].bal + crvLtvAave * collateral[Object.keys(collateral)[i]].crv + dpiLtvAave * collateral[Object.keys(collateral)[i]].dpi + ghstLtvAave * collateral[Object.keys(collateral)[i]].ghst + mimaticLtvAave * collateral[Object.keys(collateral)[i]].mimatic + maticxLtvAave * collateral[Object.keys(collateral)[i]].maticx + stmaticLtvAave * collateral[Object.keys(collateral)[i]].stmatic
        rMatic = collateral[Object.keys(collateral)[i]].matic * maticLtvAave / denominator
        rWbtc = collateral[Object.keys(collateral)[i]].wbtc * wbtcLtvAave / denominator
        rEth = collateral[Object.keys(collateral)[i]].eth * ethLtvAave / denominator

       
        if(isNaN(rMatic)) {
            rMatic = 0
        }
        if(isNaN(rWbtc)) {
            rWbtc = 0
        }
        if(isNaN(rEth)) {
            rEth = 0
        }
        
        rShare.push({address: Object.keys(collateral)[i], matic: rMatic, wbtc: rWbtc, eth: rEth})
    }

    // // get r_i^qP -- share of loans collateralized by asset i owned by user q on platform P
    // console.log("getting r_i^qP")
    // for(i = 0; i < Object.keys(collateral).length; i++) {
    //     let denominator = aaveLtvAave * collateral[Object.keys(collateral)[i]].aave + ageurLtvAave * collateral[Object.keys(collateral)[i]].ageur + sushiLtvAave * collateral[Object.keys(collateral)[i]].sushi + daiLtvAave * collateral[Object.keys(collateral)[i]].dai + usdtLtvAave * collateral[Object.keys(collateral)[i]].usdt + linkLtvAave * collateral[Object.keys(collateral)[i]].link + maticLtvAave * collateral[Object.keys(collateral)[i]].matic + usdcLtvAave * collateral[Object.keys(collateral)[i]].usdc + wbtcLtvAave * collateral[Object.keys(collateral)[i]].wbtc + ethLtvAave * collateral[Object.keys(collateral)[i]].eth + eursLtvAave * collateral[Object.keys(collateral)[i]].eurs + jeurLtvAave * collateral[Object.keys(collateral)[i]].jeur + balLtvAave * collateral[Object.keys(collateral)[i]].bal + crvLtvAave * collateral[Object.keys(collateral)[i]].crv + dpiLtvAave * collateral[Object.keys(collateral)[i]].dpi + ghstLtvAave * collateral[Object.keys(collateral)[i]].ghst + mimaticLtvAave * collateral[Object.keys(collateral)[i]].mimatic + maticxLtvAave * collateral[Object.keys(collateral)[i]].maticx + stmaticLtvAave * collateral[Object.keys(collateral)[i]].stmatic
    //     rAave = collateral[Object.keys(collateral)[i]].aave * aaveLtvAave / denominator
    //     rAgeur = collateral[Object.keys(collateral)[i]].ageur * ageurLtvAave / denominator
    //     rSushi = collateral[Object.keys(collateral)[i]].sushi * sushiLtvAave / denominator
    //     rDai = collateral[Object.keys(collateral)[i]].dai * daiLtvAave / denominator
    //     rUsdt = collateral[Object.keys(collateral)[i]].usdt * usdtLtvAave / denominator
    //     rLink = collateral[Object.keys(collateral)[i]].link * linkLtvAave / denominator
    //     rMatic = collateral[Object.keys(collateral)[i]].matic * maticLtvAave / denominator
    //     rUsdc = collateral[Object.keys(collateral)[i]].usdc * usdcLtvAave / denominator
    //     rWbtc = collateral[Object.keys(collateral)[i]].wbtc * wbtcLtvAave / denominator
    //     rEth = collateral[Object.keys(collateral)[i]].eth * ethLtvAave / denominator
    //     rEurs = collateral[Object.keys(collateral)[i]].eurs * eursLtvAave / denominator
    //     rJeur = collateral[Object.keys(collateral)[i]].jeur * jeurLtvAave / denominator
    //     rBal = collateral[Object.keys(collateral)[i]].bal * balLtvAave / denominator
    //     rCrv = collateral[Object.keys(collateral)[i]].crv * crvLtvAave / denominator
    //     rDpi = collateral[Object.keys(collateral)[i]].dpi * dpiLtvAave / denominator
    //     rGhst = collateral[Object.keys(collateral)[i]].ghst * ghstLtvAave / denominator
    //     rMimatic = collateral[Object.keys(collateral)[i]].mimatic * mimaticLtvAave / denominator
    //     rMaticx = collateral[Object.keys(collateral)[i]].maticx * maticxLtvAave / denominator
    //     rStmatic = collateral[Object.keys(collateral)[i]].stmatic * stmaticLtvAave / denominator

    //     if(isNaN(rAave)) {
    //         rAave = 0
    //     }
    //     if(isNaN(rAgeur)) {
    //         rAgeur = 0
    //     }
    //     if(isNaN(rSushi)) {
    //         rSushi = 0
    //     }
    //     if(isNaN(rDai)) {
    //         rDai = 0
    //     }
    //     if(isNaN(rUsdt)) {
    //         rUsdt = 0
    //     }
    //     if(isNaN(rLink)) {
    //         rLink = 0
    //     }
    //     if(isNaN(rMatic)) {
    //         rMatic = 0
    //     }
    //     if(isNaN(rUsdc)) {
    //         rUsdc = 0
    //     }
    //     if(isNaN(rWbtc)) {
    //         rWbtc = 0
    //     }
    //     if(isNaN(rEth)) {
    //         rEth = 0
    //     }
    //     if(isNaN(rEurs)) {
    //         rEurs = 0
    //     }
    //     if(isNaN(rJeur)) {
    //         rJeur = 0
    //     }
    //     if(isNaN(rBal)) {
    //         rBal = 0
    //     }
    //     if(isNaN(rCrv)) {
    //         rCrv = 0
    //     }
    //     if(isNaN(rDpi)) {
    //         rDpi = 0
    //     }
    //     if(isNaN(rGhst)) {
    //         rGhst = 0
    //     }
    //     if(isNaN(rMimatic)) {
    //         rMimatic = 0
    //     }
    //     if(isNaN(rMaticx)) {
    //         rMaticx = 0
    //     }
    //     if(isNaN(rStmatic)) {
    //         rStmatic = 0
    //     }
        
    //     rShare.push({address: Object.keys(collateral)[i], aave: rAave, ageur: rAgeur, sushi: rSushi, dai: rDai, usdt: rUsdt, link: rLink, matic: rMatic, usdc: rUsdc, wbtc: rWbtc, eth: rEth, eurs: rEurs, jeur: rJeur, bal: rBal, crv: rCrv, dpi: rDpi, ghst: rGhst, mimatic: rMimatic, maticx: rMaticx, stmatic: rStmatic})
    // }


}

function getLByAsset() {
    console.log("getting LByAsset")
    LByAsset = {aave: 0, ageur: 0, sushi: 0, dai: 0, usdt: 0, link: 0, matic: 0, usdc: 0, wbtc: 0, eth: 0, eurs: 0, jeur: 0, bal: 0, crv: 0, dpi: 0, ghst: 0, mimatic: 0, maticx: 0, stmatic: 0}
    for(i = 0; i < Object.keys(collateral).length; i++) {
        LByAsset.aave += rShare[i].aave * debt[Object.keys(debt)[i]].L
        LByAsset.ageur += rShare[i].ageur * debt[Object.keys(debt)[i]].L
        LByAsset.sushi += rShare[i].sushi * debt[Object.keys(debt)[i]].L
        LByAsset.dai += rShare[i].dai * debt[Object.keys(debt)[i]].L
        LByAsset.usdt += rShare[i].usdt * debt[Object.keys(debt)[i]].L
        LByAsset.link += rShare[i].link * debt[Object.keys(debt)[i]].L
        LByAsset.matic += rShare[i].matic * debt[Object.keys(debt)[i]].L
        LByAsset.usdc += rShare[i].usdc * debt[Object.keys(debt)[i]].L
        LByAsset.wbtc += rShare[i].wbtc * debt[Object.keys(debt)[i]].L
        LByAsset.eth += rShare[i].eth * debt[Object.keys(debt)[i]].L
        LByAsset.eurs += rShare[i].eurs * debt[Object.keys(debt)[i]].L
        LByAsset.jeur += rShare[i].jeur * debt[Object.keys(debt)[i]].L
        LByAsset.bal += rShare[i].bal * debt[Object.keys(debt)[i]].L
        LByAsset.crv += rShare[i].crv * debt[Object.keys(debt)[i]].L
        LByAsset.dpi += rShare[i].dpi * debt[Object.keys(debt)[i]].L
        LByAsset.ghst += rShare[i].ghst * debt[Object.keys(debt)[i]].L
        LByAsset.mimatic += rShare[i].mimatic * debt[Object.keys(debt)[i]].L
        LByAsset.maticx += rShare[i].maticx * debt[Object.keys(debt)[i]].L
        LByAsset.stmatic += rShare[i].stmatic * debt[Object.keys(debt)[i]].L
    }
}

function getIncAndLTV() {
    // get inc loan weighted average
    incLoanWeightedAvg = {aave: 0, ageur: 0, sushi: 0, dai: 0, usdt: 0, link: 0, matic: 0, usdc: 0, wbtc: 0, eth: 0, eurs: 0, jeur: 0, bal: 0, crv: 0, dpi: 0, ghst: 0, mimatic: 0, maticx: 0, stmatic: 0}
    incLoanWeightedAvg.aave = aaveIncAave
    incLoanWeightedAvg.ageur = ageurIncAave
    incLoanWeightedAvg.sushi = sushiIncAave
    incLoanWeightedAvg.dai = daiIncAave
    incLoanWeightedAvg.usdt = usdtIncAave
    incLoanWeightedAvg.link = linkIncAave
    incLoanWeightedAvg.matic = maticIncAave
    incLoanWeightedAvg.usdc = usdcIncAave
    incLoanWeightedAvg.wbtc = wbtcIncAave
    incLoanWeightedAvg.eth = ethIncAave
    incLoanWeightedAvg.eurs = eursIncAave
    incLoanWeightedAvg.jeur = jeurIncAave
    incLoanWeightedAvg.bal = balIncAave
    incLoanWeightedAvg.crv = crvIncAave
    incLoanWeightedAvg.dpi = dpiIncAave
    incLoanWeightedAvg.ghst = ghstIncAave
    incLoanWeightedAvg.mimatic = mimaticIncAave
    incLoanWeightedAvg.maticx = maticxIncAave
    incLoanWeightedAvg.stmatic = stmaticIncAave

    // get LTV loan weighted average
    ltvLoanWeightedAvg = {aave: 0, ageur: 0, sushi: 0, dai: 0, usdt: 0, link: 0, matic: 0, usdc: 0, wbtc: 0, eth: 0, eurs: 0, jeur: 0, bal: 0, crv: 0, dpi: 0, ghst: 0, mimatic: 0, maticx: 0, stmatic: 0}
    ltvLoanWeightedAvg.aave = aaveLtvAave
    ltvLoanWeightedAvg.ageur = ageurLtvAave
    ltvLoanWeightedAvg.sushi = sushiLtvAave
    ltvLoanWeightedAvg.dai = daiLtvAave
    ltvLoanWeightedAvg.usdt = usdtLtvAave
    ltvLoanWeightedAvg.link = linkLtvAave
    ltvLoanWeightedAvg.matic = maticLtvAave
    ltvLoanWeightedAvg.usdc = usdcLtvAave
    ltvLoanWeightedAvg.wbtc = wbtcLtvAave
    ltvLoanWeightedAvg.eth = ethLtvAave
    ltvLoanWeightedAvg.eurs = eursLtvAave
    ltvLoanWeightedAvg.jeur = jeurLtvAave
    ltvLoanWeightedAvg.bal = balLtvAave
    ltvLoanWeightedAvg.crv = crvLtvAave
    ltvLoanWeightedAvg.dpi = dpiLtvAave
    ltvLoanWeightedAvg.ghst = ghstLtvAave
    ltvLoanWeightedAvg.mimatic = mimaticLtvAave
    ltvLoanWeightedAvg.maticx = maticxLtvAave
    ltvLoanWeightedAvg.stmatic = stmaticLtvAave
}

function getCTotals() {
    // console.log("Getting cTotals")
    // // get c_(i,j) total $-value of asset i collateralizing asset j loans 
    // cTotal.aaveCollateral = ({aave: 0, ageur: 0, sushi: 0, dai: 0, usdt: 0, link: 0, matic: 0, usdc: 0, wbtc: 0, eth: 0, eurs: 0, jeur: 0, bal: 0, crv: 0, dpi: 0, ghst: 0, mimatic: 0, maticx: 0, stmatic: 0})
    // cTotal.ageurCollateral = ({aave: 0, ageur: 0, sushi: 0, dai: 0, usdt: 0, link: 0, matic: 0, usdc: 0, wbtc: 0, eth: 0, eurs: 0, jeur: 0, bal: 0, crv: 0, dpi: 0, ghst: 0, mimatic: 0, maticx: 0, stmatic: 0})
    // cTotal.sushiCollateral = ({aave: 0, ageur: 0, sushi: 0, dai: 0, usdt: 0, link: 0, matic: 0, usdc: 0, wbtc: 0, eth: 0, eurs: 0, jeur: 0, bal: 0, crv: 0, dpi: 0, ghst: 0, mimatic: 0, maticx: 0, stmatic: 0})
    // cTotal.daiCollateral = ({aave: 0, ageur: 0, sushi: 0, dai: 0, usdt: 0, link: 0, matic: 0, usdc: 0, wbtc: 0, eth: 0, eurs: 0, jeur: 0, bal: 0, crv: 0, dpi: 0, ghst: 0, mimatic: 0, maticx: 0, stmatic: 0})
    // cTotal.usdtCollateral = ({aave: 0, ageur: 0, sushi: 0, dai: 0, usdt: 0, link: 0, matic: 0, usdc: 0, wbtc: 0, eth: 0, eurs: 0, jeur: 0, bal: 0, crv: 0, dpi: 0, ghst: 0, mimatic: 0, maticx: 0, stmatic: 0})
    // cTotal.linkCollateral = ({aave: 0, ageur: 0, sushi: 0, dai: 0, usdt: 0, link: 0, matic: 0, usdc: 0, wbtc: 0, eth: 0, eurs: 0, jeur: 0, bal: 0, crv: 0, dpi: 0, ghst: 0, mimatic: 0, maticx: 0, stmatic: 0})
    // cTotal.maticCollateral = ({aave: 0, ageur: 0, sushi: 0, dai: 0, usdt: 0, link: 0, matic: 0, usdc: 0, wbtc: 0, eth: 0, eurs: 0, jeur: 0, bal: 0, crv: 0, dpi: 0, ghst: 0, mimatic: 0, maticx: 0, stmatic: 0})
    // cTotal.usdcCollateral = ({aave: 0, ageur: 0, sushi: 0, dai: 0, usdt: 0, link: 0, matic: 0, usdc: 0, wbtc: 0, eth: 0, eurs: 0, jeur: 0, bal: 0, crv: 0, dpi: 0, ghst: 0, mimatic: 0, maticx: 0, stmatic: 0})
    // cTotal.wbtcCollateral = ({aave: 0, ageur: 0, sushi: 0, dai: 0, usdt: 0, link: 0, matic: 0, usdc: 0, wbtc: 0, eth: 0, eurs: 0, jeur: 0, bal: 0, crv: 0, dpi: 0, ghst: 0, mimatic: 0, maticx: 0, stmatic: 0})
    // cTotal.ethCollateral = ({aave: 0, ageur: 0, sushi: 0, dai: 0, usdt: 0, link: 0, matic: 0, usdc: 0, wbtc: 0, eth: 0, eurs: 0, jeur: 0, bal: 0, crv: 0, dpi: 0, ghst: 0, mimatic: 0, maticx: 0, stmatic: 0})
    // cTotal.eursCollateral = ({aave: 0, ageur: 0, sushi: 0, dai: 0, usdt: 0, link: 0, matic: 0, usdc: 0, wbtc: 0, eth: 0, eurs: 0, jeur: 0, bal: 0, crv: 0, dpi: 0, ghst: 0, mimatic: 0, maticx: 0, stmatic: 0})
    // cTotal.jeurCollateral = ({aave: 0, ageur: 0, sushi: 0, dai: 0, usdt: 0, link: 0, matic: 0, usdc: 0, wbtc: 0, eth: 0, eurs: 0, jeur: 0, bal: 0, crv: 0, dpi: 0, ghst: 0, mimatic: 0, maticx: 0, stmatic: 0})
    // cTotal.balCollateral = ({aave: 0, ageur: 0, sushi: 0, dai: 0, usdt: 0, link: 0, matic: 0, usdc: 0, wbtc: 0, eth: 0, eurs: 0, jeur: 0, bal: 0, crv: 0, dpi: 0, ghst: 0, mimatic: 0, maticx: 0, stmatic: 0})
    // cTotal.crvCollateral = ({aave: 0, ageur: 0, sushi: 0, dai: 0, usdt: 0, link: 0, matic: 0, usdc: 0, wbtc: 0, eth: 0, eurs: 0, jeur: 0, bal: 0, crv: 0, dpi: 0, ghst: 0, mimatic: 0, maticx: 0, stmatic: 0})
    // cTotal.dpiCollateral = ({aave: 0, ageur: 0, sushi: 0, dai: 0, usdt: 0, link: 0, matic: 0, usdc: 0, wbtc: 0, eth: 0, eurs: 0, jeur: 0, bal: 0, crv: 0, dpi: 0, ghst: 0, mimatic: 0, maticx: 0, stmatic: 0})
    // cTotal.ghstCollateral = ({aave: 0, ageur: 0, sushi: 0, dai: 0, usdt: 0, link: 0, matic: 0, usdc: 0, wbtc: 0, eth: 0, eurs: 0, jeur: 0, bal: 0, crv: 0, dpi: 0, ghst: 0, mimatic: 0, maticx: 0, stmatic: 0})
    // cTotal.mimaticCollateral = ({aave: 0, ageur: 0, sushi: 0, dai: 0, usdt: 0, link: 0, matic: 0, usdc: 0, wbtc: 0, eth: 0, eurs: 0, jeur: 0, bal: 0, crv: 0, dpi: 0, ghst: 0, mimatic: 0, maticx: 0, stmatic: 0})
    // cTotal.maticxCollateral = ({aave: 0, ageur: 0, sushi: 0, dai: 0, usdt: 0, link: 0, matic: 0, usdc: 0, wbtc: 0, eth: 0, eurs: 0, jeur: 0, bal: 0, crv: 0, dpi: 0, ghst: 0, mimatic: 0, maticx: 0, stmatic: 0})
    // cTotal.stmaticCollateral = ({aave: 0, ageur: 0, sushi: 0, dai: 0, usdt: 0, link: 0, matic: 0, usdc: 0, wbtc: 0, eth: 0, eurs: 0, jeur: 0, bal: 0, crv: 0, dpi: 0, ghst: 0, mimatic: 0, maticx: 0, stmatic: 0})
    // colStrings = ['aaveCollateral', 'ageurCollateral', 'sushiCollateral', 'daiCollateral', 'usdtCollateral', 'linkCollateral', 'maticCollateral', 'usdcCollateral', 'wbtcCollateral', 'ethCollateral', 'eursCollateral', 'jeurCollateral', 'balCollateral', 'crvCollateral', 'dpiCollateral', 'ghstCollateral', 'mimaticCollateral', 'maticxCollateral', 'stmaticCollateral']
    // debtStrings = ['aave', 'ageur', 'sushi', 'dai', 'usdt', 'link', 'matic', 'usdc', 'wbtc', 'eth', 'eurs', 'jeur', 'bal', 'crv', 'dpi', 'ghst', 'mimatic', 'maticx', 'stmatic']
    // for(i = 0; i < Object.keys(debt).length; i++) {
    //     for(j = 0; j < colStrings.length; j++) {
    //         for(k = 0; k < debtStrings.length; k++) {
    //             cTotal[colStrings[j]][debtStrings[k]] += rShare[i][debtStrings[j]] * debt[Object.keys(debt)[i]][debtStrings[k]]
    //         }
    //     }
    // }

    console.log("Getting cTotals: Concise")
    // get c_(i,j) total $-value of asset i collateralizing asset j loans 
    cTotal.maticCollateral = ({dai: 0, usdt: 0, usdc: 0})
    cTotal.wbtcCollateral = ({dai: 0, usdt: 0, usdc: 0})
    cTotal.ethCollateral = ({dai: 0, usdt: 0, usdc: 0})
    colStrings = ['maticCollateral', 'wbtcCollateral', 'ethCollateral']
    colStrings2 = ['matic', 'wbtc', 'eth']
    debtStrings = ['dai', 'usdt', 'usdc']
    for(i = 0; i < Object.keys(debt).length; i++) {
        for(j = 0; j < colStrings.length; j++) {
            for(k = 0; k < debtStrings.length; k++) {
                cTotal[colStrings[j]][debtStrings[k]] += rShare[i][colStrings2[j]] * debt[Object.keys(debt)[i]][debtStrings[k]]
            }
        }
    }
}

async function getToxicity2() {
    // // get L^qP -- total $-value of assets owed by user q on platform P
    // console.log("getting L^qP")
    // for(i = 0; i < Object.keys(debt).length; i++) {
    //     debt[Object.keys(debt)[i]].L = debt[Object.keys(debt)[i]].aave + debt[Object.keys(debt)[i]].ageur + debt[Object.keys(debt)[i]].sushi + debt[Object.keys(debt)[i]].dai + debt[Object.keys(debt)[i]].usdt + debt[Object.keys(debt)[i]].link + debt[Object.keys(debt)[i]].matic + debt[Object.keys(debt)[i]].usdc + debt[Object.keys(debt)[i]].wbtc + debt[Object.keys(debt)[i]].eth + debt[Object.keys(debt)[i]].eurs + debt[Object.keys(debt)[i]].jeur + debt[Object.keys(debt)[i]].bal + debt[Object.keys(debt)[i]].crv + debt[Object.keys(debt)[i]].dpi + debt[Object.keys(debt)[i]].ghst + debt[Object.keys(debt)[i]].mimatic + debt[Object.keys(debt)[i]].maticx + debt[Object.keys(debt)[i]].stmatic
    // }

    // // get r_i^qP -- share of loans collateralized by asset i owned by user q on platform P
    // console.log("getting r_i^qP")
    // for(i = 0; i < Object.keys(collateral).length; i++) {
    //     let denominator = aaveLtvAave * collateral[Object.keys(collateral)[i]].aave + ageurLtvAave * collateral[Object.keys(collateral)[i]].ageur + sushiLtvAave * collateral[Object.keys(collateral)[i]].sushi + daiLtvAave * collateral[Object.keys(collateral)[i]].dai + usdtLtvAave * collateral[Object.keys(collateral)[i]].usdt + linkLtvAave * collateral[Object.keys(collateral)[i]].link + maticLtvAave * collateral[Object.keys(collateral)[i]].matic + usdcLtvAave * collateral[Object.keys(collateral)[i]].usdc + wbtcLtvAave * collateral[Object.keys(collateral)[i]].wbtc + ethLtvAave * collateral[Object.keys(collateral)[i]].eth + eursLtvAave * collateral[Object.keys(collateral)[i]].eurs + jeurLtvAave * collateral[Object.keys(collateral)[i]].jeur + balLtvAave * collateral[Object.keys(collateral)[i]].bal + crvLtvAave * collateral[Object.keys(collateral)[i]].crv + dpiLtvAave * collateral[Object.keys(collateral)[i]].dpi + ghstLtvAave * collateral[Object.keys(collateral)[i]].ghst + mimaticLtvAave * collateral[Object.keys(collateral)[i]].mimatic + maticxLtvAave * collateral[Object.keys(collateral)[i]].maticx + stmaticLtvAave * collateral[Object.keys(collateral)[i]].stmatic
    //     rAave = collateral[Object.keys(collateral)[i]].aave * aaveLtvAave / denominator
    //     rAgeur = collateral[Object.keys(collateral)[i]].ageur * ageurLtvAave / denominator
    //     rSushi = collateral[Object.keys(collateral)[i]].sushi * sushiLtvAave / denominator
    //     rDai = collateral[Object.keys(collateral)[i]].dai * daiLtvAave / denominator
    //     rUsdt = collateral[Object.keys(collateral)[i]].usdt * usdtLtvAave / denominator
    //     rLink = collateral[Object.keys(collateral)[i]].link * linkLtvAave / denominator
    //     rMatic = collateral[Object.keys(collateral)[i]].matic * maticLtvAave / denominator
    //     rUsdc = collateral[Object.keys(collateral)[i]].usdc * usdcLtvAave / denominator
    //     rWbtc = collateral[Object.keys(collateral)[i]].wbtc * wbtcLtvAave / denominator
    //     rEth = collateral[Object.keys(collateral)[i]].eth * ethLtvAave / denominator
    //     rEurs = collateral[Object.keys(collateral)[i]].eurs * eursLtvAave / denominator
    //     rJeur = collateral[Object.keys(collateral)[i]].jeur * jeurLtvAave / denominator
    //     rBal = collateral[Object.keys(collateral)[i]].bal * balLtvAave / denominator
    //     rCrv = collateral[Object.keys(collateral)[i]].crv * crvLtvAave / denominator
    //     rDpi = collateral[Object.keys(collateral)[i]].dpi * dpiLtvAave / denominator
    //     rGhst = collateral[Object.keys(collateral)[i]].ghst * ghstLtvAave / denominator
    //     rMimatic = collateral[Object.keys(collateral)[i]].mimatic * mimaticLtvAave / denominator
    //     rMaticx = collateral[Object.keys(collateral)[i]].maticx * maticxLtvAave / denominator
    //     rStmatic = collateral[Object.keys(collateral)[i]].stmatic * stmaticLtvAave / denominator

    //     if(isNaN(rAave)) {
    //         rAave = 0
    //     }
    //     if(isNaN(rAgeur)) {
    //         rAgeur = 0
    //     }
    //     if(isNaN(rSushi)) {
    //         rSushi = 0
    //     }
    //     if(isNaN(rDai)) {
    //         rDai = 0
    //     }
    //     if(isNaN(rUsdt)) {
    //         rUsdt = 0
    //     }
    //     if(isNaN(rLink)) {
    //         rLink = 0
    //     }
    //     if(isNaN(rMatic)) {
    //         rMatic = 0
    //     }
    //     if(isNaN(rUsdc)) {
    //         rUsdc = 0
    //     }
    //     if(isNaN(rWbtc)) {
    //         rWbtc = 0
    //     }
    //     if(isNaN(rEth)) {
    //         rEth = 0
    //     }
    //     if(isNaN(rEurs)) {
    //         rEurs = 0
    //     }
    //     if(isNaN(rJeur)) {
    //         rJeur = 0
    //     }
    //     if(isNaN(rBal)) {
    //         rBal = 0
    //     }
    //     if(isNaN(rCrv)) {
    //         rCrv = 0
    //     }
    //     if(isNaN(rDpi)) {
    //         rDpi = 0
    //     }
    //     if(isNaN(rGhst)) {
    //         rGhst = 0
    //     }
    //     if(isNaN(rMimatic)) {
    //         rMimatic = 0
    //     }
    //     if(isNaN(rMaticx)) {
    //         rMaticx = 0
    //     }
    //     if(isNaN(rStmatic)) {
    //         rStmatic = 0
    //     }
        
    //     rShare.push({address: Object.keys(collateral)[i], aave: rAave, ageur: rAgeur, sushi: rSushi, dai: rDai, usdt: rUsdt, link: rLink, matic: rMatic, usdc: rUsdc, wbtc: rWbtc, eth: rEth, eurs: rEurs, jeur: rJeur, bal: rBal, crv: rCrv, dpi: rDpi, ghst: rGhst, mimatic: rMimatic, maticx: rMaticx, stmatic: rStmatic})
    // }



    // get r_i^qP -- share of loans collateralized by asset i owned by user q on platform P
    console.log("getting r_i^qP concise")
    for(i = 0; i < Object.keys(collateral).length; i++) {
        let denominator = aaveLtvAave * collateral[Object.keys(collateral)[i]].aave + ageurLtvAave * collateral[Object.keys(collateral)[i]].ageur + sushiLtvAave * collateral[Object.keys(collateral)[i]].sushi + daiLtvAave * collateral[Object.keys(collateral)[i]].dai + usdtLtvAave * collateral[Object.keys(collateral)[i]].usdt + linkLtvAave * collateral[Object.keys(collateral)[i]].link + maticLtvAave * collateral[Object.keys(collateral)[i]].matic + usdcLtvAave * collateral[Object.keys(collateral)[i]].usdc + wbtcLtvAave * collateral[Object.keys(collateral)[i]].wbtc + ethLtvAave * collateral[Object.keys(collateral)[i]].eth + eursLtvAave * collateral[Object.keys(collateral)[i]].eurs + jeurLtvAave * collateral[Object.keys(collateral)[i]].jeur + balLtvAave * collateral[Object.keys(collateral)[i]].bal + crvLtvAave * collateral[Object.keys(collateral)[i]].crv + dpiLtvAave * collateral[Object.keys(collateral)[i]].dpi + ghstLtvAave * collateral[Object.keys(collateral)[i]].ghst + mimaticLtvAave * collateral[Object.keys(collateral)[i]].mimatic + maticxLtvAave * collateral[Object.keys(collateral)[i]].maticx + stmaticLtvAave * collateral[Object.keys(collateral)[i]].stmatic
        rMatic = collateral[Object.keys(collateral)[i]].matic * maticLtvAave / denominator
        rWbtc = collateral[Object.keys(collateral)[i]].wbtc * wbtcLtvAave / denominator
        rEth = collateral[Object.keys(collateral)[i]].eth * ethLtvAave / denominator

       
        if(isNaN(rMatic)) {
            rMatic = 0
        }
        if(isNaN(rWbtc)) {
            rWbtc = 0
        }
        if(isNaN(rEth)) {
            rEth = 0
        }
        
        rShare.push({address: Object.keys(collateral)[i], matic: rMatic, wbtc: rWbtc, eth: rEth})
    }


    // console.log("getting LByAsset")
    // LByAsset = {aave: 0, ageur: 0, sushi: 0, dai: 0, usdt: 0, link: 0, matic: 0, usdc: 0, wbtc: 0, eth: 0, eurs: 0, jeur: 0, bal: 0, crv: 0, dpi: 0, ghst: 0, mimatic: 0, maticx: 0, stmatic: 0}
    // for(i = 0; i < Object.keys(collateral).length; i++) {
    //     LByAsset.aave += rShare[i].aave * debt[Object.keys(debt)[i]].L
    //     LByAsset.ageur += rShare[i].ageur * debt[Object.keys(debt)[i]].L
    //     LByAsset.sushi += rShare[i].sushi * debt[Object.keys(debt)[i]].L
    //     LByAsset.dai += rShare[i].dai * debt[Object.keys(debt)[i]].L
    //     LByAsset.usdt += rShare[i].usdt * debt[Object.keys(debt)[i]].L
    //     LByAsset.link += rShare[i].link * debt[Object.keys(debt)[i]].L
    //     LByAsset.matic += rShare[i].matic * debt[Object.keys(debt)[i]].L
    //     LByAsset.usdc += rShare[i].usdc * debt[Object.keys(debt)[i]].L
    //     LByAsset.wbtc += rShare[i].wbtc * debt[Object.keys(debt)[i]].L
    //     LByAsset.eth += rShare[i].eth * debt[Object.keys(debt)[i]].L
    //     LByAsset.eurs += rShare[i].eurs * debt[Object.keys(debt)[i]].L
    //     LByAsset.jeur += rShare[i].jeur * debt[Object.keys(debt)[i]].L
    //     LByAsset.bal += rShare[i].bal * debt[Object.keys(debt)[i]].L
    //     LByAsset.crv += rShare[i].crv * debt[Object.keys(debt)[i]].L
    //     LByAsset.dpi += rShare[i].dpi * debt[Object.keys(debt)[i]].L
    //     LByAsset.ghst += rShare[i].ghst * debt[Object.keys(debt)[i]].L
    //     LByAsset.mimatic += rShare[i].mimatic * debt[Object.keys(debt)[i]].L
    //     LByAsset.maticx += rShare[i].maticx * debt[Object.keys(debt)[i]].L
    //     LByAsset.stmatic += rShare[i].stmatic * debt[Object.keys(debt)[i]].L
    // }

    // get inc loan weighted average
    incLoanWeightedAvg = {aave: 0, ageur: 0, sushi: 0, dai: 0, usdt: 0, link: 0, matic: 0, usdc: 0, wbtc: 0, eth: 0, eurs: 0, jeur: 0, bal: 0, crv: 0, dpi: 0, ghst: 0, mimatic: 0, maticx: 0, stmatic: 0}
    incLoanWeightedAvg.aave = aaveIncAave
    incLoanWeightedAvg.ageur = ageurIncAave
    incLoanWeightedAvg.sushi = sushiIncAave
    incLoanWeightedAvg.dai = daiIncAave
    incLoanWeightedAvg.usdt = usdtIncAave
    incLoanWeightedAvg.link = linkIncAave
    incLoanWeightedAvg.matic = maticIncAave
    incLoanWeightedAvg.usdc = usdcIncAave
    incLoanWeightedAvg.wbtc = wbtcIncAave
    incLoanWeightedAvg.eth = ethIncAave
    incLoanWeightedAvg.eurs = eursIncAave
    incLoanWeightedAvg.jeur = jeurIncAave
    incLoanWeightedAvg.bal = balIncAave
    incLoanWeightedAvg.crv = crvIncAave
    incLoanWeightedAvg.dpi = dpiIncAave
    incLoanWeightedAvg.ghst = ghstIncAave
    incLoanWeightedAvg.mimatic = mimaticIncAave
    incLoanWeightedAvg.maticx = maticxIncAave
    incLoanWeightedAvg.stmatic = stmaticIncAave

    // get LTV loan weighted average
    ltvLoanWeightedAvg = {aave: 0, ageur: 0, sushi: 0, dai: 0, usdt: 0, link: 0, matic: 0, usdc: 0, wbtc: 0, eth: 0, eurs: 0, jeur: 0, bal: 0, crv: 0, dpi: 0, ghst: 0, mimatic: 0, maticx: 0, stmatic: 0}
    ltvLoanWeightedAvg.aave = aaveLtvAave
    ltvLoanWeightedAvg.ageur = ageurLtvAave
    ltvLoanWeightedAvg.sushi = sushiLtvAave
    ltvLoanWeightedAvg.dai = daiLtvAave
    ltvLoanWeightedAvg.usdt = usdtLtvAave
    ltvLoanWeightedAvg.link = linkLtvAave
    ltvLoanWeightedAvg.matic = maticLtvAave
    ltvLoanWeightedAvg.usdc = usdcLtvAave
    ltvLoanWeightedAvg.wbtc = wbtcLtvAave
    ltvLoanWeightedAvg.eth = ethLtvAave
    ltvLoanWeightedAvg.eurs = eursLtvAave
    ltvLoanWeightedAvg.jeur = jeurLtvAave
    ltvLoanWeightedAvg.bal = balLtvAave
    ltvLoanWeightedAvg.crv = crvLtvAave
    ltvLoanWeightedAvg.dpi = dpiLtvAave
    ltvLoanWeightedAvg.ghst = ghstLtvAave
    ltvLoanWeightedAvg.mimatic = mimaticLtvAave
    ltvLoanWeightedAvg.maticx = maticxLtvAave
    ltvLoanWeightedAvg.stmatic = stmaticLtvAave

    // console.log("Getting cTotals")
    // // get c_(i,j) total $-value of asset i collateralizing asset j loans 
    // cTotal.aaveCollateral = ({aave: 0, ageur: 0, sushi: 0, dai: 0, usdt: 0, link: 0, matic: 0, usdc: 0, wbtc: 0, eth: 0, eurs: 0, jeur: 0, bal: 0, crv: 0, dpi: 0, ghst: 0, mimatic: 0, maticx: 0, stmatic: 0})
    // cTotal.ageurCollateral = ({aave: 0, ageur: 0, sushi: 0, dai: 0, usdt: 0, link: 0, matic: 0, usdc: 0, wbtc: 0, eth: 0, eurs: 0, jeur: 0, bal: 0, crv: 0, dpi: 0, ghst: 0, mimatic: 0, maticx: 0, stmatic: 0})
    // cTotal.sushiCollateral = ({aave: 0, ageur: 0, sushi: 0, dai: 0, usdt: 0, link: 0, matic: 0, usdc: 0, wbtc: 0, eth: 0, eurs: 0, jeur: 0, bal: 0, crv: 0, dpi: 0, ghst: 0, mimatic: 0, maticx: 0, stmatic: 0})
    // cTotal.daiCollateral = ({aave: 0, ageur: 0, sushi: 0, dai: 0, usdt: 0, link: 0, matic: 0, usdc: 0, wbtc: 0, eth: 0, eurs: 0, jeur: 0, bal: 0, crv: 0, dpi: 0, ghst: 0, mimatic: 0, maticx: 0, stmatic: 0})
    // cTotal.usdtCollateral = ({aave: 0, ageur: 0, sushi: 0, dai: 0, usdt: 0, link: 0, matic: 0, usdc: 0, wbtc: 0, eth: 0, eurs: 0, jeur: 0, bal: 0, crv: 0, dpi: 0, ghst: 0, mimatic: 0, maticx: 0, stmatic: 0})
    // cTotal.linkCollateral = ({aave: 0, ageur: 0, sushi: 0, dai: 0, usdt: 0, link: 0, matic: 0, usdc: 0, wbtc: 0, eth: 0, eurs: 0, jeur: 0, bal: 0, crv: 0, dpi: 0, ghst: 0, mimatic: 0, maticx: 0, stmatic: 0})
    // cTotal.maticCollateral = ({aave: 0, ageur: 0, sushi: 0, dai: 0, usdt: 0, link: 0, matic: 0, usdc: 0, wbtc: 0, eth: 0, eurs: 0, jeur: 0, bal: 0, crv: 0, dpi: 0, ghst: 0, mimatic: 0, maticx: 0, stmatic: 0})
    // cTotal.usdcCollateral = ({aave: 0, ageur: 0, sushi: 0, dai: 0, usdt: 0, link: 0, matic: 0, usdc: 0, wbtc: 0, eth: 0, eurs: 0, jeur: 0, bal: 0, crv: 0, dpi: 0, ghst: 0, mimatic: 0, maticx: 0, stmatic: 0})
    // cTotal.wbtcCollateral = ({aave: 0, ageur: 0, sushi: 0, dai: 0, usdt: 0, link: 0, matic: 0, usdc: 0, wbtc: 0, eth: 0, eurs: 0, jeur: 0, bal: 0, crv: 0, dpi: 0, ghst: 0, mimatic: 0, maticx: 0, stmatic: 0})
    // cTotal.ethCollateral = ({aave: 0, ageur: 0, sushi: 0, dai: 0, usdt: 0, link: 0, matic: 0, usdc: 0, wbtc: 0, eth: 0, eurs: 0, jeur: 0, bal: 0, crv: 0, dpi: 0, ghst: 0, mimatic: 0, maticx: 0, stmatic: 0})
    // cTotal.eursCollateral = ({aave: 0, ageur: 0, sushi: 0, dai: 0, usdt: 0, link: 0, matic: 0, usdc: 0, wbtc: 0, eth: 0, eurs: 0, jeur: 0, bal: 0, crv: 0, dpi: 0, ghst: 0, mimatic: 0, maticx: 0, stmatic: 0})
    // cTotal.jeurCollateral = ({aave: 0, ageur: 0, sushi: 0, dai: 0, usdt: 0, link: 0, matic: 0, usdc: 0, wbtc: 0, eth: 0, eurs: 0, jeur: 0, bal: 0, crv: 0, dpi: 0, ghst: 0, mimatic: 0, maticx: 0, stmatic: 0})
    // cTotal.balCollateral = ({aave: 0, ageur: 0, sushi: 0, dai: 0, usdt: 0, link: 0, matic: 0, usdc: 0, wbtc: 0, eth: 0, eurs: 0, jeur: 0, bal: 0, crv: 0, dpi: 0, ghst: 0, mimatic: 0, maticx: 0, stmatic: 0})
    // cTotal.crvCollateral = ({aave: 0, ageur: 0, sushi: 0, dai: 0, usdt: 0, link: 0, matic: 0, usdc: 0, wbtc: 0, eth: 0, eurs: 0, jeur: 0, bal: 0, crv: 0, dpi: 0, ghst: 0, mimatic: 0, maticx: 0, stmatic: 0})
    // cTotal.dpiCollateral = ({aave: 0, ageur: 0, sushi: 0, dai: 0, usdt: 0, link: 0, matic: 0, usdc: 0, wbtc: 0, eth: 0, eurs: 0, jeur: 0, bal: 0, crv: 0, dpi: 0, ghst: 0, mimatic: 0, maticx: 0, stmatic: 0})
    // cTotal.ghstCollateral = ({aave: 0, ageur: 0, sushi: 0, dai: 0, usdt: 0, link: 0, matic: 0, usdc: 0, wbtc: 0, eth: 0, eurs: 0, jeur: 0, bal: 0, crv: 0, dpi: 0, ghst: 0, mimatic: 0, maticx: 0, stmatic: 0})
    // cTotal.mimaticCollateral = ({aave: 0, ageur: 0, sushi: 0, dai: 0, usdt: 0, link: 0, matic: 0, usdc: 0, wbtc: 0, eth: 0, eurs: 0, jeur: 0, bal: 0, crv: 0, dpi: 0, ghst: 0, mimatic: 0, maticx: 0, stmatic: 0})
    // cTotal.maticxCollateral = ({aave: 0, ageur: 0, sushi: 0, dai: 0, usdt: 0, link: 0, matic: 0, usdc: 0, wbtc: 0, eth: 0, eurs: 0, jeur: 0, bal: 0, crv: 0, dpi: 0, ghst: 0, mimatic: 0, maticx: 0, stmatic: 0})
    // cTotal.stmaticCollateral = ({aave: 0, ageur: 0, sushi: 0, dai: 0, usdt: 0, link: 0, matic: 0, usdc: 0, wbtc: 0, eth: 0, eurs: 0, jeur: 0, bal: 0, crv: 0, dpi: 0, ghst: 0, mimatic: 0, maticx: 0, stmatic: 0})
    // colStrings = ['aaveCollateral', 'ageurCollateral', 'sushiCollateral', 'daiCollateral', 'usdtCollateral', 'linkCollateral', 'maticCollateral', 'usdcCollateral', 'wbtcCollateral', 'ethCollateral', 'eursCollateral', 'jeurCollateral', 'balCollateral', 'crvCollateral', 'dpiCollateral', 'ghstCollateral', 'mimaticCollateral', 'maticxCollateral', 'stmaticCollateral']
    // debtStrings = ['aave', 'ageur', 'sushi', 'dai', 'usdt', 'link', 'matic', 'usdc', 'wbtc', 'eth', 'eurs', 'jeur', 'bal', 'crv', 'dpi', 'ghst', 'mimatic', 'maticx', 'stmatic']
    // for(i = 0; i < Object.keys(debt).length; i++) {
    //     for(j = 0; j < colStrings.length; j++) {
    //         for(k = 0; k < debtStrings.length; k++) {
    //             cTotal[colStrings[j]][debtStrings[k]] += rShare[i][debtStrings[j]] * debt[Object.keys(debt)[i]][debtStrings[k]]
    //         }
    //     }
    // }

    console.log("Getting cTotals: Concise")
    // get c_(i,j) total $-value of asset i collateralizing asset j loans 
    cTotal.maticCollateral = ({dai: 0, usdt: 0, usdc: 0})
    cTotal.wbtcCollateral = ({dai: 0, usdt: 0, usdc: 0})
    cTotal.ethCollateral = ({dai: 0, usdt: 0, usdc: 0})
    colStrings = ['maticCollateral', 'wbtcCollateral', 'ethCollateral']
    colStrings2 = ['matic', 'wbtc', 'eth']
    debtStrings = ['dai', 'usdt', 'usdc']
    for(i = 0; i < Object.keys(debt).length; i++) {
        for(j = 0; j < colStrings.length; j++) {
            for(k = 0; k < debtStrings.length; k++) {
                cTotal[colStrings[j]][debtStrings[k]] += rShare[i][colStrings2[j]] * debt[Object.keys(debt)[i]][debtStrings[k]]
            }
        }
    }

    if(COLLATERAL_ASSET == 'aave') {
        collateralPrice = aavePrice
        collateralTokenAddress = aaveTokenAddress
        cTotalCollateral = "aaveCollateral"
    } else if(COLLATERAL_ASSET == 'ageur') {
        collateralPrice = ageurPrice
        collateralTokenAddress = ageurTokenAddress
        cTotalCollateral = "ageurCollateral"
    } else if(COLLATERAL_ASSET == 'sushi') {
        collateralPrice = sushiPrice
        collateralTokenAddress = sushiTokenAddress
        cTotalCollateral = "sushiCollateral"
    } else if(COLLATERAL_ASSET == 'dai') {
        collateralPrice = daiPrice
        collateralTokenAddress = daiTokenAddress
        cTotalCollateral = "daiCollateral"
    } else if(COLLATERAL_ASSET == 'usdt') {
        collateralPrice = usdtPrice
        collateralTokenAddress = usdtTokenAddress
        cTotalCollateral = "usdtCollateral"
    } else if(COLLATERAL_ASSET == 'link') {
        collateralPrice = linkPrice
        collateralTokenAddress = linkTokenAddress
        cTotalCollateral = "linkCollateral"
    } else if(COLLATERAL_ASSET == 'matic') {
        collateralPrice = maticPrice
        collateralTokenAddress = maticTokenAddress
        cTotalCollateral = "maticCollateral"
    } else if(COLLATERAL_ASSET == 'usdc') {
        collateralPrice = usdcPrice
        collateralTokenAddress = usdcTokenAddress
        cTotalCollateral = "usdcCollateral"
    } else if(COLLATERAL_ASSET == 'wbtc') {
        collateralPrice = wbtcPrice
        collateralTokenAddress = wbtcTokenAddress
        cTotalCollateral = "wbtcCollateral"
    } else if(COLLATERAL_ASSET == 'eth') {
        collateralPrice = ethPrice
        collateralTokenAddress = ethTokenAddress
        cTotalCollateral = "ethCollateral"
    } 

    if(DEBT_ASSET == 'aave') {
        debtPrice = aavePrice
        debtTokenAddress = aaveTokenAddress
    } else if(DEBT_ASSET == 'ageur') {
        debtPrice = ageurPrice
        debtTokenAddress = ageurTokenAddress
    } else if(DEBT_ASSET == 'sushi') {
        debtPrice = sushiPrice
        debtTokenAddress = sushiTokenAddress
    } else if(DEBT_ASSET == 'dai') { 
        debtPrice = daiPrice
        debtTokenAddress = daiTokenAddress
    } else if(DEBT_ASSET == 'usdt') {
        debtPrice = usdtPrice
        debtTokenAddress = usdtTokenAddress
    } else if(DEBT_ASSET == 'link') {
        debtPrice = linkPrice
        debtTokenAddress = linkTokenAddress
    } else if(DEBT_ASSET == 'matic') { 
        debtPrice = maticPrice
        debtTokenAddress = maticTokenAddress
    } else if(DEBT_ASSET == 'usdc') { 
        debtPrice = usdcPrice
        debtTokenAddress = usdcTokenAddress
    } else if(DEBT_ASSET == 'wbtc') { 
        debtPrice = wbtcPrice
        debtTokenAddress = wbtcTokenAddress
    } else if(DEBT_ASSET == 'eth') { 
        debtPrice = ethPrice
        debtTokenAddress = ethTokenAddress
    }

    // get liquidity       
    console.log("getting liquidity...") 
    amountIn = 1
    amountOut = null
    let colIn1 = null
    let colIn2 = (1 - (incLoanWeightedAvg[COLLATERAL_ASSET] + ltvLoanWeightedAvg[COLLATERAL_ASSET])) * amountIn * collateralPrice
    let sOut = colIn2 + 1
    while(sOut > colIn2) {
        colIn1 = colIn2
        colIn2 = (1 - (incLoanWeightedAvg[COLLATERAL_ASSET] + ltvLoanWeightedAvg[COLLATERAL_ASSET])) * amountIn * collateralPrice
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
        colIn2 = (1 - (incLoanWeightedAvg[COLLATERAL_ASSET] + ltvLoanWeightedAvg[COLLATERAL_ASSET])) * amountIn * collateralPrice
        result = await axios.get(ONE_INCH_URL + "fromTokenAddress=" + collateralTokenAddress + "&toTokenAddress=" + debtTokenAddress + "&amount=" + web3.utils.toWei(amountIn.toString()))
        amountOut = web3.utils.fromWei(result.data.toTokenAmount.toString())
        sOut = amountOut * debtPrice
        amountIn = amountIn + increment
    }
    let toxicity = cTotal[cTotalCollateral][DEBT_ASSET] / ((colIn1 + colIn2) / 2)
    console.log("toxicity0: " + toxicity)
    console.log("Collateral: " + COLLATERAL_ASSET)
    console.log("Debt: " + DEBT_ASSET)
    console.log("cTotal: " + cTotal[cTotalCollateral][DEBT_ASSET])
    console.log("colIn1: " + colIn1)
    console.log("colIn2: " + colIn2)
    console.log("sOut: " + sOut)

    // get queryId, queryData
    queryDataArgs = abiCoder.encode(["string", "string"], [COLLATERAL_ASSET, DEBT_ASSET])
    queryData = abiCoder.encode(["string", "bytes"], ["LendingPairToxicity", queryDataArgs])
    // keccak256 hash of queryData
    queryId = web3.utils.keccak256(queryData)
    console.log("queryId: " + queryId)
    console.log("queryData: " + queryData)

    await returnToxicity("eth", "dai")
    await returnToxicity("eth", "usdt")
    await returnToxicity("eth", "usdc")
    await returnToxicity("matic", "dai")
    await returnToxicity("matic", "usdt")
    await returnToxicity("matic", "usdc")
    await returnToxicity("wbtc", "dai")
    await returnToxicity("wbtc", "usdt")
    await returnToxicity("wbtc", "usdc")
        
}

async function returnToxicity(_collateralAsset, _debtAsset) {
    COLLATERAL_ASSET = _collateralAsset
    DEBT_ASSET = _debtAsset

    if(COLLATERAL_ASSET == 'aave') {
        collateralPrice = aavePrice
        collateralTokenAddress = aaveTokenAddress
        cTotalCollateral = "aaveCollateral"
    } else if(COLLATERAL_ASSET == 'ageur') {
        collateralPrice = ageurPrice
        collateralTokenAddress = ageurTokenAddress
        cTotalCollateral = "ageurCollateral"
    } else if(COLLATERAL_ASSET == 'sushi') {
        collateralPrice = sushiPrice
        collateralTokenAddress = sushiTokenAddress
        cTotalCollateral = "sushiCollateral"
    } else if(COLLATERAL_ASSET == 'dai') {
        collateralPrice = daiPrice
        collateralTokenAddress = daiTokenAddress
        cTotalCollateral = "daiCollateral"
    } else if(COLLATERAL_ASSET == 'usdt') {
        collateralPrice = usdtPrice
        collateralTokenAddress = usdtTokenAddress
        cTotalCollateral = "usdtCollateral"
    } else if(COLLATERAL_ASSET == 'link') {
        collateralPrice = linkPrice
        collateralTokenAddress = linkTokenAddress
        cTotalCollateral = "linkCollateral"
    } else if(COLLATERAL_ASSET == 'matic') {
        collateralPrice = maticPrice
        collateralTokenAddress = maticTokenAddress
        cTotalCollateral = "maticCollateral"
    } else if(COLLATERAL_ASSET == 'usdc') {
        collateralPrice = usdcPrice
        collateralTokenAddress = usdcTokenAddress
        cTotalCollateral = "usdcCollateral"
    } else if(COLLATERAL_ASSET == 'wbtc') {
        collateralPrice = wbtcPrice
        collateralTokenAddress = wbtcTokenAddress
        cTotalCollateral = "wbtcCollateral"
    } else if(COLLATERAL_ASSET == 'eth') {
        collateralPrice = ethPrice
        collateralTokenAddress = ethTokenAddress
        cTotalCollateral = "ethCollateral"
    } 

    if(DEBT_ASSET == 'aave') {
        debtPrice = aavePrice
        debtTokenAddress = aaveTokenAddress
    } else if(DEBT_ASSET == 'ageur') {
        debtPrice = ageurPrice
        debtTokenAddress = ageurTokenAddress
    } else if(DEBT_ASSET == 'sushi') {
        debtPrice = sushiPrice
        debtTokenAddress = sushiTokenAddress
    } else if(DEBT_ASSET == 'dai') { 
        debtPrice = daiPrice
        debtTokenAddress = daiTokenAddress
    } else if(DEBT_ASSET == 'usdt') {
        debtPrice = usdtPrice
        debtTokenAddress = usdtTokenAddress
    } else if(DEBT_ASSET == 'link') {
        debtPrice = linkPrice
        debtTokenAddress = linkTokenAddress
    } else if(DEBT_ASSET == 'matic') { 
        debtPrice = maticPrice
        debtTokenAddress = maticTokenAddress
    } else if(DEBT_ASSET == 'usdc') { 
        debtPrice = usdcPrice
        debtTokenAddress = usdcTokenAddress
    } else if(DEBT_ASSET == 'wbtc') { 
        debtPrice = wbtcPrice
        debtTokenAddress = wbtcTokenAddress
    } else if(DEBT_ASSET == 'eth') { 
        debtPrice = ethPrice
        debtTokenAddress = ethTokenAddress
    }

    // get liquidity
    console.log("")       
    console.log("getting liquidity...") 
    amountIn = 1
    amountOut = null
    let colIn1 = null
    let colIn2 = (1 - (incLoanWeightedAvg[COLLATERAL_ASSET] + ltvLoanWeightedAvg[COLLATERAL_ASSET])) * amountIn * collateralPrice
    let sOut = colIn2 + 1
    while(sOut > colIn2) {
        colIn1 = colIn2
        colIn2 = (1 - (incLoanWeightedAvg[COLLATERAL_ASSET] + ltvLoanWeightedAvg[COLLATERAL_ASSET])) * amountIn * collateralPrice
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
        colIn2 = (1 - (incLoanWeightedAvg[COLLATERAL_ASSET] + ltvLoanWeightedAvg[COLLATERAL_ASSET])) * amountIn * collateralPrice
        result = await axios.get(ONE_INCH_URL + "fromTokenAddress=" + collateralTokenAddress + "&toTokenAddress=" + debtTokenAddress + "&amount=" + web3.utils.toWei(amountIn.toString()))
        amountOut = web3.utils.fromWei(result.data.toTokenAmount.toString())
        sOut = amountOut * debtPrice
        amountIn = amountIn + increment
    }
    let toxicity = cTotal[cTotalCollateral][DEBT_ASSET] * sampleFraction / ((colIn1 + colIn2) / 2)
    console.log("toxicity0: " + toxicity)
    console.log("Collateral: " + COLLATERAL_ASSET)
    console.log("Debt: " + DEBT_ASSET)
    console.log("cTotal: " + cTotal[cTotalCollateral][DEBT_ASSET])
    console.log("colIn1: " + colIn1)
    console.log("colIn2: " + colIn2)
    console.log("sOut: " + sOut)
    console.log("sampleFraction: " + sampleFraction)

    // get queryId, queryData
    queryDataArgs = abiCoder.encode(["string", "string"], [COLLATERAL_ASSET, DEBT_ASSET])
    queryData = abiCoder.encode(["string", "bytes"], ["LendingPairToxicity", queryDataArgs])
    // keccak256 hash of queryData
    queryId = web3.utils.keccak256(queryData)
    console.log("queryId: " + queryId)
    console.log("queryData: " + queryData)

    toxResults = {}
    toxResults["queryId"] = queryId
    toxResults["queryData"] = queryData
    toxResults["toxicity"] = toxicity
    toxResults["collateralAsset"] = COLLATERAL_ASSET
    toxResults["debtAsset"] = DEBT_ASSET
    toxResults["cTotal"] = cTotal[cTotalCollateral][DEBT_ASSET]
    toxResults["colIn1"] = colIn1
    toxResults["colIn2"] = colIn2
    toxResults["colInAvg"] = (colIn1 + colIn2) / 2
    toxResults["sOut"] = sOut
    toxResults["sampleFraction"] = sampleFraction

    fs.writeFile("./scripts/data/results_" + COLLATERAL_ASSET + "_" + DEBT_ASSET + ".json", JSON.stringify(toxResults), err => {
        if (err) {
            console.error(err)
            return
        }
    })
}

function queryBalances(lastID) {
    let _query = `
    query {
        balances(first: 1000, where:{ id_gt: "` + lastID + `"}) {
            id
            contract
            owner
            protocol
            balance
        }     
    }
    `
    return _query
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});