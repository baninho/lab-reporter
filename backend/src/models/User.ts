export class User {
  userId: string
  name: string
  groups: string[]

  constructor(userId: string, name: string, groups: string[]){
    this.userId = userId
    this.name = name
    this.groups = groups
  }
}
