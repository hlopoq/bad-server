import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import {
    deleteCustomer,
    getCustomerById,
    getCustomers,
    updateCustomer,
} from '../controllers/customers'
import auth, { roleGuardMiddleware } from '../middlewares/auth'
import { Role } from '../models/user'

const router = Router()

// Лимит запросов к массовым операциям
const customerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 25,                 // не более 25 запросов с одного IP
  message: 'Слишком много запросов, попробуйте позже',
  standardHeaders: true,
  legacyHeaders: false,
})

// Получить список всех клиентов (только для администратора)
router.get('/',
    customerLimiter,
    auth,
    roleGuardMiddleware(Role.Admin),
    getCustomers
)

// Получить одного клиента по ID
router.get('/:id', auth, roleGuardMiddleware(Role.Admin), getCustomerById)

// Обновить данные клиента (с ограничением запросов)
router.patch('/:id',
    customerLimiter,
    auth,
    roleGuardMiddleware(Role.Admin),
    updateCustomer
)

// Удалить клиента
router.delete('/:id', auth, roleGuardMiddleware(Role.Admin), deleteCustomer)

export default router
