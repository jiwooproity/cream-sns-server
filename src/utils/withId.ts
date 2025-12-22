import { Document } from "mongodb";

export function withId(doc: Document) {
  const { _id, ...rest } = doc;
  return { id: _id.toString(), ...rest };
}
