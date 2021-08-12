import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { UserAccess } from "../src/dal/UserAccess"
import { User } from "../src/models/User"

var userAccess: UserAccess
var testUser: User
var testUserQuery: User

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
  testUser = new User('test_id', 'test_user')
  testUserQuery = new User('query_user_id', 'query_user')
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