import React from "react";
import { Button, Container, Divider, Dropdown, DropdownProps, Form, Grid, Loader } from "semantic-ui-react";
import Auth from "../auth/Auth";
import { User } from "../types/User";
import { History } from 'history'
import { parseUserId } from "../util/utils";
import { getUsers } from "../api/users-api";
import { Group } from "../types/Group";
import { getGroups, updateGroup } from "../api/groups-api";
import { UpdateGroupRequest } from "../types/UpdateGroupRequest";

interface EditGroupProps {
  match: {
    params: {
      groupId: string
    }
  }
  auth: Auth
  history: History
}

interface EditGroupState {
  group: Group
  user: User
  loading: boolean
  name: string
  allGroups: Group[]
  allUsers: User[]
  ownerIds: string[]
  memberIds: string[]
}

export class EditGroup extends React.PureComponent<EditGroupProps, EditGroupState> {
  state: EditGroupState = {
    group: new Group('', ''),
    user: new User('', '', []),
    loading: true,
    name: '',
    allGroups: [],
    allUsers: [],
    ownerIds: [],
    memberIds: []
  }

  /**
   * Handle submit of name form
   * preprocess and make the API call to change the group name
   * @param event React submit event
   * @returns nothing
   */
  handleNameSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    try {
      if (!this.state.user) {
        alert('Konnte User nicht laden')
        return
      }

      this.setState({
        loading: true
      })

      const groupUpdate: UpdateGroupRequest = {
        groupId: this.state.group.groupId,
        name: this.state.name
      }

      await updateGroup(this.props.auth.idToken, groupUpdate)
      
    } catch (e) {
      alert('Nicht aktualisiert: ' + e.message)
    } finally {
      await this.fetchGroups()
      this.setState({
        loading: false
      })
    }
  }

  /**
   * Handle submit of members/owners form
   * preprocess and make the API call to update group members/owners
   * @param event React submit event
   * @returns nothing
   */
  handleUsersSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()
    
    try {
      if (!this.state.user) {
        alert('Konnte User nicht laden')
        return
      }

      this.setState({
        loading: true
      })

      const groupUpdate: UpdateGroupRequest = {
        groupId: this.state.group.groupId,
        members: this.state.memberIds,
        owners: this.state.ownerIds
      }

      await updateGroup(this.props.auth.idToken, groupUpdate)
      
    } catch (e) {
      alert('Nicht aktualisiert: ' + e.message)
    } finally {
      await this.fetchUser()
      await this.fetchGroups()
      this.setState({
        loading: false
      })
    }
  }

  /**
   * Handle change to the name input field
   * @param event name input element event
   */
  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value
    
    this.setState({
      name
    })
  }

  /**
   * Change handler for Owner selector
   * Add user to group owners input field
   */
  handleOwnersChange = async (event: React.SyntheticEvent, data: DropdownProps) => {
    console.log(data.value)

    if (!(data.value as string[])[0]) return

    const value: string[] = data.value as string[]

    var removedId: string = this.state.ownerIds.filter((id) => {
      return !value.includes(id)
    })[0]

    var newId: string = value.filter((id) => {
      return !this.state.ownerIds.includes(id)
    })[0]

    console.log('new: ' + newId)
    console.log('removed: ' + removedId)

    this.setState({
      ownerIds: value,
      memberIds: this.state.memberIds.includes(newId) ? this.state.memberIds : [...this.state.memberIds, newId]
    })
  }

  /**
   * Change handler for Member selector
   * Add user to group members input field
   */
   handleMembersChange = async (event: React.SyntheticEvent, data: DropdownProps) => {
    console.log(data.value)

    if (!(data.value as string[])[0]) return

    const value: string[] = data.value as string[]

    var removedId: string = this.state.memberIds.filter((id) => {
      return !value.includes(id)
    })[0]

    var newId: string = value.filter((id) => {
      return !this.state.memberIds.includes(id)
    })[0]

    console.log('new: ' + newId)
    console.log('removed: ' + removedId)

    this.setState({
      memberIds: value,
      ownerIds: this.state.ownerIds.filter(id => {
        return value.includes(id)
      })
    })
  }

  /**
   * Fetch the current user from API
   */
  fetchUser = async () => {
    try {
      const users: User[] = await getUsers(this.props.auth.idToken)
      const user = users.find(u => {
        return u.userId === parseUserId(this.props.auth.idToken)
      })
      this.setState({
        user: user ? user : this.state.user,
        allUsers: users
      })
    } catch (e) {
      alert(`Failed to fetch user: ${e.message}`)
    }
  }

  /**
   * Fetch all existing groups from API
   */
  fetchGroups = async () => {
    try {
      const groups: Group[] = await getGroups(this.props.auth.idToken)
      const group: Group = groups.find(group => {
        return group.groupId === this.props.match.params.groupId
      }) || this.state.group
      this.setState({
        allGroups: groups,
        group,
        name: group.name,
        ownerIds: group.owners,
        memberIds: group.members
      })
    } catch (e) {
      alert(`Failed to fetch groups: ${e.message}`)
    }
  }

  async componentDidMount() {
    this.setState({
      loading: true
    })

    await this.fetchUser()
    await this.fetchGroups()

    this.setState({
      loading: false
    })
  }

  /**
   * Render the group edit form for name and members/owners
   * @returns Group edit form JSX
   */
  renderGroupEdit() {
    const options = this.state.allUsers.map((u) => {
      return {
        key: u.userId,
        text: u.name ? u.name : 'unnamed user',
        value: u.userId
      }
    })
    return (
      <Container>
        <h2>{this.state.group.name || 'unnamed project'}</h2>
        <Form onSubmit={this.handleNameSubmit}>
          <Form.Input 
          label="Projektname"
          value={this.state.name}
          width={5}
          placeholder="Name"
          onChange={this.handleNameChange}
          />
          <Button positive>Speichern</Button>
        </Form>
        <Divider />
        <Form onSubmit={this.handleUsersSubmit}>
        <Form.Input
        label="Besitzer">
        <Dropdown fluid multiple selection
        options={options}
        onChange={this.handleOwnersChange}
        value={this.state.ownerIds}
        />
        </Form.Input>
        <Form.Input
        label="Mitglieder">
        <Dropdown fluid multiple selection
        options={options}
        onChange={this.handleMembersChange}
        value={this.state.memberIds}
        />
        </Form.Input>
        <Button positive>Speichern</Button>
        </Form>
        <Divider/>
      </Container>
    )
  }

  /**
   * Render the loading screen
   * @returns loading screen
   */
  renderLoading() {
    return (
      <Grid.Row>
      <Loader indeterminate active inline="centered">
        Ein Moment...
      </Loader>
      </Grid.Row>
      )
  }
  
  /**
   * Render group page or loading screen if finished fetching data
   * or still waiting respectively
   * @returns the group edit page JSX
   */
  renderGroup() {
    if (this.state.loading) {
      return this.renderLoading()
    }
    
    return this.renderGroupEdit()
  }

  render() {
    return (
      <Grid>{this.renderGroup()}</Grid>
    )
  }
}