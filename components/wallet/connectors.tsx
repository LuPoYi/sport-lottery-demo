import { InjectedConnector } from "@web3-react/injected-connector"

const chains = {
  1: "Ethereum",
  5: "Ethereum testnet - Goerli",
  137: "Polygon",
}

const injected = new InjectedConnector({
  supportedChainIds: [1, 5, 137],
})

export { chains, injected }
