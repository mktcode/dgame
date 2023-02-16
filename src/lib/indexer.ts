import { Contract, JsonRpcProvider, type InterfaceAbi } from 'ethers'
import Gun, { type IGunInstance } from 'gun'

export class Web3Indexer {
  contracts: Contract[] = []
  provider: JsonRpcProvider
  storage: IGunInstance

  constructor(provider: string | JsonRpcProvider, peers: string[] = []) {
    if (typeof provider === 'string') {
      this.provider = new JsonRpcProvider(provider)
    } else {
      this.provider = provider
    }

    this.storage = Gun({ peers, localStorage: false });
  }

  async contract(
    address: string,
    abi: InterfaceAbi,
    callback: (contract: Contract, storage: IGunInstance) => void
  ) {
    const contract = new Contract(address, abi, this.provider)
    this.contracts.push(contract)
    callback(contract, this.storage)
  }

  replay() {
    this.contracts.forEach(async (contract) => {
      contract.interface.forEachEvent(async (event) => {
        const eventName = event.name
        const listeners = await contract.listeners(eventName)
        listeners.forEach(async () => {
          const pastEvents = await contract.queryFilter(eventName)
          pastEvents.forEach(async (pastEvent) => {
            const decodedEventData = contract.interface.decodeEventLog(eventName, pastEvent.data, pastEvent.topics)
            contract.emit(
              eventName,
              ...decodedEventData
            )
          })
        })
      })
    })
  }
}