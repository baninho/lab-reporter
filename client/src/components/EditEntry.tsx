import * as React from 'react'
import { Form, Button, Grid, Loader, SegmentGroup, Segment, Icon, Container, Dropdown, DropdownProps } from 'semantic-ui-react'
import Auth from '../auth/Auth'
import { deleteAttachment, deleteEntry, getEntryById, getUploadUrl, patchEntry, uploadFile } from '../api/entries-api'
import { Entry } from '../types/Entry'
import { UpdateEntryRequest } from '../types/UpdateEntryRequest'
import { History } from 'history'
import { Attachment } from '../types/Attachment'
import { HashTable } from '../types/HashTable'
import { Group } from '../types/Group'
import { getGroups } from '../api/groups-api'
import { User } from '../types/User'
import { getUserById } from '../api/users-api'
import { parseUserId } from '../util/utils'

enum UploadState {
  NoUpload,
  FetchingPresignedUrl,
  UploadingFile,
}

interface EditEntryProps {
  match: {
    params: {
      entryId: string
    }
  }
  auth: Auth
  history: History
}

interface EditEntryState {
  file: any
  uploadState: UploadState
  entry: Entry
  entryBody?: string
  loadingEntries: boolean
  fileInputKey: string
  deleting: HashTable
  title: string
  groups: Group[]
  groupId: string
}

