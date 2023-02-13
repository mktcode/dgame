import type { JsonRpcSigner } from "ethers";
import { useContract } from "./useContract";
import DGAME_ABI from "../contracts/DGame.json";

export async function useDGameContract(signer: JsonRpcSigner) {
  const { contract: dgameContract } = await useContract(
    import.meta.env.VITE_DGAME_CONTRACT_ADDRESS,
    DGAME_ABI,
    signer
  );

  return {
    dgameContract,
  };
}
