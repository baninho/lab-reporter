import { UserAccess } from "../dal/UserAccess";
import { User } from "../models/User";
import { UpdateUserRequest } from "../requests/UpdateUserRequest";
import { createDynamoDBClient } from "../utils/utils";

const userAccess: UserAccess = new UserAccess(createDynamoDBClient())

export async function getUserById(userId:string): Promise<User> {
  const user: User = await userAccess.getUserById(userId)

  if (user) return user
  
  return await createUser(new User(userId, '', []))
}

export async function createUser(user:User): Promise<User> {
  return await userAccess.createUser(user)
}

export async function updateUser(userUpdate:UpdateUserRequest) {
  await userAccess.updateUser(userUpdate)
}