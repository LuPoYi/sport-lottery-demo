import { config } from "../dapp.config"
import { ethers } from "ethers"

const { createAlchemyWeb3 } = require("@alch/alchemy-web3")

const web3 = createAlchemyWeb3(process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL)

const contract = require("../contracts/BetWorldCup.json")
const betContract = new web3.eth.Contract(contract.abi, config.contractAddress)

const contract2 = require("../contracts/WCShareToken.json")
const tokenContract = new web3.eth.Contract(
  contract2.abi,
  config.BettingTokenContractAddress
)

export const getWinner = async () => await betContract.methods.winner().call()
export const getBettingEndTime = async () =>
  await betContract.methods.bettingEndTime().call()
export const getBettingToken = async () =>
  await betContract.methods.bettingToken().call()
export const getBlueBetting = async () =>
  await betContract.methods.blueBetting().call()
export const getBlueOdds = async () =>
  await betContract.methods.blueOdds().call()
export const getBluePlayer = async () =>
  await betContract.methods.bluePlayer().call()
export const getEstimateMatchEndTime = async () =>
  await betContract.methods.estimateMatchEndTime().call()
export const getMatchResultSubmitted = async () =>
  await betContract.methods.matchResultSubmitted().call()
export const getOwner = async () => await betContract.methods.owner().call()
export const getRedBetting = async () =>
  await betContract.methods.redBetting().call()
export const getRedOdds = async () => await betContract.methods.redOdds().call()
export const getRedPlayer = async () =>
  await betContract.methods.redPlayer().call()

export const betBlue = async (amount: any, address: any) => {
  await betContract.methods
    .betBlue(ethers.utils.parseUnits(amount, 6))
    .send({ from: address })
    .on("receipt", function () {
      console.log("Hi")
    })
}

export const betRed = async (amount: any, address: any) => {
  await betContract.methods
    .betRed(ethers.utils.parseUnits(amount, 6))
    .send({ from: address })
    .on("receipt", function () {
      console.log("Hi")
    })
}

export const approveToken = async (amount: any, address: any) => {
  console.log(
    "amount",
    amount,
    "address",
    address,
    ethers.utils.parseUnits(amount, 6)
  )
  await tokenContract.methods
    .approve(config.contractAddress, ethers.utils.parseUnits(amount, 6))
    .send({ from: address })
}
