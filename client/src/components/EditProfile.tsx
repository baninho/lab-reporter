import React from "react";
import { Container, Grid, Loader } from "semantic-ui-react";
import Auth from "../auth/Auth";
import { User } from "../types/User";
import { History } from 'history'
import { parseUserId } from "../util/utils";
import { getUserById } from "../api/users-api";

interface EditProfileProps {
  auth: Auth
  history: History
}

interface EditProfileState {
  user: User
  loading: boolean
}

export class EditProfile extends React.PureComponent<EditProfileProps, EditProfileState> {
  state: EditProfileState = {
    user: new User("", "", []),
    loading: true
  }

  async componentDidMount() {
    try {
      const user: User = await getUserById(this.props.auth.idToken, parseUserId(this.props.auth.idToken))
      this.setState({
        user,
        loading: false
      })
    } catch (e) {
      alert(`Failed to fetch user: ${e.message}`)
    }
  }

  renderProfileEdit() {
    return (
      <Container>
        User edit {this.state.user.userId}
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
  
  render() {
    if (this.state.loading) {
      return this.renderLoading()
    }
    
    return this.renderProfileEdit()
  }
}