import { Request, Express } from 'express'
import multer, { FileFilterCallback, StorageEngine } from 'multer'
import { mkdirSync, unlinkSync } from 'fs'
import { writeFile } from 'fs/promises'
import path, { join } from 'path'
import BadRequestError from '../errors/bad-request-error'

// Допустимые MIME‑типы изображений
const ALLOWED_MIME = [
  'image/png',
  'image/jpg',
  'image/jpeg',
  'image/gif',
  'image/svg+xml',
]

// Фильтр файлов по MIME‑типу
const mimeTypeFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  cb(null, ALLOWED_MIME.includes(file.mimetype))
}

// Кастомное хранилище: проверяет размер и тип, сохраняет с уникальным именем
const customStorage: StorageEngine = {
  async _handleFile(_req, file, cb) {
    const baseDir = join(
      __dirname,
      process.env.UPLOAD_PATH_TEMP
        ? `../public/${process.env.UPLOAD_PATH_TEMP}`
        : '../public'
    )
    mkdirSync(baseDir, { recursive: true })

    const chunks: Buffer[] = []
    file.stream.on('data', (chunk: Buffer) => chunks.push(chunk))
    file.stream.on('error', cb)
    file.stream.on('end', async () => {
      try {
        const buffer = Buffer.concat(chunks)

        // Проверка размера: минимум 2 КБ, максимум 10 МБ
        if (buffer.length < 2048 || buffer.length > 10485760) {
          return cb(new BadRequestError('Недопустимый размер файла'))
        }

        // Проверка соответствия типа по содержимому
        const { fileTypeFromBuffer } = await import('file-type')
        const type = await fileTypeFromBuffer(buffer)
        if (!type || !ALLOWED_MIME.includes(type.mime)) {
          return cb(new BadRequestError('Недопустимый тип файла'))
        }

        // Генерация безопасного имени файла
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
        const ext = path.extname(file.originalname) || '.jpg'
        const filename = `${uniqueSuffix}${ext}`
        const filePath = join(baseDir, filename)

        await writeFile(filePath, buffer)

        return cb(null, { destination: baseDir, filename, path: filePath, size: buffer.length })
      } catch (err) {
        return cb(err as Error)
      }
    })
  },

  _removeFile(_req, file, cb) {
    unlinkSync(file.path)
    cb(null)
  },
}

export default multer({ storage: customStorage, fileFilter: mimeTypeFilter })
