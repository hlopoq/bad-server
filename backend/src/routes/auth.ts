import { Router } from 'express'
import {
    getCurrentUser,
    getCurrentUserRoles,
    login,
    logout,
    refreshAccessToken,
    register,
    updateCurrentUser,
} from '../controllers/auth'
import auth from '../middlewares/auth'

const router = Router()

// Получение информации о текущем пользователе
router.get('/user', auth, getCurrentUser)
// Обновление данных текущего пользователя
router.patch('/me', auth, updateCurrentUser)
// Получение ролей текущего пользователя
router.get('/user/roles', auth, getCurrentUserRoles)
// Авторизация (логин)
router.post('/login', login)
// Обновление токенов
router.get('/token', refreshAccessToken)
// Выход из системы
router.get('/logout', logout)
// Регистрация нового пользователя
router.post('/register', register)

export default router
