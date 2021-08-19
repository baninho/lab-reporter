import Axios from 'axios'
import { apiEndpoint } from '../config'
import { UpdateUserRequest } from '../types/UpdateUserRequest'
import { User } from '../types/User'

export async function getUserById(idToken: string, userId: string): Promise<User> {
  console.log(`Fetching entry ${userId}`)

  const response = await Axios.get(`${apiEndpoint}/users`, {
    headers: {
      'userid': userId,
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  return response.data.user
}

export async function updateUser(idToken: string, userUpdate: UpdateUserRequest) {
  await Axios.patch(`${apiEndpoint}/users`, JSON.stringify(userUpdate), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}