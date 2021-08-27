import { History } from 'history'
import * as React from 'react'
import {
  Divider,
  Dropdown,
  DropdownProps,
  Form,
  Grid,
  Input,
  Loader
} from 'semantic-ui-react'

import { createEntry, deleteEntry, getEntries } from '../api/entries-api'
import { getGroups } from '../api/groups-api'
import Auth from '../auth/Auth'
import { Entry } from '../types/Entry'
import { Group } from '../types/Group'
import { EntryList } from './EntryList'

interface EntriesProps {
  auth: Auth
  history: History
  rendercb: any
}

interface EntriesState {
  entries: Entry[]
  newEntryName: string
  loadingEntries: boolean
  groups: Group[]
  groupId: string
}

export class Entries extends React.PureComponent<EntriesProps, EntriesState> {
  state: EntriesState = {
    entries: [],
    newEntryName: '',
    loadingEntries: true,
    groups: [],
    groupId: 'all'
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newEntryName: event.target.value })
  }

  /**
   * Change handler for group dropdown
   * When selecting a group to filter for, filter entries state
   */
   handleGroupChange = async (event: React.SyntheticEvent, data: DropdownProps) => {
    const groupId: string = data.value as string
    this.setState({
      loadingEntries: true,
      groupId
    })
    var entries = await getEntries(this.props.auth.getIdToken())

    if (groupId !== 'all') {
      entries = entries.filter((entry) => {
        return entry.groupId === groupId
      })
    }
    
    this.setState({
      groupId,
      entries,
      loadingEntries: false
    })
  }

  onEditButtonClick = (entryId: string) => {
    this.props.history.push(`/entries/${entryId}/edit`)
  }

  onEntryCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const newEntry = await createEntry(this.props.auth.getIdToken(), {
        name: this.state.newEntryName
      })
      this.setState({
        entries: [newEntry, ...this.state.entries],
        newEntryName: ''
      })

      this.props.history.push(`/entries/${newEntry.entryId}/edit`)

    } catch(e) {
      alert('Entry creation failed: ' + e.message)
    }
  }

  onEntryDelete = async (entryId: string) => {
    if (!window.confirm('Wirklich löschen?')) return
    try {
      this.setState({
        loadingEntries: true
      })
      await deleteEntry(this.props.auth.getIdToken(), entryId)
      this.setState({
        entries: this.state.entries.filter(entry => entry.entryId !== entryId),
        loadingEntries: false
      })
    } catch(e) {
      alert('Entry deletion failed: ' + e.message)
    }
  }

  async componentDidMount() {
    try {
      this.props.rendercb()
      const entries = await getEntries(this.props.auth.getIdToken())
      const groups = await getGroups(this.props.auth.getIdToken())
      this.setState({
        entries,
        loadingEntries: false,
        groups
      })
    } catch (e) {
      alert(`Failed to fetch entries: ${e.message}`)
    }
  }

  render() {
    return (
      <Grid>
        {this.renderCreateEntryInput()}
        {this.renderEntries()}
      </Grid>
    )
  }

  renderCreateEntryInput() {
    const groupsDropdown = this.state.groups.map((group) => {
      return {
        key: group.groupId,
        text: group.name,
        value: group.groupId
      }
    })
    groupsDropdown.unshift({
      key: 'all',
      text: 'Alle Projekte',
      value: 'all'
    })
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'Neuer Eintrag',
              onClick: this.onEntryCreate
            }}
            fluid
            actionPosition="left"
            placeholder="Titel des Eintrags"
            onChange={this.handleNameChange}
            value={this.state.newEntryName}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
        <Grid.Column width={16}>
          <Form>
          <Form.Input label="Einträge filtern" width={6}>
              <Dropdown
              placeholder="Alle Projekte"
              fluid
              selection
              options={groupsDropdown}
              onChange={this.handleGroupChange}
              value={this.state.groupId}
              />
          </Form.Input>
          </Form>
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderEntries() {
    if (this.state.loadingEntries) {
      return this.renderLoading()
    }

    return this.renderEntriesList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Lade Einträge
        </Loader>
      </Grid.Row>
    )
  }

  renderEntriesList() {
    return (
      <EntryList {...{
        entries: this.state.entries,
        groups: this.state.groups,
        onEntryDelete: this.onEntryDelete,
        onEditButtonClick: this.onEditButtonClick
      }}/>
    )
  }
}
