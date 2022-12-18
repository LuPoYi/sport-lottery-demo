import { useEffect, useState } from "react"

import Button from "@mui/material/Button"
import Head from "next/head"
import TextField from "@mui/material/TextField"
import {
  approveToken,
  betBlue,
  betRed,
  getBettingEndTime,
  getBettingToken,
  getBlueBetting,
  getBlueOdds,
  getBluePlayer,
  getEstimateMatchEndTime,
  getOwner,
  getRedBetting,
  getRedOdds,
  getRedPlayer,
  getWinner,
} from "../utils/interact"
import { ethers } from "ethers"
import { injected } from "../components/wallet/connectors"
import styles from "../styles/Home.module.css"
import { useWeb3React } from "@web3-react/core"

export default function Home() {
  const [blueBet, setBlueBet] = useState(0.1)
  const [redBet, setRedBet] = useState(0.1)

  const [gameInfo, setGameInfo] = useState({
    red: {
      player: [],
      odds: "",
      betting: "",
    },
    blue: {
      player: [],
      odds: "",
      betting: "",
    },
    bettingEndTime: "",
    bettingToken: "",
    estimateMatchEndTime: "",
    owner: "",
  })

  const { active, account, activate, deactivate } = useWeb3React()
  const handleConnectWalletOnClick = async () => {
    try {
      await activate(injected)
    } catch (ex) {
      console.log("ex", ex)
    }
  }
  const handleDisconnectWalletOnClick = async () => {
    try {
      deactivate()
    } catch (ex) {
      console.log(ex)
    }
  }

  const handleBetOnClick = async (team: string, amount: string) => {
    await approveToken(amount, account)
    if (team === "red") {
      await betRed(amount, account)
    } else {
      await betBlue(amount, account)
    }
  }

  useEffect(() => {
    const init = async () => {
      try {
        const blueBetting = ethers.utils.formatUnits(await getBlueBetting(), 6)
        const blueOdds = ethers.utils.formatUnits(await getBlueOdds(), 18)
        const bluePlayer = await getBluePlayer()
        const redBetting = ethers.utils.formatUnits(await getRedBetting(), 6)
        const redOdds = ethers.utils.formatUnits(await getRedOdds(), 18)
        const redPlayer = await getRedPlayer()
        const bettingEndTime = await getBettingEndTime()
        const bettingToken = await getBettingToken()
        const estimateMatchEndTime = await getEstimateMatchEndTime()
        const owner = await getOwner()
        const winner = await getWinner()

        setGameInfo({
          blue: { betting: blueBetting, odds: blueOdds, player: bluePlayer },
          red: {
            betting: redBetting,
            odds: redOdds,
            player: redPlayer,
          },
          bettingEndTime: bettingEndTime,
          bettingToken: bettingToken,
          estimateMatchEndTime: estimateMatchEndTime,

          owner: owner,
        })
      } catch (error) {
        console.error("error2", error)
      }
    }

    init()
  }, [])

  const franceIcon = () => {
    return <img src="/france.png" alt="france" width="20px" />
  }

  const argentinaIcon = () => {
    return <img src="/argentina.png" alt="france" width="20px" />
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Sport Lottery Demo</title>
        <meta name="description" content="Sport Lottery Demo" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <img className={styles.containerBg} src="/wfc.jpg" alt="" />
      <main className={styles.main}>
        <div className={styles.mainContent}>
          <h1>2022 World Cup Demo</h1>
          {/* Connect Wallet */}
          <div>
            {active ? (
              <Button
                variant="contained"
                size="small"
                onClick={handleDisconnectWalletOnClick}
              >
                Disconnect {account}
              </Button>
            ) : (
              <Button
                variant="contained"
                size="small"
                onClick={handleConnectWalletOnClick}
              >
                Connect Wallet
              </Button>
            )}
          </div>
        </div>

        {/* Main Function */}
        <div className={styles.contractInfo}>
          <h3>Contract Info:</h3>
          <p>Network: Polygon</p>
          <p>
            Contract:{" "}
            <a href="https://polygonscan.com/address/0xba688bf8e0dea1acd5d9746e8118da778767e3da">
              0xba688bf8e0dea1acd5d9746e8118da778767e3da
            </a>
          </p>
          <p>
            USDC Token:
            <a href="https://polygonscan.com/token/0x2791bca1f2de4661ed88a30c99a7a9449aa84174">
              0x2791bca1f2de4661ed88a30c99a7a9449aa84174
            </a>
          </p>
          <p>
            {`投注結束時間: ${
              gameInfo?.bettingEndTime &&
              new Date(Number(gameInfo.bettingEndTime) * 1000)
            }`}
          </p>
          <p>
            {`預計開獎時間: ${
              gameInfo?.estimateMatchEndTime &&
              new Date(Number(gameInfo.estimateMatchEndTime) * 1000)
            }`}
          </p>
        </div>

        <div className={styles.betInfo}>
          <div className="red">
            <h3>France</h3>
            <p>Current Bet Pool: {gameInfo?.red?.betting} USDC</p>
            <p>Odds: {gameInfo?.red?.odds}</p>

            <TextField
              hiddenLabel
              type="number"
              size="small"
              variant="filled"
              InputLabelProps={{ shrink: true }}
              value={redBet}
              style={{ minWidth: 120 }}
              inputProps={{ step: "0.1", min: 0, max: 10 }}
              onChange={(e) => setRedBet(Number(e?.target?.value))}
            />
            <Button
              variant="contained"
              startIcon={franceIcon()}
              onClick={() =>
                account && handleBetOnClick("red", redBet.toString())
              }
            >
              Bet {redBet} USDC France
            </Button>
          </div>
          <div className="blue">
            <h3>Argentina</h3>
            <p>Current Bet Pool: {gameInfo?.blue?.betting} USDC</p>
            <p>Odds: {gameInfo?.blue?.odds}</p>

            <TextField
              hiddenLabel
              type="number"
              size="small"
              variant="filled"
              InputLabelProps={{ shrink: true }}
              value={blueBet}
              style={{ minWidth: 120 }}
              inputProps={{
                step: "0.1",
                min: 0,
                max: 10,
              }}
              onChange={(e) => setBlueBet(Number(e?.target?.value))}
            />
            <Button
              variant="contained"
              startIcon={argentinaIcon()}
              onClick={() =>
                account && handleBetOnClick("blue", blueBet.toString())
              }
            >
              Bet {blueBet} USDC Argentina
            </Button>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>Powered by Albert & Bob</footer>
    </div>
  )
}
