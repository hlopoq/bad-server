import { Router } from 'express'
import {
    deleteCustomer,
    getCustomerById,
    getCustomers,
    updateCustomer,
} from '../controllers/customers'
import auth from '../middlewares/auth'

const customersRouter = Router()

// Получить список всех клиентов
customersRouter.get('/', auth, getCustomers)
// Получить клиента по ID
customersRouter.get('/:id', auth, getCustomerById)
// Обновить данные клиента
customersRouter.patch('/:id', auth, updateCustomer)
// Удалить клиента
customersRouter.delete('/:id', auth, deleteCustomer)

export default customersRouter
