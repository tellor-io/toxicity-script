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
const API_URL = "https://api.thegraph.com/subgraphs/id/QmZpeKvRGbiMH6dfsJjTWXZDBxRN4z8BU3iyHe6UfKr4Dv"
const client = createClient({ url: API_URL });
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

const fraxTokenAddress = "0x45c32fA6DF82ead1e2EF74d17b76547EDdFaFF89";

let aavePrice = 68.48
let ageurPrice = 1.01
let balPrice = 3
let crvPrice = 4
let daiPrice = 1
let dpiPrice = 6
let ethPrice = 1296
let eursPrice = 8
let ghstPrice = 0
let fraxPrice = 0
let jeurPrice = 0
let linkPrice = 7.22
let maticPrice = 1.10
let sushiPrice = 1.27
let usdcPrice = 1
let usdtPrice = 1
let wbtcPrice = 17543

let collateral = {}
let ethCollateral = []
let daiCollateral = []
let usdcCollateral = []
let usdtCollateral = []
let fraxCollateral = []
let wbtcCollateral = []
let maticCollateral = []
let linkCollateral = []

let aaveCollateral = []
let ageurCollateral = []
let sushiCollateral = []

let debt = {}
let ethDebt = []
let daiDebt = []
let usdcDebt = []
let usdtDebt = []
let fraxDebt = []
let wbtcDebt = []
let maticDebt = []
let linkDebt = []

let aaveDebt = []
let ageurDebt = []
let sushiDebt = []

const aaveLtvAave = 0.97
const ageurLtvAave = 0.97
const sushiLtvAave = 0.97
const daiLtvAave = 0.97
const usdtLtvAave = 0.97
const linkLtvAave = 0.97
const maticLtvAave = 0.97
const usdcLtvAave = 0.97
const wbtcLtvAave = 0.97
const ethLtvAave = 0.97

const aaveIncAave = 1.02 - 1
const ageurIncAave = 1.02 - 1
const sushiIncAave = 1.02 - 1
const daiIncAave = 1.02 - 1
const usdtIncAave = 1.02 - 1
const linkIncAave = 1.02 - 1
const maticIncAave = 1.02 - 1
const usdcIncAave = 1.02 - 1
const wbtcIncAave = 1.02 - 1
const ethIncAave = 1.02 - 1

let rShare = []
let LByAsset = null
let incLoanWeightedAvg = null
let ltvLoanWeightedAvg = null
let cTotal = []

async function main(_nodeURL) {
    // get prices
    // await getPrices()

    // // get all transfer events from the graph
    // let txTransfers = await fetchTransfers2()
    let txBalances = await fetchBalances()

    // // // separate the addresses into different arrays based on token
    // // parseTransfersAndMints(txTransfers, txMints)
    // parseTransfers2(txTransfers)
    parseBalances(txBalances)

    // // // // get the balance of each address and hToken exchange rates
    // // // await getSnapshots()
    // await getSnapshots2()

    // // // // get toxicity
    await getToxicity2()
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
    // result = await axios.get(COINGECKO_API_PART1 + "eurs" + COINGECKO_API_PART2)
    // eursPrice = result.data.eurs.usd

    // crv
    // result = await axios.get(COINGECKO_API_PART1 + "crv" + COINGECKO_API_PART2)
    // crvPrice = result.data.crv.usd

    // sushi
    result = await axios.get(COINGECKO_API_PART1 + "sushi" + COINGECKO_API_PART2)
    sushiPrice = result.data.sushi.usd

    // ghst
    // result = await axios.get(COINGECKO_API_PART1 + "ghst" + COINGECKO_API_PART2)
    // ghstPrice = result.data.ghst.usd

    // jeur
    // result = await axios.get(COINGECKO_API_PART1 + "jeur" + COINGECKO_API_PART2)
    // jeurPrice = result.data.jeur.usd

    // dpi 
    // result = await axios.get(COINGECKO_API_PART1 + "dpi" + COINGECKO_API_PART2)
    // dpiPrice = result.data.dpi.usd

    // bal
    // result = await axios.get(COINGECKO_API_PART1 + "bal" + COINGECKO_API_PART2)
    // balPrice = result.data.bal.usd
}

