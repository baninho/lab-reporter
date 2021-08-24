import { createGroup, getGroups, updateGroup } from "../src/main/groups"
import { Group } from "../src/models/Group"
import { GroupRequest } from "../src/requests/GroupRequest"
import { UpdateGroupRequest } from "../src/requests/UpdateGroupRequest"

var testGroup: GroupRequest
var groups: Group[]

beforeAll(() => {
  process.env.GROUPS_TABLE = 'Groups-test' 
  testGroup = {
    name: 'testGroup'
  }
})

test('get groups from database', async () => {
  await createGroup(testGroup, 'testUserId')
  groups = await getGroups()
  expect(groups[0].owners).toContainEqual('testUserId')
})

test('update group', async () => {
  await createGroup(testGroup, 'testUserId')
  const groupUpdate: UpdateGroupRequest = {
    groupId: groups[0].groupId,
    name: 'testChangeName'
  }
  await updateGroup(groupUpdate)
  groups = await getGroups()
  expect(groups.find(g => {return g.groupId === groupUpdate.groupId}).name).toEqual(groupUpdate.name)
})