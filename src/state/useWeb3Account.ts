import { ref } from "vue";
import { BrowserProvider } from "ethers";
import { useDGameContract } from "./useDGameContract";
import { playAudio } from "@/lib/audio";

export const IS_ETHEREUM_ENABLED = !!window.ethereum;

const provider = IS_ETHEREUM_ENABLED
  ? new BrowserProvider(window.ethereum)
  : null;

const accountAddress = ref<string | null>(null);
const accountBalance = ref(0n);

async function connect() {
  if (!accountAddress.value) {
    playAudio("auth-required");
  }

  if (provider) {
    try {
      const account = await provider.getSigner();
      accountAddress.value = (await account.getAddress()).toLowerCase();

      const { dgameContract } = await useDGameContract(account);
      accountBalance.value = await dgameContract.balanceOf(accountAddress.value);

      return {
        account,
        accountAddress: accountAddress.value,
        accountBalance: accountBalance.value,
      };
    } catch {
      playAudio("canceled");
      throw new Error("User denied account access");
    }
  } else {
    throw new Error("No provider available");
  }
}

function shortenAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function useWeb3Account() {
  return {
    accountAddress,
    accountBalance,
    connect,
    shortenAddress,
  };
}
