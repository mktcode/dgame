import Gun from "gun/gun";
import "gun/lib/radix";
import "gun/lib/radisk";
import "gun/lib/store";
import "gun/lib/rindexed";

const gun = new Gun({
  peers: ["https://gun.mktcode.uber.space/gun"],
  localStorage: false,
});

export const indexer = gun.get("dgame");
