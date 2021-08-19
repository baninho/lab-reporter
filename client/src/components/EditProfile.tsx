import React from "react";
import { Container, Grid, Loader } from "semantic-ui-react";
import Auth from "../auth/Auth";
import { User } from "../types/User";
import { History } from 'history'

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
    this.setState({
      loading: false
    })
  }

  renderProfileEdit() {
    return (
      <Container>
        User edit
      </Container>
    )
  }
  renderLoading() {
    return (
      <Grid.Row>
      <Loader indeterminate active inline="centered">
      Lade Eintrag
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