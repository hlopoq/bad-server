import { Request, Express } from 'express'
import multer, { FileFilterCallback } from 'multer'
import { mkdirSync } from 'fs'
import { join } from 'path'

type DestCallback = (error: Error | null, destination: string) => void
type NameCallback = (error: Error | null, filename: string) => void

// Настройка хранилища
const diskStorage = multer.diskStorage({
  destination: (
    _req: Request,
    _file: Express.Multer.File,
    cb: DestCallback
  ) => {
    const basePath = process.env.UPLOAD_PATH_TEMP
      ? join(__dirname, `../public/${process.env.UPLOAD_PATH_TEMP}`)
      : join(__dirname, '../public')

    mkdirSync(basePath, { recursive: true })
    cb(null, basePath)
  },

  filename: (
    _req: Request,
    file: Express.Multer.File,
    cb: NameCallback
  ) => {
    // Используем оригинальное имя, но в дальнейшем лучше генерировать уникальное
    cb(null, file.originalname)
  },
})

// Разрешённые MIME-типы
const allowedMimeTypes = [
  'image/png',
  'image/jpg',
  'image/jpeg',
  'image/gif',
  'image/svg+xml',
]

// Фильтр файлов по типу
const imageFileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(null, false)
  }
  cb(null, true)
}

export default multer({ storage: diskStorage, fileFilter: imageFileFilter })
