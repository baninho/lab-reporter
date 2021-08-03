import * as React from 'react'
import Auth from '../auth/Auth'
import { deleteEntry, getEntryById } from '../api/entries-api'
import { Entry } from '../types/Entry'
import { Button, Grid, Header, Icon, Loader, Segment, SegmentGroup } from 'semantic-ui-react'
import { History } from 'history'

interface EntryDetailProps {
  match: {
    params: {
      entryId: string
    }
  }
  auth: Auth
  history: History
}

interface EntryDetailState {
  entry: Entry
  loadingEntries: boolean
}

export class EntryDetail extends React.PureComponent<
  EntryDetailProps,
  EntryDetailState
> {
  state: EntryDetailState = {
    entry: new Entry(),
    loadingEntries: true
  }

  onEntryDelete = async (e: React.SyntheticEvent, entryId: string) => {
    e.preventDefault()

    if (!window.confirm('Wirklich löschen?')) return

    try {
      await deleteEntry(this.props.auth.getIdToken(), entryId)

    } catch (e) {
      alert('Entry deletion failed: ' + e.message)
    } finally {
      this.props.history.push(`/`)
    }
  }

  onEditButtonClick = (entryId: string) => {
    this.props.history.push(`/entries/${entryId}/edit`)
  }

  async componentDidMount() {
    try {
      const entry = await getEntryById(this.props.auth.getIdToken(), this.props.match.params.entryId)
      this.setState({
        entry,
        loadingEntries: false
      })
    } catch (e) {
      alert(`Failed to fetch entry: ${e.message}`)
    }
  }

  renderEntry() {
    return (
      <div>
        <Grid>
          <Grid.Column width={14}>
            <Header as="h1">{this.state.entry.name}</Header>
          </Grid.Column>
          <Grid.Column width={2}>
            <Button
              icon
              color="red"
              onClick={(e) => this.onEntryDelete(e, this.state.entry.entryId)}
              floated="right"
            >
              <Icon name="delete" />
            </Button>
            <Button
              icon
              color="blue"
              onClick={() => this.onEditButtonClick(this.state.entry.entryId)}
              floated="right"
            >
              <Icon name="pencil" />
            </Button>
          </Grid.Column>
        </Grid>

        <Grid padded>
          <Grid.Row>
            <Grid.Column>
              {this.state.entry.body}
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <SegmentGroup>
              {this.state.entry.attachments.map((att) => {
                return (
                  <Segment key={att.key}><a href={att.attachmentUrl}>{att.attachmentUrl}</a></Segment>
                )
              })}
            </SegmentGroup>
          </Grid.Row>
        </Grid>
      </div>
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
    if (this.state.loadingEntries) {
      return this.renderLoading()
    }

    return this.renderEntry()
  }
}
