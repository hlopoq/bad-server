import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { uploadFile } from '../controllers/upload'
import fileMiddleware from '../middlewares/file'

const router = Router()

// Ограничение количества запросов к эндпоинту загрузки
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,          // 15 минут
  max: 10,                           // не более 10 попыток с одного IP
  message: 'Слишком много запросов, попробуйте позже',
  standardHeaders: true,
  legacyHeaders: false,
})

// Маршрут загрузки файла с промежуточной защитой
router.post('/', uploadLimiter, fileMiddleware.single('file'), uploadFile)

export default router
