/**
 * Fields in a request to update a user.
 */
export interface UpdateUserRequest {
  userId: string
  name?: string
  newGroup?: string
}