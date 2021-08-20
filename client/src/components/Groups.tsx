import { History } from 'history'
import * as React from 'react'
import {
  Divider,
  Grid,
  Input,
  Loader,
  Container
} from 'semantic-ui-react'

import { createGroup, getGroups } from '../api/groups-api'
import Auth from '../auth/Auth'
import { Group } from '../types/Group'

interface GroupsProps {
  auth: Auth
  history: History
}

interface GroupsState {
  groups: Group[]
  newGroupName: string
  loadingGroups: boolean
}

export class Groups extends React.PureComponent<GroupsProps, GroupsState> {
  state: GroupsState = {
    groups: [],
    newGroupName: '',
    loadingGroups: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newGroupName: event.target.value })
  }

  // onEditButtonClick = (groupId: string) => {
  //   this.props.history.push(`/groups/${groupId}/edit`)
  // }

  onGroupCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const newGroup = await createGroup(this.props.auth.getIdToken(), this.state.newGroupName)
      this.setState({
        groups: [newGroup, ...this.state.groups],
        newGroupName: ''
      })
    } catch(e) {
      alert('Group creation failed: ' + e.message)
    }
  }

  // onGroupDelete = async (groupId: string) => {
  //   if (!window.confirm('Wirklich löschen?')) return
  //   try {
  //     this.setState({
  //       loadingGroups: true
  //     })
  //     await deleteGroup(this.props.auth.getIdToken(), groupId)
  //     this.setState({
  //       groups: this.state.groups.filter(group => group.groupId !== groupId),
  //       loadingGroups: false
  //     })
  //   } catch(e) {
  //     alert('Group deletion failed: ' + e.message)
  //   }
  // }

  async componentDidMount() {
    try {
      const groups = await getGroups(this.props.auth.getIdToken())
      this.setState({
        groups,
        loadingGroups: false
      })
    } catch (e) {
      alert(`Failed to fetch groups: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        {this.renderCreateGroupInput()}
        {this.renderGroups()}
      </div>
    )
  }

  renderCreateGroupInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'Neues Projekt',
              onClick: this.onGroupCreate
            }}
            fluid
            actionPosition="left"
            placeholder="Projektname"
            onChange={this.handleNameChange}
            value={this.state.newGroupName}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderGroups() {
    if (this.state.loadingGroups) {
      return this.renderLoading()
    }

    return this.renderGroupsList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Lade Projekte
        </Loader>
      </Grid.Row>
    )
  }

  renderGroupsList() {
    return (
      <Container>
        {this.state.groups.map((group) => {
          return (
            <Grid key={group.groupId}>
              <Grid.Column width={16}>
                <h2>{group.name}</h2>
                <Divider />
              </Grid.Column>
            </Grid>
          )
        })}
      </Container>
    )
  }
}
