import { GroupAccess } from "../dal/GroupAccess";
import { Group } from "../models/Group";
import { GroupRequest } from "../requests/GroupRequest";
import * as uuid from 'uuid'
import { UpdateGroupRequest } from "../requests/UpdateGroupRequest";
import { createUser, getUserById } from "./users";

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
  const keys = Object.keys(groupUpdate)

  if (keys.includes('members')) {
    // Add group to user if he is a new member
    for (let userId of groupUpdate.members) {
      const user = await getUserById(userId)

      if (!user.groups.includes(group.groupId)) {
        user.groups.push(group.groupId)
        await createUser(user)
      }
    }

    // Remove group from user if they were removed from members
    for (let userId of group.members) {
      if (groupUpdate.members.includes(userId)) continue // user was not removed from group

      const user = await getUserById(userId)

      user.groups = user.groups.filter(id => {return id !== group.groupId})
      await createUser(user)
    }
  }

  for (let k of keys) {
    group[k] = groupUpdate[k]
  }

  return( await groupAccess.putGroup(group) )
}

async function getGroupById(groupId:string): Promise<Group> {
  const groups: Group[] = await getGroups()
  return groups.find(g => {return g.groupId === groupId})
}