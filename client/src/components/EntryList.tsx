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
  render() {
    return (
      <Container>
      {this.props.entries.map((entry, pos) => {
        const group = this.props.groups.find((g) => {return g.groupId === entry.groupId})
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