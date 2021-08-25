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

test('add group owners', async () => {
  const groupUpdate: UpdateGroupRequest = {
    groupId: groups[0].groupId,
    newOwners: ['testNewOwner']
  }
  await updateGroup(groupUpdate)
  groups = await getGroups()
  expect(groups.find(g => {return g.groupId === groupUpdate.groupId}).owners)
  .toEqual(expect.arrayContaining(groupUpdate.newOwners))
})

test('remove group owners', async () => {
  const groupUpdate: UpdateGroupRequest = {
    groupId: groups[0].groupId,
    deleteOwners: ['testNewOwner']
  }
  await updateGroup(groupUpdate)
  groups = await getGroups()
  expect(groups.find(g => {return g.groupId === groupUpdate.groupId}).owners)
  .not.toEqual(expect.arrayContaining(groupUpdate.deleteOwners))
})

test('add group members', async () => {
  const groupUpdate: UpdateGroupRequest = {
    groupId: groups[0].groupId,
    newMembers: ['testNewMember']
  }
  await updateGroup(groupUpdate)
  groups = await getGroups()
  expect(groups.find(g => {return g.groupId === groupUpdate.groupId}).members)
  .toEqual(expect.arrayContaining(groupUpdate.newMembers))
})

test('remove group members', async () => {
  const groupUpdate: UpdateGroupRequest = {
    groupId: groups[0].groupId,
    deleteMember: ['testNewMember']
  }
  await updateGroup(groupUpdate)
  groups = await getGroups()
  expect(groups.find(g => {return g.groupId === groupUpdate.groupId}).members)
  .not.toEqual(expect.arrayContaining(groupUpdate.deleteMember))
})