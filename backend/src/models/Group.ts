export class Group {
  groupId: string
  name: string
  owners: string[]

  constructor(groupId: string, name: string) {
    this.groupId = groupId
    this.name = name
    this.owners = []
  }
}