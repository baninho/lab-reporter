import React, { Component } from 'react'
import { Route, Router, Switch } from 'react-router-dom'
import { Container, Grid, Menu, Segment, Image } from 'semantic-ui-react'

import Auth from './auth/Auth'
import { EditEntry } from './components/EditEntry'
import { EntryDetail } from './components/EntryDetail'
import { LogIn } from './components/LogIn'
import { NotFound } from './components/NotFound'
import { Entries } from './components/Entries'
import { EditProfile } from './components/EditProfile'
import { Groups } from './components/Groups'
import { EditGroup } from './components/EditGroup'
import { User } from './types/User'
import { getUsers } from './api/users-api'
import { parseUserId } from './util/utils'

export interface AppProps {
  auth: Auth
  history: any
}

export interface AppState {
  user: User
  allUsers: User[]
}

export default class App extends Component<AppProps, AppState> {
  state: AppState = {
    user: new User('', '', ['']),
    allUsers: [new User('', '', [''])]
  }

  constructor(props: AppProps) {
    super(props)

    this.handleLogin = this.handleLogin.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
  }

  handleLogin() {
    this.props.auth.login()
  }

  handleLogout() {
    this.props.auth.logout()
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
      console.log(`Failed to fetch user: ${e.message}`)
    }
  }

  rendercb() {
    this.setState({allUsers: []})
  }

  componentDidUpdate = async () => {
    if (this.props.auth.isAuthenticated() && this.state.allUsers.length === 0) {
      await this.fetchUser()
    }
  }

  componentDidMount = async () => {
    if (this.props.auth.isAuthenticated()) {
      await this.fetchUser()
    }
    this.props.auth.authcb = this.rendercb.bind(this)
  }

  render() {
    return (
      <div>
        <Container>
          <style>
            {`
            html, body {
              background-color: beige;
            }
            `}
          </style>
          <Segment style={{ padding: '4em 0em' }} vertical>
            <Grid container stackable verticalAlign="middle">
              <Grid.Row>
                <Grid.Column width={16}>
                  <Router history={this.props.history}>
                    {this.generateMenu()}
                    {this.generateCurrentPage()}
                  </Router>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Segment>
        </Container>
      </div>
    )
  }

  generateMenu() {
    return (
      <Menu color="teal" inverted fixed="top" style={{ padding: "0em 10em"}} size="huge">
        <Menu.Item>
          <Image size="mini" src='/LOGO_MushRoom_farbirg-weiß-scaled.png' />
        </Menu.Item>
        <Menu.Item header>Laborbuch</Menu.Item>
        <Menu.Item name="home" onClick={() => this.props.history.push('/')}>
          Home
        </Menu.Item>
        <Menu.Item name="home" onClick={() => this.props.history.push('/groups')}>
          Projekte
        </Menu.Item>

        <Menu.Menu position="right">
          {this.profileButton()}
          {this.logInLogOutButton()}
        </Menu.Menu>
      </Menu>
    )
  }

  profileButton() {
    if (this.props.auth.isAuthenticated()) { 
      return(
        <Menu.Item name="profile" onClick={() => this.props.history.push('/profile')}>
          {this.state.user.name ? this.state.user.name : 'Profil'}
        </Menu.Item>
      )
    }
  }

  logInLogOutButton() {
    if (this.props.auth.isAuthenticated()) {
      return (
        <Menu.Item name="logout" onClick={this.handleLogout}>
          Abmelden
        </Menu.Item>
      )
    } else {
      return (
        <Menu.Item name="login" onClick={this.handleLogin}>
          Anmelden
        </Menu.Item>
      )
    }
  }

  generateCurrentPage() {
    if (!this.props.auth.isAuthenticated()) {
      return <LogIn auth={this.props.auth} 
      uri={window.location.pathname}/>
    }

    return (
      <Switch>
        <Route
          path="/"
          exact
          render={props => {
            return <Entries {...props} auth={this.props.auth}/>
          }}
        />

        <Route
          path="/entries/:entryId/edit"
          exact
          render={props => {
            return <EditEntry {...props} auth={this.props.auth} />
          }}
        />

        <Route
          path="/entries/:entryId"
          exact
          render={props => {
            return <EntryDetail {...props} auth={this.props.auth} />
          }}
        />

        <Route
          path="/profile"
          exact
          render={props => {
            return <EditProfile {...props} auth={this.props.auth} 
            user={this.state.user}
            />
          }}
        />

        <Route
          path="/groups"
          exact
          render={props => {
            return <Groups {...props} auth={this.props.auth} />
          }}
        />

        <Route 
          path="/groups/:groupId"
          exact
          render={props => {
            return <EditGroup {...props} auth={this.props.auth} 
            user={this.state.user}
            allUsers={this.state.allUsers}
            />
          }}
        />

        <Route component={NotFound} />
      </Switch>
    )
  }
}
