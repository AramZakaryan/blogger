import router from 'express'
import { testingControllers } from '../controllers'

export const testingRouter = router()

testingRouter.delete('/', testingControllers.clearDb)
