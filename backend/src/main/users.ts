import { UserAccess } from "../dal/UserAccess";
import { Group } from "../models/Group";
import { User } from "../models/User";
import { UpdateUserRequest } from "../requests/UpdateUserRequest";
import { createDynamoDBClient } from "../utils/utils";
import { getGroups } from "./groups";

const userAccess: UserAccess = new UserAccess(createDynamoDBClient())

export async function getUserById(userId:string): Promise<User> {
  const user: User = await userAccess.getUserById(userId)

  if (user) return user
  
  return await createUser(new User(userId, '', []))
}

export async function createUser(user:User): Promise<User> {
  return await userAccess.createUser(user)
}

export async function updateUser(userUpdate:UpdateUserRequest, userIdRequest: string) {
  if (userUpdate.newGroups) {
    const requester: User = await getUserById(userIdRequest)
    const groups: Group[] = await getGroups()
    const ownedGroupIds: string[] = groups
    .filter((group) => {
      return group.owners.includes(requester.userId)
    })
    .map((group) => {
      return group.groupId
    })
    userUpdate.newGroups = userUpdate.newGroups.filter((groupId) => {
      return ownedGroupIds.includes(groupId)
    })
  }
  
  await userAccess.updateUser(userUpdate)
}