async function fetchBalances() {
    console.log("fetching balances...")
    let responseBalances = await client.query(queryBalances('')).toPromise()
    let responseAllBalances = []

    while(responseBalances.data.balances.length > 0) {
        responseAllBalances = responseAllBalances.concat(responseBalances.data.balances);
        lastID = responseBalances.data.balances[responseBalances.data.balances.length - 1].id
        responseBalances = await client.query(queryBalances(lastID)).toPromise()
    }

    return responseAllBalances
}

function parseBalances(txBalances) {
    console.log("Parsing balances...")
    // for(let i=0; i<txBalances.length; i++) {
    for(let i=0; i<5000; i++) {
        // console.log(i)
        if(txBalances[i].protocol == 'aavePolygon') {
            // console.log("this protocol is aavePolygon")
            thisOwner = txBalances[i].owner.toLowerCase()
            // console.log("owner found")
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
            }

            if(txBalances[i].contract.toLowerCase() == aAaveAddress.toLowerCase()) {
                collateral[thisOwner].aave += Number(txBalances[i].balance)
            } else if(txBalances[i].contract.toLowerCase() == aAgeurAddress.toLowerCase()) {
                collateral[thisOwner].ageur += Number(txBalances[i].balance)
            } else if(txBalances[i].contract.toLowerCase() == aSushiAddress.toLowerCase()) {
                collateral[thisOwner].sushi += Number(txBalances[i].balance)
            } else if(txBalances[i].contract.toLowerCase() == aDaiAddress.toLowerCase()) {
                collateral[thisOwner].dai += Number(txBalances[i].balance)
            } else if(txBalances[i].contract.toLowerCase() == aUsdtAddress.toLowerCase()) {
                collateral[thisOwner].usdt += Number(txBalances[i].balance)
            } else if(txBalances[i].contract.toLowerCase() == aLinkAddress.toLowerCase()) {
                collateral[thisOwner].link += Number(txBalances[i].balance)
            } else if(txBalances[i].contract.toLowerCase() == aWmaticAddress.toLowerCase()) {
                collateral[thisOwner].matic += Number(txBalances[i].balance)
            } else if(txBalances[i].contract.toLowerCase() == aUsdcAddress.toLowerCase()) {
                collateral[thisOwner].usdc += Number(txBalances[i].balance)
            } else if(txBalances[i].contract.toLowerCase() == aWbtcAddress.toLowerCase()) {
                collateral[thisOwner].wbtc += Number(txBalances[i].balance)
            } else if(txBalances[i].contract.toLowerCase() == aWethAddress.toLowerCase()) {
                collateral[thisOwner].eth += Number(txBalances[i].balance)
            } else if(txBalances[i].contract.toLowerCase() == aAaveSDebtAddress.toLowerCase()) {
                debt[thisOwner].aave += Number(txBalances[i].balance)
            } else if(txBalances[i].contract.toLowerCase() == aAaveVDebtAddress.toLowerCase()) {
                debt[thisOwner].aave += Number(txBalances[i].balance)
            } else if(txBalances[i].contract.toLowerCase() == aAgeurSDebtAddress.toLowerCase()) {
                debt[thisOwner].ageur += Number(txBalances[i].balance)
            } else if(txBalances[i].contract.toLowerCase() == aAgeurVDebtAddress.toLowerCase()) { 
                debt[thisOwner].ageur += Number(txBalances[i].balance)
            } else if(txBalances[i].contract.toLowerCase() == aSushiSDebtAddress.toLowerCase()) {
                debt[thisOwner].sushi += Number(txBalances[i].balance)
            } else if(txBalances[i].contract.toLowerCase() == aSushiVDebtAddress.toLowerCase()) {
                debt[thisOwner].sushi += Number(txBalances[i].balance)
            } else if(txBalances[i].contract.toLowerCase() == aDaiSDebtAddress.toLowerCase()) { 
                debt[thisOwner].dai += Number(txBalances[i].balance)
            } else if(txBalances[i].contract.toLowerCase() == aDaiVDebtAddress.toLowerCase()) { 
                debt[thisOwner].dai += Number(txBalances[i].balance)
            } else if(txBalances[i].contract.toLowerCase() == aUsdtSDebtAddress.toLowerCase()) { 
                debt[thisOwner].usdt += Number(txBalances[i].balance)
            } else if(txBalances[i].contract.toLowerCase() == aUsdtVDebtAddress.toLowerCase()) { 
                debt[thisOwner].usdt += Number(txBalances[i].balance)
            } else if(txBalances[i].contract.toLowerCase() == aLinkSDebtAddress.toLowerCase()) { 
                debt[thisOwner].link += Number(txBalances[i].balance)
            } else if(txBalances[i].contract.toLowerCase() == aLinkVDebtAddress.toLowerCase()) { 
                debt[thisOwner].link += Number(txBalances[i].balance)
            } else if(txBalances[i].contract.toLowerCase() == aWmaticSDebtAddress.toLowerCase()) { 
                debt[thisOwner].matic += Number(txBalances[i].balance)
            } else if(txBalances[i].contract.toLowerCase() == aWmaticVDebtAddress.toLowerCase()) { 
                debt[thisOwner].matic += Number(txBalances[i].balance)
            } else if(txBalances[i].contract.toLowerCase() == aUsdcSDebtAddress.toLowerCase()) { 
                debt[thisOwner].usdc += Number(txBalances[i].balance)
            } else if(txBalances[i].contract.toLowerCase() == aUsdcVDebtAddress.toLowerCase()) {    
                debt[thisOwner].usdc += Number(txBalances[i].balance)
            } else if(txBalances[i].contract.toLowerCase() == aWbtcSDebtAddress.toLowerCase()) { 
                debt[thisOwner].wbtc += Number(txBalances[i].balance)
            } else if(txBalances[i].contract.toLowerCase() == aWbtcVDebtAddress.toLowerCase()) { 
                debt[thisOwner].wbtc += Number(txBalances[i].balance)
            } else if(txBalances[i].contract.toLowerCase() == aWethSDebtAddress.toLowerCase()) { 
                debt[thisOwner].eth += Number(txBalances[i].balance)
            } else if(txBalances[i].contract.toLowerCase() == aWethVDebtAddress.toLowerCase()) { 
                debt[thisOwner].eth += Number(txBalances[i].balance)
            } else { 
                console.log("Unknown contract: {}", [txBalances[i].contract])
            }
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

        console.log("Found " + Object.keys(collateral).length + " unique user addresses with balances")
}

async function getToxicity2() {
    // get L^qP -- total $-value of assets owed by user q on platform P
    console.log("getting L^qP")
    for(i = 0; i < Object.keys(debt).length; i++) {
        debt[Object.keys(debt)[i]].L = debt[Object.keys(debt)[i]].aave + debt[Object.keys(debt)[i]].ageur + debt[Object.keys(debt)[i]].sushi + debt[Object.keys(debt)[i]].dai + debt[Object.keys(debt)[i]].usdt + debt[Object.keys(debt)[i]].link + debt[Object.keys(debt)[i]].matic + debt[Object.keys(debt)[i]].usdc + debt[Object.keys(debt)[i]].wbtc + debt[Object.keys(debt)[i]].eth
        // console.log(i)
    }

    // get r_i^qP -- share of loans collateralized by asset i owned by user q on platform P
    console.log("getting r_i^qP")
    for(i = 0; i < Object.keys(collateral).length; i++) {
        let denominator = aaveLtvAave * collateral[Object.keys(collateral)[i]].aave + ageurLtvAave * collateral[Object.keys(collateral)[i]].ageur + sushiLtvAave * collateral[Object.keys(collateral)[i]].sushi + daiLtvAave * collateral[Object.keys(collateral)[i]].dai + usdtLtvAave * collateral[Object.keys(collateral)[i]].usdt + linkLtvAave * collateral[Object.keys(collateral)[i]].link + maticLtvAave * collateral[Object.keys(collateral)[i]].matic + usdcLtvAave * collateral[Object.keys(collateral)[i]].usdc + wbtcLtvAave * collateral[Object.keys(collateral)[i]].wbtc + ethLtvAave * collateral[Object.keys(collateral)[i]].eth
        rAave = collateral[Object.keys(collateral)[i]].aave * aaveLtvAave / denominator
        rAgeur = collateral[Object.keys(collateral)[i]].ageur * ageurLtvAave / denominator
        rSushi = collateral[Object.keys(collateral)[i]].sushi * sushiLtvAave / denominator
        rDai = collateral[Object.keys(collateral)[i]].dai * daiLtvAave / denominator
        rUsdt = collateral[Object.keys(collateral)[i]].usdt * usdtLtvAave / denominator
        rLink = collateral[Object.keys(collateral)[i]].link * linkLtvAave / denominator
        rMatic = collateral[Object.keys(collateral)[i]].matic * maticLtvAave / denominator
        rUsdc = collateral[Object.keys(collateral)[i]].usdc * usdcLtvAave / denominator
        rWbtc = collateral[Object.keys(collateral)[i]].wbtc * wbtcLtvAave / denominator
        rEth = collateral[Object.keys(collateral)[i]].eth * ethLtvAave / denominator

        if(isNaN(rAave)) {
            rAave = 0
        }
        if(isNaN(rAgeur)) {
            rAgeur = 0
        }
        if(isNaN(rSushi)) {
            rSushi = 0
        }
        if(isNaN(rDai)) {
            rDai = 0
        }
        if(isNaN(rUsdt)) {
            rUsdt = 0
        }
        if(isNaN(rLink)) {
            rLink = 0
        }
        if(isNaN(rMatic)) {
            rMatic = 0
        }
        if(isNaN(rUsdc)) {
            rUsdc = 0
        }
        if(isNaN(rWbtc)) {
            rWbtc = 0
        }
        if(isNaN(rEth)) {
            rEth = 0
        }
        
        rShare.push({address: Object.keys(collateral)[i], aave: rAave, ageur: rAgeur, sushi: rSushi, dai: rDai, usdt: rUsdt, link: rLink, matic: rMatic, usdc: rUsdc, wbtc: rWbtc, eth: rEth})
    }

    console.log("getting LByAsset")
    LByAsset = {aave: 0, ageur: 0, sushi: 0, dai: 0, usdt: 0, link: 0, matic: 0, usdc: 0, wbtc: 0, eth: 0}
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
    }

    // get inc loan weighted average
    incLoanWeightedAvg = {aave: 0, ageur: 0, sushi: 0, dai: 0, usdt: 0, link: 0, matic: 0, usdc: 0, wbtc: 0, eth: 0}
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

    // get LTV loan weighted average
    ltvLoanWeightedAvg = {aave: 0, ageur: 0, sushi: 0, dai: 0, usdt: 0, link: 0, matic: 0, usdc: 0, wbtc: 0, eth: 0}
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

    console.log("Getting cTotals")
    // get c_(i,j) total $-value of asset i collateralizing asset j loans 
    cTotal.aaveCollateral = ({aave: 0, ageur: 0, sushi: 0, dai: 0, usdt: 0, link: 0, matic: 0, usdc: 0, wbtc: 0, eth: 0})
    cTotal.ageurCollateral = ({aave: 0, ageur: 0, sushi: 0, dai: 0, usdt: 0, link: 0, matic: 0, usdc: 0, wbtc: 0, eth: 0})
    cTotal.sushiCollateral = ({aave: 0, ageur: 0, sushi: 0, dai: 0, usdt: 0, link: 0, matic: 0, usdc: 0, wbtc: 0, eth: 0})
    cTotal.daiCollateral = ({aave: 0, ageur: 0, sushi: 0, dai: 0, usdt: 0, link: 0, matic: 0, usdc: 0, wbtc: 0, eth: 0})
    cTotal.usdtCollateral = ({aave: 0, ageur: 0, sushi: 0, dai: 0, usdt: 0, link: 0, matic: 0, usdc: 0, wbtc: 0, eth: 0})
    cTotal.linkCollateral = ({aave: 0, ageur: 0, sushi: 0, dai: 0, usdt: 0, link: 0, matic: 0, usdc: 0, wbtc: 0, eth: 0})
    cTotal.maticCollateral = ({aave: 0, ageur: 0, sushi: 0, dai: 0, usdt: 0, link: 0, matic: 0, usdc: 0, wbtc: 0, eth: 0})
    cTotal.usdcCollateral = ({aave: 0, ageur: 0, sushi: 0, dai: 0, usdt: 0, link: 0, matic: 0, usdc: 0, wbtc: 0, eth: 0})
    cTotal.wbtcCollateral = ({aave: 0, ageur: 0, sushi: 0, dai: 0, usdt: 0, link: 0, matic: 0, usdc: 0, wbtc: 0, eth: 0})
    cTotal.ethCollateral = ({aave: 0, ageur: 0, sushi: 0, dai: 0, usdt: 0, link: 0, matic: 0, usdc: 0, wbtc: 0, eth: 0})
    colStrings = ['aaveCollateral', 'ageurCollateral', 'sushiCollateral', 'daiCollateral', 'usdtCollateral', 'linkCollateral', 'maticCollateral', 'usdcCollateral', 'wbtcCollateral', 'ethCollateral']
    debtStrings = ['aave', 'ageur', 'sushi', 'dai', 'usdt', 'link', 'matic', 'usdc', 'wbtc', 'eth']
    for(i = 0; i < Object.keys(debt).length; i++) {
        for(j = 0; j < colStrings.length; j++) {
            for(k = 0; k < debtStrings.length; k++) {
                cTotal[colStrings[j]][debtStrings[k]] += rShare[i][debtStrings[k]] * debt[Object.keys(debt)[i]][debtStrings[j]]
                if(rShare[i][debtStrings[k]] * debt[Object.keys(debt)[i]][debtStrings[j]] > 0) {
                    console.log("nonzero cTotal")
                }

                if(debt[Object.keys(debt)[i]][debtStrings[j]] > 0) {
                    console.log("nonzero debt: " + Object.keys(debt)[i] + " " + debtStrings[j])
                }
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
    console.log("here0")
    let colIn2 = incLoanWeightedAvg[COLLATERAL_ASSET] + ltvLoanWeightedAvg[COLLATERAL_ASSET] * amountIn * collateralPrice
    console.log("here1")
    let sOut = colIn2 + 1
    while(sOut > colIn2) {
        colIn1 = colIn2
        console.log("here2")
        colIn2 = (incLoanWeightedAvg[COLLATERAL_ASSET] + ltvLoanWeightedAvg[COLLATERAL_ASSET]) * amountIn * collateralPrice
        console.log("here3")
        result = await axios.get(ONE_INCH_URL + "fromTokenAddress=" + collateralTokenAddress + "&toTokenAddress=" + debtTokenAddress + "&amount=" + web3.utils.toWei(amountIn.toString()))
        console.log("here4")
        amountOut = web3.utils.fromWei(result.data.toTokenAmount.toString())
        console.log("here5")
        sOut = amountOut * debtPrice
        console.log("here6")
        amountIn = amountIn * 2
        console.log("here7")
    }
    console.log("here8")
    amountIn = amountIn / 4
    console.log("here9")
    increment = amountIn / 10
    console.log("here10")
    amountIn = amountIn + increment
    console.log("here11")
    colIn2 = colIn1
    console.log("here12")
    while(sOut > colIn2) {
        console.log("here13")
        colIn1 = colIn2
        console.log("here14")
        colIn2 = (incLoanWeightedAvg[COLLATERAL_ASSET] + ltvLoanWeightedAvg[COLLATERAL_ASSET]) * amountIn * collateralPrice
        console.log("here15")
        result = await axios.get(ONE_INCH_URL + "fromTokenAddress=" + collateralTokenAddress + "&toTokenAddress=" + debtTokenAddress + "&amount=" + web3.utils.toWei(amountIn.toString()))
        console.log("here16")
        amountOut = web3.utils.fromWei(result.data.toTokenAmount.toString())
        console.log("here17")
        sOut = amountOut * debtPrice
        console.log("here18")
        amountIn = amountIn + increment
        console.log("here19")
    }
    console.log("here20")
    let toxicity = cTotal[cTotalCollateral][DEBT_ASSET] / ((colIn1 + colIn2) / 2)
    console.log("toxicity0: " + toxicity)
    console.log("Collateral: " + COLLATERAL_ASSET)
    console.log("Debt: " + DEBT_ASSET)
    console.log("toxicity1: ", cTotal[cTotalCollateral][DEBT_ASSET] / (colIn1 + colIn2) / 2)

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