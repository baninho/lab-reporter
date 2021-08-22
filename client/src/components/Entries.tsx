import { History } from 'history'
import * as React from 'react'
import { Link } from 'react-router-dom'
import {
  Button,
  Divider,
  Grid,
  Icon,
  Input,
  Image,
  Loader,
  Container
} from 'semantic-ui-react'

import { createEntry, deleteEntry, getEntries } from '../api/entries-api'
import { getGroups } from '../api/groups-api'
import Auth from '../auth/Auth'
import { Entry } from '../types/Entry'
import { Group } from '../types/Group'

interface EntriesProps {
  auth: Auth
  history: History
}

interface EntriesState {
  entries: Entry[]
  newEntryName: string
  loadingEntries: boolean
  groups: Group[]
}

export class Entries extends React.PureComponent<EntriesProps, EntriesState> {
  state: EntriesState = {
    entries: [],
    newEntryName: '',
    loadingEntries: true,
    groups: []
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newEntryName: event.target.value })
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
      <Container>
        {this.state.entries.map((entry, pos) => {
          const group = this.state.groups.find((g) => {return g.groupId === entry.groupId})
          return (
            <Grid>
            <Grid.Row key={entry.entryId}>
              <Grid.Column width={7} verticalAlign="middle">
                <Link to={`/entries/${entry.entryId}`}><h3>{entry.name}</h3></Link>
              </Grid.Column>
              <Grid.Column width={4}>
                {group ? group.name : ''}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {entry.createdAt}
              </Grid.Column>
              <Grid.Column width={2} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onEntryDelete(entry.entryId)}
                  floated="right"
                >
                  <Icon name="delete" />
                </Button>
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(entry.entryId)}
                  floated="right"
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={2}>
              {entry.attachments[0] && (
                <Image src={entry.attachments[0].attachmentUrl} size="small" wrapped />
              )}
              </Grid.Column>
              <Grid.Column  width={14}>
                <span style={{whiteSpace: "pre-wrap"}}>{entry.body}</span>
              </Grid.Column>
            </Grid.Row>
            <Divider />
            </Grid>
          )
        })}
      </Container>
    )
  }
}
