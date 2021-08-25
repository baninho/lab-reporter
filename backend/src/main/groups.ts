import { GroupAccess } from "../dal/GroupAccess";
import { Group } from "../models/Group";
import { GroupRequest } from "../requests/GroupRequest";
import * as uuid from 'uuid'
import { UpdateGroupRequest } from "../requests/UpdateGroupRequest";

const groupAccess = new GroupAccess()

export async function createGroup(groupRequest: GroupRequest, userId: string): Promise<Group> {
  const group: Group = new Group(uuid.v4(), groupRequest.name)
  group.owners.push(userId)
  group.members.push(userId)
  return await groupAccess.putGroup(group)
}

export async function getGroups(): Promise<Group[]> {
  return await groupAccess.getGroups()
}

export async function addOwner(group: Group, newOwnerId: string, userId: string) {
  if (!group.owners.includes(userId)) throw(new Error('No permission'))
  
  if (!group.members.includes(userId)) group.members.push(userId)
  group.owners.push(newOwnerId)
  
  return await groupAccess.putGroup(group)
}

export async function addMember(group:Group, newMemberId: string, userId: string) {
  if (!group.owners.includes(userId)) throw(new Error('No permission'))
  
  group.members.push(newMemberId)
  
  return await groupAccess.putGroup(group)
}

/**
 * Update group database entry according to groupUpdate object
 * @param groupUpdate group update specification
 */
export async function updateGroup(groupUpdate:UpdateGroupRequest) {
  return( await groupAccess.updateGroup(groupUpdate) )
}