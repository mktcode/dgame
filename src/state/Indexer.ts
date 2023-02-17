import { Web3GunClient } from "@web3gun/client";
import DGAME_ABI from "../contracts/DGame.json";

const ADDRESS = import.meta.env.VITE_DGAME_CONTRACT_ADDRESS;
const PROVIDER_URL =
  "https://goerli.infura.io/v3/aa26f7213d2046c3a20c750679140729";

export const indexer = new Web3GunClient(PROVIDER_URL, [
  "https://gun.mktcode.uber.space",
]);

indexer.contract(ADDRESS, DGAME_ABI, async (dgameContract, storage) => {
  dgameContract.on(
    "TokenMinted",
    async (tokenId: bigint, owner: string, x: bigint, y: bigint, z: bigint) => {
      owner = owner.toLowerCase();

      const ownerBalance = await dgameContract.balanceOf(owner);

      storage.get("balances").get(owner).put(ownerBalance.toString());
      storage.get("tokens").get(tokenId.toString()).get("owner").put(owner);
      storage.get("tokens").get(tokenId.toString()).get("level").put("0");
      storage.get("tokens").get(tokenId.toString()).get("type").put("base");
      storage.get("tokens").get(tokenId.toString()).get("name").put("Base");
      storage
        .get("tokens")
        .get(tokenId.toString())
        .get("description")
        .put("A player's base");
      storage
        .get("tokens")
        .get(tokenId.toString())
        .get("image")
        .put("artwork/base2.jpeg");

      storage
        .get("coords")
        .get(x.toString())
        .get(y.toString())
        .get(z.toString())
        .put(tokenId.toString());
    }
  );

  dgameContract.on("LevelUp", async (tokenId: bigint, newLevel: bigint) => {
    storage
      .get("tokens")
      .get(tokenId.toString())
      .get("level")
      .put(newLevel.toString());
  });
});

indexer.replay();
