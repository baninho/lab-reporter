export interface UpdateGroupRequest {
  groupId: string
  name?: string
  newOwners?: string[]
  newMembers?: string[]
  deleteOwners?: string[]
  deleteMember?: string[]
}