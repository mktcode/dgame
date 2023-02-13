import { ref } from "vue";
import { BrowserProvider } from "ethers";
import { useDGameContract } from "./useDGameContract";

export const IS_ETHEREUM_ENABLED = !!window.ethereum;

const provider = IS_ETHEREUM_ENABLED
  ? new BrowserProvider(window.ethereum)
  : null;

const accountAddress = ref<string | null>(null);
const accountBalance = ref(0n);

async function connect() {
  if (provider) {
    const account = await provider.getSigner();
    accountAddress.value = await account.getAddress();

    const { dgameContract } = await useDGameContract(account);
    accountBalance.value = await dgameContract.balanceOf(accountAddress.value);

    return {
      account,
      accountAddress: accountAddress.value,
      accountBalance: accountBalance.value,
    };
  } else {
    throw new Error("No provider available");
  }
}

export function useWeb3Account() {
  return {
    accountAddress,
    accountBalance,
    connect,
  };
}
