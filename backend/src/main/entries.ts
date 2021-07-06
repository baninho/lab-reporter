import * as uuid from 'uuid'

import { EntryAccess } from "../dal/EntryAccess";
import { EntryItem } from '../models/EntryItem';
import { CreateEntryRequest } from "../requests/CreateEntryRequest";
import { UpdateEntryRequest } from '../requests/UpdateEntryRequest';
import { radix64 } from '../utils/radix64';

const entryAccess = new EntryAccess()

export async function createEntry(entryRequest: CreateEntryRequest, userId: string):Promise<EntryItem> {
  const entryId = radix64(uuid.v4())
  const createdAt = new Date().toISOString()
  const done = false

  const entry: EntryItem = {
    userId,
    entryId,
    createdAt,
    done,
    groupId: userId,
    attachmentUrls: [],
    ...entryRequest
  }

  await entryAccess.createEntry(entry)

  return entry
}

export async function getEntriesByUser(userId:string): Promise<EntryItem[]> {
  return await entryAccess.getEntriesByUser(userId)
}

export async function getEntryById(entryId:string): Promise<EntryItem> {
  return await entryAccess.getEntryById(entryId)
}

export async function deleteEntry(entryId: string, userId: string) {
  await entryAccess.deleteEntry(entryId, userId)
}

export async function updateEntry(updatedEntry: UpdateEntryRequest, entryId: string, userId: string) {
  await entryAccess.updateEntry(updatedEntry, entryId, userId)
}