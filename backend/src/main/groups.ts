import { GroupAccess } from "../dal/GroupAccess";
import { Group } from "../models/Group";

const groupAccess = new GroupAccess()

export async function createGroup(group:Group, userId: string) {
  group.owners.push(userId)
  return await groupAccess.createGroup(group)
}

export async function getGroups(): Promise<Group[]> {
  return await groupAccess.getGroups()
}

export async function addOwner(group: Group, newOwnerId: string, userId: string) {
  if (group.owners.includes(userId)) {
    group.owners.push(newOwnerId)
    return await groupAccess.createGroup(group)
  }
}