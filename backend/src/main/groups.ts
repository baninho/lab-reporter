import { GroupAccess } from "../dal/GroupAccess";
import { Group } from "../models/Group";

const groupAccess = new GroupAccess()

export async function createGroup(group:Group) {
  return await groupAccess.createGroup(group)
}

export async function getGroups(): Promise<Group[]> {
  return await groupAccess.getGroups()
}