import { apiEndpoint } from '../config'
import { Entry } from '../types/Entry';
import { CreateEntryRequest } from '../types/CreateEntryRequest';
import Axios from 'axios'
import { UpdateEntryRequest } from '../types/UpdateEntryRequest';

export async function getEntries(idToken: string): Promise<Entry[]> {
  console.log('Fetching entries')

  const response = await Axios.get(`${apiEndpoint}/entries`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Entries:', response.data)
  return response.data.items
}

export async function getEntryById(idToken: string, entryId: string): Promise<Entry> {
  console.log(`Fetching entry ${entryId}`)

  const response = await Axios.get(`${apiEndpoint}/entries/${entryId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  return response.data.entry
}

export async function createEntry(
  idToken: string,
  newEntry: CreateEntryRequest
): Promise<Entry> {
  const response = await Axios.post(`${apiEndpoint}/entries`,  JSON.stringify(newEntry), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function patchEntry(
  idToken: string,
  todoId: string,
  updatedEntry: UpdateEntryRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/entries/${todoId}`, JSON.stringify(updatedEntry), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteEntry(
  idToken: string,
  todoId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/entries/${todoId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  todoId: string,
  fileExt: string
): Promise<any> {
  const response = await Axios.post(`${apiEndpoint}/entries/${todoId}/attachment`, JSON.stringify(
    {
      fileExt
    }
  ), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)

}
