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

/**
 * Update group database entry according to groupUpdate object
 * @param groupUpdate group update specification
 */
export async function updateGroup(groupUpdate:UpdateGroupRequest) {
  const group = await getGroupById(groupUpdate.groupId)

  for (let k of Object.keys(groupUpdate)) {
    group[k] = groupUpdate[k]
  }

  return( await groupAccess.putGroup(group) )
}

async function getGroupById(groupId:string): Promise<Group> {
  const groups: Group[] = await getGroups()
  return groups.find(g => {return g.groupId === groupId})
}