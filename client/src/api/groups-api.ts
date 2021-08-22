import Axios from 'axios'
import { apiEndpoint } from '../config'
import { Group } from '../types/Group'
import * as uuid from 'uuid'

export async function getGroups(idToken: string): Promise<Group[]> {
  console.log(`Fetching groups`)

  const response = await Axios.get(`${apiEndpoint}/groups`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  return response.data.items
}

export async function createGroup(idToken: string, name: string): Promise<Group> {
  const group: Group = new Group(uuid.v4(), name)
  const response = await Axios.post(`${apiEndpoint}/groups`, JSON.stringify(group), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })

  return response.data.group
}