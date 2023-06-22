import express from 'express'
import tasks from './tasks.mjs'

import tokens  from './tokens.mjs'
import users  from './users.mjs'

const router = express.Router()

router.use(tasks)
router.use(tokens)
router.use(users)


export default router
