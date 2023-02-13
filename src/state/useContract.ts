import { Contract, JsonRpcSigner } from "ethers";

export async function useContract(
  address: string,
  abi: any,
  signer: JsonRpcSigner
) {
  return {
    contract: new Contract(address, abi, signer),
  };
}
