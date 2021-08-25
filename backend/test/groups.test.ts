import { createGroup, getGroups, updateGroup } from "../src/main/groups"
import { Group } from "../src/models/Group"
import { GroupRequest } from "../src/requests/GroupRequest"
import { UpdateGroupRequest } from "../src/requests/UpdateGroupRequest"

var testGroup: GroupRequest
var groups: Group[]

beforeAll(async () => {
  process.env.GROUPS_TABLE = 'Groups-test' 
  testGroup = {
    name: 'testGroup'
  }
  await createGroup(testGroup, 'testUserId')
})

test('get groups from database', async () => {
  groups = await getGroups()
  expect(groups[0].owners).toContainEqual('testUserId')
})

test('update group name', async () => {
  const groupUpdate: UpdateGroupRequest = {
    groupId: groups[0].groupId,
    name: 'testChangeName'
  }
  await updateGroup(groupUpdate)
  groups = await getGroups()
  expect(groups.find(g => {return g.groupId === groupUpdate.groupId}).name).toEqual(groupUpdate.name)
})

test('update group owners', async () => {
  const groupUpdate: UpdateGroupRequest = {
    groupId: groups[0].groupId,
    owners: ['testNewOwner', 'testUserId']
  }
  await updateGroup(groupUpdate)
  groups = await getGroups()
  expect(groups.find(g => {return g.groupId === groupUpdate.groupId}).owners)
  .toEqual(expect.arrayContaining(groupUpdate.owners))
})

test('update group members', async () => {
  const groupUpdate: UpdateGroupRequest = {
    groupId: groups[0].groupId,
    members: ['testNewMember', 'testUserId']
  }
  await updateGroup(groupUpdate)
  groups = await getGroups()
  expect(groups.find(g => {return g.groupId === groupUpdate.groupId}).members)
  .toEqual(expect.arrayContaining(groupUpdate.members))
})