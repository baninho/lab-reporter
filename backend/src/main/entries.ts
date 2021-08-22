import * as uuid from 'uuid'

import { EntryAccess } from "../dal/EntryAccess";
import { EntryItem } from '../models/EntryItem';
import { CreateEntryRequest } from "../requests/CreateEntryRequest";
import { UpdateEntryRequest } from '../requests/UpdateEntryRequest';
import { radix64 } from '../utils/radix64';
import { getUserById } from './users';

const entryAccess = new EntryAccess()

export async function createEntry(entryRequest: CreateEntryRequest, userId: string):Promise<EntryItem> {
  const entryId = radix64(uuid.v4())
  const createdAt = new Date().toISOString()

  const entry: EntryItem = {
    userId,
    entryId,
    createdAt,
    groupId: userId,
    attachments: [],
    ...entryRequest
  }

  await entryAccess.createEntry(entry)

  return entry
}

export async function getEntriesByUser(userId:string): Promise<EntryItem[]> {
  const groups = (await getUserById(userId)).groups
  const entries: EntryItem[] = []

  try {
    for (const g of groups) {
      var entryGroup = await entryAccess.getEntriesByGroup(g)
      entries.push(...entryGroup);
    }
  } catch (e) {
    console.log('Error: ' + e.message)
  }
  console.log(entries)

  return entries as EntryItem[]
}

export async function getEntryById(entryId:string): Promise<EntryItem> {
  return await entryAccess.getEntryById(entryId)
}

export async function deleteEntry(entryId: string, userId: string) {
  await entryAccess.deleteEntry(entryId, userId)
}

export async function updateEntry(updatedEntry: UpdateEntryRequest, entryId: string) {
  await entryAccess.updateEntry(updatedEntry, entryId)
}

export async function deleteAttachment(entryId: string, key: string) {
  const entry: EntryItem = await entryAccess.getEntryById(entryId)
  const updatedEntry: UpdateEntryRequest = {
    name: entry.name,
    groupId: entry.groupId,
    delKey: key
  }

  updateEntry(updatedEntry, entryId)
}