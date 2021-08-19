import React, { Component } from 'react'
import { Link, Route, Router, Switch } from 'react-router-dom'
import { Container, Grid, Menu, Segment } from 'semantic-ui-react'

import Auth from './auth/Auth'
import { EditEntry } from './components/EditEntry'
import { EntryDetail } from './components/EntryDetail'
import { LogIn } from './components/LogIn'
import { NotFound } from './components/NotFound'
import { Entries } from './components/Entries'

export interface AppProps {}

export interface AppProps {
  auth: Auth
  history: any
}

export interface AppState {}

export default class App extends Component<AppProps, AppState> {
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

  handleEditProfile() {

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
      <Menu>
        <Menu.Item name="home">
          <Link to="/">Home</Link>
        </Menu.Item>

        <Menu.Menu position="right">
          <Menu.Item name="profile" onClick={this.handleEditProfile}>
            Profil
          </Menu.Item>
          {this.logInLogOutButton()}
        </Menu.Menu>
      </Menu>
    )
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
      return <LogIn auth={this.props.auth} />
    }

    return (
      <Switch>
        <Route
          path="/"
          exact
          render={props => {
            return <Entries {...props} auth={this.props.auth} />
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

        <Route component={NotFound} />
      </Switch>
    )
  }
}
