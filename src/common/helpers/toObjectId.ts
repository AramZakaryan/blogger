import { ObjectId } from 'mongodb'

export function toObjectId(id: string): ObjectId | undefined {
  if (ObjectId.isValid(id)) {
    return new ObjectId(id)
  }
  return
}
