import { upload } from "../config/multer-config";

export const filesValidation = upload.fields([
  { name: 'file' },
]);
