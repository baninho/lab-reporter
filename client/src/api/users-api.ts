import Axios from 'axios'
import { apiEndpoint } from '../config'
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