import dateFormat from 'dateformat'
import { History } from 'history'
import * as React from 'react'
import { Link } from 'react-router-dom'
import {
  Button,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createEntry, deleteEntry, getEntries } from '../api/entries-api'
import Auth from '../auth/Auth'
import { Entry } from '../types/Entry'

interface EntriesProps {
  auth: Auth
  history: History
}

interface EntriesState {
  entries: Entry[]
  newEntryName: string
  loadingEntries: boolean
}

export class Entries extends React.PureComponent<EntriesProps, EntriesState> {
  state: EntriesState = {
    entries: [],
    newEntryName: '',
    loadingEntries: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newEntryName: event.target.value })
  }

  onEditButtonClick = (entryId: string) => {
    this.props.history.push(`/entries/${entryId}/edit`)
  }

  onEntryCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const dueDate = this.calculateDueDate()
      const newEntry = await createEntry(this.props.auth.getIdToken(), {
        name: this.state.newEntryName,
        dueDate
      })
      this.setState({
        entries: [newEntry, ...this.state.entries],
        newEntryName: ''
      })
    } catch(e) {
      alert('Entry creation failed: ' + e.message)
    }
  }

  onEntryDelete = async (entryId: string) => {
    try {
      await deleteEntry(this.props.auth.getIdToken(), entryId)
      this.setState({
        entries: this.state.entries.filter(entry => entry.entryId !== entryId)
      })
    } catch(e) {
      alert('Entry deletion failed: ' + e.message)
    }
  }

  async componentDidMount() {
    try {
      const entries = await getEntries(this.props.auth.getIdToken())
      this.setState({
        entries,
        loadingEntries: false
      })
    } catch (e) {
      alert(`Failed to fetch entries: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Laborbuch</Header>

        {this.renderCreateEntryInput()}

        {this.renderEntries()}
      </div>
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
              content: 'New entry',
              onClick: this.onEntryCreate
            }}
            fluid
            actionPosition="left"
            placeholder="Choose a title"
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
      <Grid padded>
        {this.state.entries.map((entry, pos) => {
          return (
            <Grid.Row key={entry.entryId}>
              <Grid.Column width={10} verticalAlign="middle">
                <Link to={`/entries/${entry.entryId}`}>{entry.name}</Link>
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {entry.dueDate}
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
              {entry.attachments[0] && (
                <Image src={entry.attachments[0].attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
