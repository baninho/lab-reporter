import React from "react"
import { Link } from "react-router-dom"
import { Button, Container, Divider, Grid, Icon, Image } from "semantic-ui-react"
import { Entry } from "../types/Entry"
import { Group } from "../types/Group"

interface EntryListProps {
  entries: Entry[]
  groups: Group[]
  onEntryDelete: any
  onEditButtonClick: any
}

interface EntryListState {

}

export class EntryList extends React.PureComponent<EntryListProps, EntryListState> {
  options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

  render() {
    return (
      <Container>
      {this.props.entries.map((entry, pos) => {
        const createdAt = new Date(entry.createdAt)
        const group = this.props.groups.find((g) => {return g.groupId === entry.groupId})
        let body: string
        if (entry.body) {
          body = entry.body.substring(0, 1000)
          if (body.length < entry.body.length) body = body.concat('...')
        } else body = ''
        
        return (
          <Grid key={entry.entryId}>
          <Grid.Row>
            <Grid.Column width={7} verticalAlign="middle">
              <Link to={`/entries/${entry.entryId}`}><h3>{entry.name}</h3></Link>
            </Grid.Column>
            <Grid.Column width={4}>
              {group ? group.name : ''}
            </Grid.Column>
            <Grid.Column width={3} floated="right">
              {createdAt.toLocaleDateString('de-DE', this.options)}
            </Grid.Column>
            <Grid.Column width={2} floated="right">
              <Button
                icon
                color="red"
                onClick={() => this.props.onEntryDelete(entry.entryId)}
                floated="right"
              >
                <Icon name="delete" />
              </Button>
              <Button
                icon
                color="blue"
                onClick={() => this.props.onEditButtonClick(entry.entryId)}
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
            <Grid.Column  width={12}>
              <span style={{whiteSpace: "pre-wrap"}}>{body}</span>
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