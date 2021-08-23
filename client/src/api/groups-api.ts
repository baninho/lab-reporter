import Axios from 'axios'
import { apiEndpoint } from '../config'
import { Group } from '../types/Group'
import * as uuid from 'uuid'

/**
 * This will return all the existing groups to any user
 * 
 * @param idToken auth0 id token
 * @returns all existing groups
 */
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

/**
 * create new Group in the database
 * 
 * @param idToken auth0 id token
 * @param name new group name
 * @returns newly created group
 */
export async function createGroup(idToken: string, name: string): Promise<Group> {
  // TODO: id has to be assigned by backend to avoid replacing groups to gain access to entries
  // should be implemented through a GroupRequest
  const group: Group = new Group(uuid.v4(), name)
  const response = await Axios.post(`${apiEndpoint}/groups`, JSON.stringify(group), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })

  return response.data.group
}