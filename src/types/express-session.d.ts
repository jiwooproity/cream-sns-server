import "express-session";
import { type ObjectId } from "mongoose/types";

declare module "express-session" {
  interface SessionData {
    user: {
      id?: ObjectId;
      userId?: string;
      nickname?: string;
      description?: string;
      profile?: string;
    };
  }
}
