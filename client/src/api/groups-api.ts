import Axios from 'axios'
import { apiEndpoint } from '../config'
import { Group } from '../types/Group'
import { GroupRequest } from '../types/GroupRequest'
import { UpdateGroupRequest } from '../types/UpdateGroupRequest'

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
  // id has to be assigned by backend to avoid replacing groups to gain access to entries
  // should be implemented through a GroupRequest
  const groupRequest: GroupRequest = {
    name
  }
  const response = await Axios.post(`${apiEndpoint}/groups`, JSON.stringify(groupRequest), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })

  return response.data.group
}

/**
 * Update a group according to the provided update object
 * by PATCH request to the /groups API
 * @param idToken auth0 id token
 * @param update group update request
 */
export async function updateGroup(idToken: string, update: UpdateGroupRequest) {
  await Axios.patch(`${apiEndpoint}/groups`, JSON.stringify(update), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}