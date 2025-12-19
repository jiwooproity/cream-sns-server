import Follows from "@/models/follows";

import * as Types from "@/types/follows";

export async function addFollows({ userId, targetId }: Types.AddFollowsServiceParams) {
  const follows = new Follows({ from: userId, to: targetId });
  await follows.save();
}
