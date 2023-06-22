import express     from 'express'
import controllers from '../controllers/index.mjs'

const router = express.Router()
const checkSession = controllers.tokens.check
// Tasks

/**
 * @swagger
 * components:
 *   schemas:
 *     Error500:
 *       type: object
 *       properties:
 *            error:
 *              type: object
 *              properties:
 *                  message:
 *                      type: string
 *                      default: Please, contact your system administartor!
 *                  code:
 *                     type: string
 *                     default: SERVER_ERROR
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Error400:
 *        type: object
 *        properties:
 *             error:
 *               type: object
 *               properties:
 *                  fields:
 *                     type: object
 *                     properties:
 *                          <property>:
 *                             type: string
 *                             default: REQUIRED
 *                  code:
 *                     type: string
 *                     default: FORMAT_ERROR
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Error401:
 *        type: object
 *        properties:
 *             error:
 *               type: object
 *               properties:
 *                  fields:
 *                     type: object
 *                     properties:
 *                          email:
 *                             type: string
 *                             default: INVALID
 *                          password:
 *                             type: string
 *                             default: INVALID
 *                  code:
 *                     type: string
 *                     default: AUTHENTICATION_FAILED
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     TaskBase:
 *       type: object
 *       required:
 *              - shortName
 *              - description
 *              - status
 *       properties:
 *              shortName:
 *                 type: string
 *              description:
 *                 type: string
 *              status:
 *                 type: string
 *                 enum: [ACTIVE, ARCHIVE, PENDING]
 *                 default: PENDING
 */


/**
 * @swagger
 * components:
 *   schemas:
 *     TaskOut:
 *        properties:
 *          data:
 *            type: object
 *            allOf:
 *             - type: object
 *               properties:
 *                id:
 *                  type: string
 *                  required: true
 *             - $ref: '#/components/schemas/TaskBase'
 */
/**
 * @swagger
 * /api/v1/tasks:
 *   post:
 *     summary: Создание Task
 *     tags:
 *     - Task
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            allOf:
 *              - $ref: '#/components/schemas/TaskBase'
 *     responses:
 *       200:
 *         description: Созданный Task
 *         content:
 *          application/json:
 *            schema:
 *                $ref: '#/components/schemas/TaskOut'
 *       400:
 *        description: Ошибка данных
 *        content:
 *          application/json:
 *            schema:
 *               $ref: '#/components/schemas/Error400'
 *       500:
 *          description: Ошибка сервера
 *          content:
 *           application/json:
 *            schema:
 *                 $ref: '#/components/schemas/Error500'
 */
router.post('/tasks',       checkSession, controllers.tasks.create)

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   get:
 *     summary: Получение Task
 *     tags:
 *     - Task
 *     parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: string
 *           required: true
 *     responses:
 *       200:
 *         description: Возвращается Task
 *         content:
 *          application/json:
 *            schema:
 *               $ref: '#/components/schemas/TaskOut'
 *       400:
 *        description: Ошибка данных
 *        content:
 *          application/json:
 *            schema:
 *               $ref: '#/components/schemas/Error400'
 *       500:
 *          description: Ошибка сервера
 *          content:
 *           application/json:
 *            schema:
 *                 $ref: '#/components/schemas/Error500'
 */
router.get('/tasks/:id',    checkSession, controllers.tasks.show)

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   put:
 *     summary: Обновление Task
 *     tags:
 *     - Task
 *     parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: string
 *           required: true
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            allOf:
 *              - $ref: '#/components/schemas/TaskBase'
 *     responses:
 *       200:
 *         description: Возвращается обновленный Task
 *         content:
 *          application/json:
 *            schema:
 *               $ref: '#/components/schemas/TaskOut'
 *       400:
 *        description: Ошибка данных
 *        content:
 *          application/json:
 *            schema:
 *               $ref: '#/components/schemas/Error400'
 *       500:
 *          description: Ошибка сервера
 *          content:
 *           application/json:
 *            schema:
 *                 $ref: '#/components/schemas/Error500'
 */
router.put('/tasks/:id',    checkSession, controllers.tasks.update)

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   delete:
 *     summary: Удаление  Task
 *     tags:
 *     -  Task
 *     parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: string
 *           required: true
 *     responses:
 *       200:
 *         description: Успешно
 *       400:
 *        description: Ошибка данных
 *        content:
 *          application/json:
 *            schema:
 *               $ref: '#/components/schemas/Error400'
 *       500:
 *          description: Ошибка сервера
 *          content:
 *           application/json:
 *            schema:
 *                 $ref: '#/components/schemas/Error500'
 */
router.delete('/tasks/:id', checkSession, controllers.tasks.delete)

/**
 * @swagger
 * /api/v1/tasks/:
 *   get:
 *     summary: Получить список Task
 *     tags:
 *     - Task
 *     parameters:
 *        - in: query
 *          name: search
 *          schema:
 *            type: string
 *        - in: query
 *          name: limit
 *          schema:
 *            type: number
 *            default: 20
 *        - in: query
 *          name: offset
 *          schema:
 *            type: number
 *            default: 0
 *        - in: query
 *          name: sortedBy
 *          schema:
 *            type: string
 *            default: createdAt
 *        - in: query
 *          name: order
 *          schema:
 *            type: string
 *            enum: [ASC, DESC]
 *            default: DESC
 *     responses:
 *       200:
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/UserOut'
 *                 meta:
 *                   type: object
 *                   properties:
 *                      totalCount:
 *                         type: number
 *                      filteredCount:
 *                         type: number
 *                      limit:
 *                         type: number
 *                      offset:
 *                         type: number
 *       400:
 *        description: Ошибка данных
 *        content:
 *          application/json:
 *            schema:
 *               $ref: '#/components/schemas/Error400'
 *       500:
 *          description: Ошибка сервера
 *          content:
 *           application/json:
 *            schema:
 *                 $ref: '#/components/schemas/Error500'
 */
router.get('/tasks',        checkSession, controllers.tasks.list)
export default router
