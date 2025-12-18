import "express-session";
import { type ObjectId } from "mongoose/types";

declare module "express-session" {
  interface SessionData {
    user: {
      id: ObjectId;
    };
  }
}
