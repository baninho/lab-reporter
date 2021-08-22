import * as React from 'react'
import Auth from '../auth/Auth'
import { Button, Container } from 'semantic-ui-react'

interface LogInProps {
  auth: Auth
}

interface LogInState {}

export class LogIn extends React.PureComponent<LogInProps, LogInState> {
  onLogin = () => {
    this.props.auth.login()
  }

  render() {
    return (
      <Container style={{ padding: '4em 0em' }}>
        <h1>Willkommen im Laborbuch</h1>

        <Button onClick={this.onLogin} size="huge" color="olive">
          Anmelden
        </Button>
      </Container>
    )
  }
}
