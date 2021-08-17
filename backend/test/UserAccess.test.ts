import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { UserAccess } from "../src/dal/UserAccess"
import { User } from "../src/models/User"
import { UpdateUserRequest } from "../src/requests/UpdateUserRequest";

var userAccess: UserAccess
var testUser: User
var testUserQuery: User
var testUserUpdate: UpdateUserRequest
var testUserUpdateNewGroup: UpdateUserRequest

beforeAll(() => {
  const isTest = process.env.JEST_WORKER_ID;
  const config = {
    convertEmptyValues: true,
    ...(isTest && {
      endpoint: 'localhost:8000',
      sslEnabled: false,
      region: 'local-env',
    }),
  };
  
  process.env.USER_TABLE = 'Users-test'
  
  const ddb = new DocumentClient(config);
  
  userAccess = new UserAccess(ddb)
  testUser = new User('test_id', 'test_user', ['test_id'])
  testUserQuery = new User('query_user_id', 'query_user', ['query_user_id'])
  testUserUpdate = {
    userId: 'test_id',
    name: 'changed_name'
  }
  testUserUpdateNewGroup = {
    userId: 'test_id',
    newGroups: ['new_group_id']
  }
})

test('Create new user', async () => {
  const response = await userAccess.createUser(testUser)
  expect(response).toMatch(/.*userId.*/)
})

test('Create and get user that was created', async () => {
  await userAccess.createUser(testUserQuery)
  const response = await userAccess.getUserById(testUserQuery.userId)
  expect(response.name).toMatch(testUserQuery.name)
})

test('Update user name', async () => {
  await userAccess.updateUser(testUserUpdate)
  const res = await userAccess.getUserById(testUserUpdate.userId)
  expect(res.name).toMatch(testUserUpdate.name)
})

test('Add new group', async () => {
  await userAccess.updateUser(testUserUpdateNewGroup)
  const res = await userAccess.getUserById(testUserUpdateNewGroup.userId)
  expect(res.groups).toEqual(expect.arrayContaining(testUserUpdateNewGroup.newGroups))
})