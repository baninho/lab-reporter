import React from "react";
import { Button, Container, Divider, Form, Grid, List, Loader } from "semantic-ui-react";
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
  user: User
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
    user: new User('', '', []),
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
      this.setState({
        loading: false
      })
    }
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value
    
    this.setState({
      name
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
    let user = this.props.user.userId === '' 
    ? await getUserById(this.props.auth.idToken, parseUserId(this.props.auth.idToken))
    : this.props.user
    this.setState({
      loading: true,
      user,
      name: user.name,
      groupIds: user.groups
    })

    await this.fetchGroups()

    this.setState({
      loading: false
    })
  }

  renderProfileEdit() {
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
        <h3>Projekte</h3>
        <List horizontal divided relaxed>
          {this.state.user.groups.map( (groupId) => {
            const group: Group = this.state.allGroups.find((group) => {
              return group.groupId === groupId
            }) || new Group('', '')
            return (
              <List.Item key={groupId}>
                {group.name}
              </List.Item>
            )
          })}
        </List>
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