import React from "react";
import { Button, Container, Form, Grid, Loader } from "semantic-ui-react";
import Auth from "../auth/Auth";
import { User } from "../types/User";
import { History } from 'history'
import { parseUserId } from "../util/utils";
import { getUserById, updateUser } from "../api/users-api";
import { UpdateUserRequest } from "../types/UpdateUserRequest";

interface EditProfileProps {
  auth: Auth
  history: History
}

interface EditProfileState {
  user: User
  loading: boolean
  name: string
}

export class EditProfile extends React.PureComponent<EditProfileProps, EditProfileState> {
  state: EditProfileState = {
    user: new User("", "", []),
    loading: true,
    name: ''
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

  fetchUser = async () => {
    try {
      this.setState({
        loading: true
      })
      const user: User = await getUserById(this.props.auth.idToken, parseUserId(this.props.auth.idToken))
      this.setState({
        user,
        loading: false,
        name: user.name
      })
    } catch (e) {
      alert(`Failed to fetch user: ${e.message}`)
    }
  }

  async componentDidMount() {
    await this.fetchUser()
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