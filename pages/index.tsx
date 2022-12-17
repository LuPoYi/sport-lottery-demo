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
  getMatchResultSubmitted,
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
  const [blueBet, setBlueBet] = useState(1)
  const [redBet, setRedBet] = useState(1)
  const [winner, setWinner] = useState()
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
    matchResultSubmitted: "",
    owner: "",
    winner: "",
  })

  const { active, account, library, chainId, activate, deactivate } =
    useWeb3React()
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
      setWinner(await getWinner())

      const blueBetting = ethers.utils.formatUnits(await getBlueBetting(), 18)
      const blueOdds = ethers.utils.formatUnits(await getBlueOdds(), 18)
      const bluePlayer = await getBluePlayer()
      const redBetting = ethers.utils.formatUnits(await getRedBetting())
      const redOdds = ethers.utils.formatUnits(await getRedOdds())
      const redPlayer = await getRedPlayer()
      const bettingEndTime = await getBettingEndTime()
      const bettingToken = await getBettingToken()
      const estimateMatchEndTime = await getEstimateMatchEndTime()
      const matchResultSubmitted = await getMatchResultSubmitted()
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
        matchResultSubmitted: matchResultSubmitted,
        owner: owner,
        winner: winner,
      })
    }

    init()
  }, [])

  console.log("winnder", winner)
  console.log("gameInfo", gameInfo)

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

      <main className={styles.main}>
        <div>
          <h2>Sport Lottery Demo</h2>
          {/* Connect Wallet */}
          <div>
            {active ? (
              <Button
                variant="outlined"
                size="small"
                onClick={handleDisconnectWalletOnClick}
              >
                Disconnect Wallet
              </Button>
            ) : (
              <Button
                variant="outlined"
                size="small"
                onClick={handleConnectWalletOnClick}
              >
                Connect Wallet
              </Button>
            )}
          </div>
        </div>

        {/* Main Function */}
        <hr />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            wordBreak: "break-all",
          }}
        >
          <div className="red">
            <h3>France</h3>
            <p>betting: {gameInfo?.red?.betting}</p>
            <p>odds: {gameInfo?.red?.odds}</p>
            {/* <p>
              player:
              {gameInfo?.red?.player && JSON.stringify(gameInfo.red.player)}
            </p> */}

            <TextField
              hiddenLabel
              type="number"
              size="small"
              variant="filled"
              InputLabelProps={{ shrink: true }}
              onChange={(e) => setRedBet(Number(e?.target?.value))}
            />
            <Button
              variant="contained"
              startIcon={franceIcon()}
              onClick={() => handleBetOnClick("red", redBet.toString())}
            >
              Bet {redBet} France
            </Button>
          </div>
          <div className="blue">
            <h3>Argentina</h3>
            <p>betting: {gameInfo?.blue?.betting}</p>
            <p>odds: {gameInfo?.blue?.odds}</p>
            {/* <p>
              player:
              {gameInfo?.blue?.player && JSON.stringify(gameInfo.blue.player)}
            </p> */}

            <TextField
              hiddenLabel
              type="number"
              size="small"
              variant="filled"
              InputLabelProps={{ shrink: true }}
              onChange={(e) => setBlueBet(Number(e?.target?.value))}
            />
            <Button
              variant="contained"
              startIcon={argentinaIcon()}
              onClick={() => handleBetOnClick("blue", blueBet.toString())}
            >
              Bet {blueBet} Argentina
            </Button>
          </div>
        </div>
        <div>
          <p>bettingToken: {gameInfo?.bettingToken}</p>
          <p>
            {`bettingEndTime: ${
              gameInfo?.bettingEndTime &&
              new Date(Number(gameInfo.bettingEndTime) * 1000)
            }`}
          </p>
          <p>
            {`estimateMatchEndTime: ${
              gameInfo?.estimateMatchEndTime &&
              new Date(Number(gameInfo.estimateMatchEndTime) * 1000)
            }`}
          </p>
          <p>matchResultSubmitted: {gameInfo?.matchResultSubmitted}</p>
          <p>owner: {gameInfo?.owner}</p>
          <p>winner: {gameInfo?.winner && JSON.stringify(gameInfo?.winner)}</p>
        </div>
      </main>

      <footer className={styles.footer}>Powered by Albert & Bob</footer>
    </div>
  )
}
