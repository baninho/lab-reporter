import { createGroup, getGroups } from "../src/main/groups"
import { Group } from "../src/models/Group"

var testGroup: Group

beforeAll(() => {
  process.env.GROUPS_TABLE = 'Groups-test' 
})

test('get groups from database', async () => {
  testGroup = new Group('testGroupId')
  await createGroup(testGroup)
  const groups = await getGroups()
  expect(groups).toContain(testGroup)
})