import { createGroup, getGroups } from "../src/main/groups"
import { Group } from "../src/models/Group"

var testGroup: Group

beforeAll(() => {
  testGroup = new Group('testGroupId', 'testGroupName')
})

test('get groups from database', async () => {
  process.env.GROUPS_TABLE = 'Groups-test' 
  await createGroup(testGroup)
  const groups = await getGroups()
  expect(groups).toContainEqual(testGroup)
})