export class EditEntry extends React.PureComponent<
EditEntryProps,
EditEntryState
> {
  state: EditEntryState = {
    file: undefined,
    uploadState: UploadState.NoUpload,
    entry: new Entry(),
    entryBody: undefined,
    loadingEntries: true,
    fileInputKey: Date.now().toLocaleString(),
    deleting: {},
    title: '',
    groups: [],
    groupId: ''
  }
  
  handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return
    
    this.setState({
      file: files[0]
    })
  }
  
  handleBodyChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const entryBody = event.target.value
    
    this.setState({
      entryBody: entryBody
    })
  }
  
  handleUpload = async (event: React.SyntheticEvent) => {
    const fileExtRegex = /\.\w+$/i
    event.preventDefault()
    
    try {
      if (!this.state.file) {
        alert('File should be selected')
        return
      }
      
      this.setUploadState(UploadState.FetchingPresignedUrl)
      const fileExtMatch = this.state.file.name.match(fileExtRegex)
      const fileExt: string = fileExtMatch ? fileExtMatch[0] : ''
      
      const attachment: Attachment = await getUploadUrl(this.props.auth.getIdToken(), this.props.match.params.entryId, fileExt)

      attachment.name = this.state.file.name
      
      const updatedEntry: UpdateEntryRequest = {
        name: this.state.entry.name,
        groupId: this.state.entry.groupId,
        addAttachment: attachment
      }
      
      this.setUploadState(UploadState.UploadingFile)
      await uploadFile(attachment.uploadUrl, this.state.file)
      await patchEntry(this.props.auth.getIdToken(), this.props.match.params.entryId, updatedEntry)
    } catch (e) {
      alert('Could not upload a file: ' + e.message)
    } finally {
      this.setUploadState(UploadState.NoUpload)
      const entry: Entry = await getEntryById(this.props.auth.getIdToken(), this.props.match.params.entryId)
      this.setState({
        entry,
        fileInputKey: Date.now().toLocaleString()
      })
    }
  }
  
  /**
   * Update form using the update entry API
   * 
   * @param event submit event from form
   * @returns nothing
   */
  handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()
    
    try {
      if (!this.state.entry) {
        alert('Konnte Eintrag nicht laden')
        return
      }
      
      const updatedEntry: UpdateEntryRequest = {
        name: this.state.title,
        groupId: this.state.entry.groupId,
        updateGroupId: this.state.groupId
      }
      
      if (this.state.entryBody)
      updatedEntry.entryBody = this.state.entryBody
      
      await patchEntry(this.props.auth.getIdToken(), this.props.match.params.entryId, updatedEntry)
    } catch (e) {
      alert('Nicht aktualisiert: ' + e.message)
    } finally {
      this.props.history.push(`/entries/${this.state.entry.entryId}`)
    }
  }
  
  /* 
  * Delete an attachment from the database entry and from storage 
  */
  handleAttachmentDelete = async (event: React.SyntheticEvent, key: string) => {
    event.preventDefault()
    const deleting = { ...this.state.deleting}
    
    try {
      deleting[key] = true
      this.setState({
        deleting
      })
      await deleteAttachment(this.props.auth.getIdToken(), key)
    } catch (e) {
      alert ('Delete failed: ' + e.message)
    } finally {
      const entry: Entry = await getEntryById(this.props.auth.getIdToken(), this.props.match.params.entryId)
      deleting[key] = false
      this.setState({
        entry,
        deleting
      })
    }
  }
  
  setUploadState(uploadState: UploadState) {
    this.setState({
      uploadState
    })
  }
  
  onEntryDelete = async (entryId: string) => {
    try {
      await deleteEntry(this.props.auth.getIdToken(), entryId)
      
    } catch (e) {
      alert('Entry deletion failed: ' + e.message)
    } finally {
      this.props.history.push(`/`)
    }
  }

  /**
   * Change handler for title field
   */
  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const title = event.target.value
    
    this.setState({
      title
    })
  }

  /**
   * Change handler for group dropdown
   */
   handleGroupChange = (event: React.SyntheticEvent, data: DropdownProps) => {
    const groupId: string = data.value as string
    
    this.setState({
      groupId
    })
  }
  
  async componentDidMount() {
    const entry: Entry = await getEntryById(this.props.auth.getIdToken(), this.props.match.params.entryId)
    const user: User = await getUserById(this.props.auth.idToken, parseUserId(this.props.auth.idToken))
    const groups: Group[] = (await getGroups(this.props.auth.getIdToken())).filter(g => {return user.groups.includes(g.groupId)})
    const deleting: HashTable = {}
    entry.attachments.forEach((att) => {deleting[att.key] = false})
    
    this.setState({
      entry,
      entryBody: entry.body,
      loadingEntries: false,
      deleting,
      title: entry.name,
      groups,
      groupId: entry.groupId
    })
  }
  
  renderEdit() {
    const groupsDropdown = this.state.groups.map((group) => {
      return {
        key: group.groupId,
        text: group.name,
        value: group.groupId
      }
    })
    return (
      <Container style={{ padding: '4em 0em' }}>
        <h2>Eintrag bearbeiten</h2>
        <h1>{this.state.entry.name}</h1>
        <Form onSubmit={this.handleSubmit}>
          <Form.Group>
          <Form.Input 
          label="Titel"
          value={this.state.title}
          width={8}
          placeholder="Neuer Eintrag"
          onChange={this.handleNameChange}
          />
          <Form.Input label="Projekt" width={6}>
            <Dropdown
            placeholder="Projekt ausw??hlen"
            fluid
            selection
            options={groupsDropdown}
            onChange={this.handleGroupChange}
            defaultValue={this.state.entry.groupId}
            />
          </Form.Input>
          </Form.Group>
          <Form.TextArea
          label="Eintrag"
          rows={10}
          placeholder={this.state.entry.body ? this.state.entry.body : 'Eintrag hier verfassen'}
          value={this.state.entryBody ? this.state.entryBody : ''}
          onChange={this.handleBodyChange}
          />
          {this.state.entry.attachments[0] && this.state.entry.attachments[0].attachmentUrl && <b>Dateien</b>}
          {this.state.entry.attachments[0] && this.state.entry.attachments[0].attachmentUrl ? this.renderFiles() : ''}
          <Grid>
            <Grid.Row>
              <Grid.Column width={14}>
                <Form.Field>
                  <label>Datei anf??gen</label>
                  <input
                  type="file"
                  accept="image/*"
                  placeholder="Image to upload"
                  onChange={this.handleFileChange}
                  key={this.state.fileInputKey}
                  />
                </Form.Field>
              </Grid.Column>
              <Grid.Column width={2} verticalAlign="bottom">
                {this.renderUploadbutton()}
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                {this.renderSubmitButton()}
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Form>
      </Container>
    )
  }

  renderLoading() {
    return (
      <Grid.Row style={{ padding: '4em 0em' }}>
      <Loader indeterminate active inline="centered">
      Lade Eintrag
      </Loader>
      </Grid.Row>
      )
  }

  renderUploadbutton() {
    return (
      <div>
      <Button
      loading={this.state.uploadState !== UploadState.NoUpload}
      onClick={this.handleUpload}
      floated="right"
      color="grey"
      >
      Upload
      </Button>
      </div>
      )
  }
    
  renderSubmitButton() {
    return (
      <div>
      <Button
      loading={this.state.uploadState !== UploadState.NoUpload}
      tpye="submit"
      color="blue"
      >
      Eintrag aktualisieren
      </Button>
      <Button
      loading={this.state.uploadState !== UploadState.NoUpload}
      color="red"
      onClick={(e) => {
        e.preventDefault()
        if (window.confirm('Wirklich l??schen?')) this.onEntryDelete(this.state.entry.entryId)
      }}
      >
      Eintrag l??schen
      </Button>
      </div>
      )
  }

  renderFiles() {
    return (
      <SegmentGroup>
      {this.state.entry.attachments.map((att) => {
        return (
          <Segment key={att.key}>
          <Grid>
          <Grid.Column width={15} verticalAlign="middle">
          <a href={att.attachmentUrl}>{att.name}</a>
          </Grid.Column>
          <Grid.Column width={1} floated="right">
          <Button
          icon
          color="grey"
          onClick={(event) => {return (this.handleAttachmentDelete(event, att.key))}}
          loading={this.state.deleting[att.key]}
          >
          <Icon name="delete" />
          </Button>
          </Grid.Column>
          </Grid>
          </Segment>
          )
        })
      }
      </SegmentGroup>
      )
  }
  render() {
    if (this.state.loadingEntries) {
      return this.renderLoading()
    }
    
    return this.renderEdit()
  }
}