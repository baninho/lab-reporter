import { UserAccess } from "../dal/UserAccess";
import { User } from "../models/User";
import { createDynamoDBClient } from "../utils/utils";

const userAccess: UserAccess = new UserAccess(createDynamoDBClient())

export async function getUserById(userId:string): Promise<User> {
  return await userAccess.getUserById(userId)
}