import { Web3GunClient } from "@web3gun/client";
import DGAME_ABI from "../contracts/DGame.json";

const ADDRESS = import.meta.env.VITE_DGAME_CONTRACT_ADDRESS as string;
const PROVIDER_URL =
  "https://goerli.infura.io/v3/aa26f7213d2046c3a20c750679140729";

const indexer = new Web3GunClient(["https://gun.mktcode.uber.space"]);
indexer.setProvider(PROVIDER_URL);

export const contractStorage = indexer.storage.get(ADDRESS);

indexer.contract(ADDRESS, DGAME_ABI, async (dgameContract) => {
  dgameContract.on(
    "TokenMinted",
    async (tokenId: bigint, owner: string, x: bigint, y: bigint, z: bigint) => {
      owner = owner.toLowerCase();

      const ownerBalance = await dgameContract.balanceOf(owner);

      contractStorage.get("balances").get(owner).put(ownerBalance.toString());
      contractStorage
        .get("tokens")
        .get(tokenId.toString())
        .get("owner")
        .put(owner);
      contractStorage
        .get("tokens")
        .get(tokenId.toString())
        .get("level")
        .put("0");
      contractStorage
        .get("tokens")
        .get(tokenId.toString())
        .get("type")
        .put("base");
      contractStorage
        .get("tokens")
        .get(tokenId.toString())
        .get("name")
        .put("Base");
      contractStorage
        .get("tokens")
        .get(tokenId.toString())
        .get("description")
        .put("A player's base");
      contractStorage
        .get("tokens")
        .get(tokenId.toString())
        .get("image")
        .put("artwork/base2.jpeg");

      contractStorage
        .get("coords")
        .get(x.toString())
        .get(y.toString())
        .get(z.toString())
        .put(tokenId.toString());
    }
  );

  dgameContract.on(
    "LevelUp",
    async (tokenId: bigint, newLevel: bigint, newUri) => {
      console.log("LevelUp", tokenId, newLevel, newUri);
      contractStorage
        .get("tokens")
        .get(tokenId.toString())
        .get("level")
        .put(newLevel.toString());
    }
  );
});

indexer.replay();
