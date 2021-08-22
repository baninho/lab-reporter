import React from "react";
import { Button, Container, Divider, Dropdown, DropdownProps, Form, Grid, Loader } from "semantic-ui-react";
import Auth from "../auth/Auth";
import { User } from "../types/User";
import { History } from 'history'
import { parseUserId } from "../util/utils";
import { getUserById, updateUser } from "../api/users-api";
import { UpdateUserRequest } from "../types/UpdateUserRequest";
import { Group } from "../types/Group";
import { getGroups } from "../api/groups-api";

interface EditProfileProps {
  auth: Auth
  history: History
}

interface EditProfileState {
  user: User
  loading: boolean
  name: string
  allGroups: Group[]
  groupIds: string[]
}

export class EditProfile extends React.PureComponent<EditProfileProps, EditProfileState> {
  state: EditProfileState = {
    user: new User("", "", []),
    loading: true,
    name: '',
    allGroups: [],
    groupIds: []
  }

  handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()
    try {
      if (!this.state.user) {
        alert('Konnte User nicht laden')
        return
      }
      
      const updatedUser: UpdateUserRequest = {
        userId: this.state.user.userId,
        name: this.state.name
      }

      this.setState({
        loading: true
      })
      
      await updateUser(this.props.auth.getIdToken(), updatedUser)
    } catch (e) {
      alert('Nicht aktualisiert: ' + e.message)
    } finally {
      await this.fetchUser()
    }
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value
    
    this.setState({
      name
    })
  }

  /**
   * Change handler for Group selector
   * Add group to user if selecting user has owner rights
   * 
   * TODO: It's actually more sensible to edit groups to contain members 
   * - move this functionality to a group edit page
   */
  handleGroupsChange = async (event: React.SyntheticEvent, data: DropdownProps) => {
    console.log(data.value)
    const value: string[] = data.value as string[]

    var removedId: string = this.state.groupIds.filter((id) => {
      return !value.includes(id)
    })[0]

    var newId: string = value.filter((id) => {
      return !this.state.groupIds.includes(id)
    })[0]

    console.log('new: ' + newId)
    console.log('removed: ' + removedId)

    // TODO: API call to actually add/remove group membership

    this.setState({
      groupIds: value
    })
  }

  fetchUser = async () => {
    try {
      const user: User = await getUserById(this.props.auth.idToken, parseUserId(this.props.auth.idToken))
      this.setState({
        user,
        name: user.name,
        groupIds: user.groups
      })
    } catch (e) {
      alert(`Failed to fetch user: ${e.message}`)
    }
  }

  fetchGroups = async () => {
    try {
      const groups: Group[] = await getGroups(this.props.auth.idToken)
      this.setState({
        allGroups: groups
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

  renderProfileEdit() {
    const options = this.state.allGroups.map((group) => {
      return {
        key: group.groupId,
        text: group.name,
        value: group.groupId
      }
    })
    return (
      <Container>
        <h2>Hallo, {this.state.user.name || 'neuer Benutzer'}!</h2>
        <Form onSubmit={this.handleSubmit}>
          <Form.Input 
          label="Anzeigename"
          value={this.state.name}
          width={5}
          placeholder="Name"
          onChange={this.handleNameChange}
          />
          <Button positive>Speichern</Button>
        </Form>
        <Divider />
        <Form>
        <Form.Input
        label="Projekte">
        <Dropdown fluid multiple selection
        options={options}
        onChange={this.handleGroupsChange}
        value={this.state.groupIds}
        />
        </Form.Input>
        </Form>
      </Container>
    )
  }
  renderLoading() {
    return (
      <Grid.Row>
      <Loader indeterminate active inline="centered">
        Ein Moment...
      </Loader>
      </Grid.Row>
      )
  }
  
  renderProfile() {
    if (this.state.loading) {
      return this.renderLoading()
    }
    
    return this.renderProfileEdit()
  }

  render() {
    return (
      <Grid>{this.renderProfile()}</Grid>
    )
  }
}