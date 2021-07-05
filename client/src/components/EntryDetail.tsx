import * as React from 'react'
import Auth from '../auth/Auth'
import { getEntryById } from '../api/entries-api'
import { Entry } from '../types/Entry'
import { Grid, Header, Loader } from 'semantic-ui-react'

interface EntryDetailProps {
  match: {
    params: {
      entryId: string
    }
  }
  auth: Auth
}

interface EntryDetailState {
  entry: Entry[]
  loadingEntries: boolean
}

export class EntryDetail extends React.PureComponent<
  EntryDetailProps,
  EntryDetailState
> {
  state: EntryDetailState = {
    entry: [],
    loadingEntries: true
  }

  async componentDidMount() {
    try {
      const entry = await getEntryById(this.props.auth.getIdToken(), this.props.match.params.entryId)
      this.setState({
        entry: [entry],
        loadingEntries: false
      })
    } catch (e) {
      alert(`Failed to fetch entry: ${e.message}`)
    }
  }

  renderEntry() {
    return (
      <div>
        <Header as="h1">{this.state.entry[0] ? this.state.entry[0].name : ''}</Header>
        <Grid padded>
          <Grid.Row>
            <Grid.Column>
              {this.state.entry[0].body}
            </Grid.Column>
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
