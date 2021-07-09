import * as React from 'react'
import { Form, Button, Grid, Loader } from 'semantic-ui-react'
import Auth from '../auth/Auth'
import { getEntryById, getUploadUrl, patchEntry, uploadFile } from '../api/entries-api'
import { Entry } from '../types/Entry'
import { UpdateEntryRequest } from '../types/UpdateEntryRequest'
import { History } from 'history'

enum UploadState {
  NoUpload,
  FetchingPresignedUrl,
  UploadingFile,
}

interface EditTodoProps {
  match: {
    params: {
      todoId: string
    }
  }
  auth: Auth
  history: History
}

interface EditTodoState {
  file: any
  uploadState: UploadState
  entry?: Entry
  entryBody?: string
  loadingEntries: boolean
}

export class EditTodo extends React.PureComponent<
  EditTodoProps,
  EditTodoState
> {
  state: EditTodoState = {
    file: undefined,
    uploadState: UploadState.NoUpload,
    entry: undefined,
    entryBody: undefined,
    loadingEntries: true
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
    if (!entryBody) return

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

      if (!this.state.entry) {
        alert('Konnte Eintrag nicht laden')
        return
      }

      this.setUploadState(UploadState.FetchingPresignedUrl)
      const fileExtMatch = this.state.file.name.match(fileExtRegex)
      const fileExt: string = fileExtMatch ? fileExtMatch[0] : ''

      const attachmentInfo: any = await getUploadUrl(this.props.auth.getIdToken(), this.props.match.params.todoId, fileExt)

      const updatedEntry: UpdateEntryRequest = {
        name: this.state.entry.name,
        dueDate: this.state.entry.dueDate,
        done: this.state.entry.done,
        attachmentUrl: attachmentInfo.attachmentUrl
      }

      this.setUploadState(UploadState.UploadingFile)
      await uploadFile(attachmentInfo.uploadUrl, this.state.file)
      await patchEntry(this.props.auth.getIdToken(), this.props.match.params.todoId, updatedEntry)

      alert('File was uploaded!')
    } catch (e) {
      alert('Could not upload a file: ' + e.message)
    } finally {
      this.setUploadState(UploadState.NoUpload)
    }
  }

  handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    try {
      if (!this.state.entry) {
        alert('Konnte Eintrag nicht laden')
        return
      }

      const updatedEntry: UpdateEntryRequest = {
        name: this.state.entry.name,
        dueDate: this.state.entry.dueDate,
        done: this.state.entry.done,
      }

      if (this.state.entryBody)
        updatedEntry.entryBody = this.state.entryBody

      await patchEntry(this.props.auth.getIdToken(), this.props.match.params.todoId, updatedEntry)
    } catch (e) {
      alert('Nicht aktualisiert: ' + e.message)
    } finally {
      this.props.history.push('/')
    }
  }

  setUploadState(uploadState: UploadState) {
    this.setState({
      uploadState
    })
  }

  async componentDidMount() {
    const entry: Entry = await getEntryById(this.props.auth.getIdToken(), this.props.match.params.todoId)

    this.setState({
      entry,
      entryBody: entry.body,
      loadingEntries: false
    })
  }

  renderEdit() {
    return (
      <div>
        <h2>Eintrag bearbeiten</h2>
        <h1>{this.state.entry ? this.state.entry.name : ''}</h1>

        <Form onSubmit={this.handleSubmit}>
          <Form.TextArea
            label="Eintrag"
            rows={10}
            placeholder={this.state.entry ? (this.state.entry.body ? this.state.entry.body : 'Eintrag hier verfassen') : ''}
            value={this.state.entryBody ? this.state.entryBody : ''}
            onChange={this.handleBodyChange}
          />
          <Form.Field>
            <label>Datei anfügen</label>
            <input
              type="file"
              accept="image/*"
              placeholder="Image to upload"
              onChange={this.handleFileChange}
            />
          </Form.Field>

          {this.renderButton()}
        </Form>
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

  renderButton() {

    return (
      <div>
        {this.state.uploadState === UploadState.FetchingPresignedUrl && <p>Uploading image metadata</p>}
        {this.state.uploadState === UploadState.UploadingFile && <p>Uploading file</p>}
        <Button
          loading={this.state.uploadState !== UploadState.NoUpload}
          onClick={this.handleUpload}
        >
          Upload
        </Button>
        <Button
          loading={this.state.uploadState !== UploadState.NoUpload}
          tpye="submit"
        >
          Eintrag aktualisieren
        </Button>
      </div>
    )
  }

  render() {
    if (this.state.loadingEntries) {
      return this.renderLoading()
    }

    return this.renderEdit()
  }
}
