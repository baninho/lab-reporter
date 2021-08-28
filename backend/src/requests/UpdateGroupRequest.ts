export interface UpdateGroupRequest {
  groupId: string
  name?: string
  members?: string[]
  owners?: string[]
}