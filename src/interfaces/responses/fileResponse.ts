export interface FileResponse {
  url: string,
  fieldName: string,
  originalName: string
}

export interface UploadFilesResponse {
  files: FileResponse[]
}