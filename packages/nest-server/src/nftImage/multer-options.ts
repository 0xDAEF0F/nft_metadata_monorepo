import { UnsupportedMediaTypeException } from '@nestjs/common'
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface'
import { Request } from 'express'

const imageFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: (errror: Error | null, acceptFile: boolean) => void,
) => {
  if (!Boolean(file.mimetype.match(/(jpg|jpeg|png)/)))
    cb(new UnsupportedMediaTypeException(), false)
  cb(null, true)
}

export const imageOptions: MulterOptions = {
  fileFilter: imageFilter,
  limits: { fileSize: 3_000_000 },
}
