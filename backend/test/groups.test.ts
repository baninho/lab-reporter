import { createGroup, getGroups } from "../src/main/groups"
import { GroupRequest } from "../src/requests/GroupRequest"

var testGroup: GroupRequest

beforeAll(() => {
  testGroup = {
    name: 'testGroup'
  }
})

test('get groups from database', async () => {
  process.env.GROUPS_TABLE = 'Groups-test' 
  await createGroup(testGroup, 'testUserId')
  const groups = await getGroups()
  expect(groups[0].owners).toContainEqual('testUserId')
})