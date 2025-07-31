import { UploadFilesResponse } from "../responses/fileResponse";

export interface IFileService {
  uploadFiles(files: Express.Multer.File[], type: string, requestId: string): Promise<UploadFilesResponse>;
}