import { Router } from 'express'
import {
    createOrder,
    deleteOrder,
    getOrderByNumber,
    getOrderCurrentUserByNumber,
    getOrders,
    getOrdersCurrentUser,
    updateOrder,
} from '../controllers/order'
import auth, { roleGuardMiddleware } from '../middlewares/auth'
import { validateOrderBody } from '../middlewares/validations'
import { Role } from '../models/user'

const router = Router()

// Создание нового заказа
router.post('/', auth, validateOrderBody, createOrder)

// Получение всех заказов (доступно администратору)
router.get('/all', auth, getOrders)

// Получение заказов текущего пользователя
router.get('/all/me', auth, getOrdersCurrentUser)

// Получение конкретного заказа по номеру (только для администратора)
router.get(
    '/:orderNumber',
    auth,
    roleGuardMiddleware(Role.Admin),
    getOrderByNumber
)

// Получение заказа текущего пользователя по номеру
router.get('/me/:orderNumber', auth, getOrderCurrentUserByNumber)

// Обновление заказа (только для администратора)
router.patch(
    '/:orderNumber',
    auth,
    roleGuardMiddleware(Role.Admin),
    updateOrder
)

// Удаление заказа (только для администратора)
router.delete('/:id', auth, roleGuardMiddleware(Role.Admin), deleteOrder)

export default router
