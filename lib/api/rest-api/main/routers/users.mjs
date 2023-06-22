import express     from 'express'
// import middlewares from '../../middlewares.mjs'

import controllers from '../controllers/index.mjs'

const router = express.Router()
const checkSession = controllers.tokens.check
// const busboy = middlewares.busboy


// Users

/**
 * @swagger
 * components:
 *   schemas:
 *     UserBase:
 *       type: object
 *       required:
 *              - email
 *              - firstName
 *              - secondName
 *              - patronymic
 *       properties:
 *              email:
 *                 type: string
 *                 example: vmiheev@ya.ru
 *              firstName:
 *                   type: string
 *                   example: Влад
 *              secondName:
 *                  type: string
 *                  example: Михеев
 *              patronymic:
 *                  type: string
 *                  example: Сергеевич
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UserOut:
 *      properties:
 *         data:
 *           type: object
 *           allOf:
 *            - type: object
 *              properties:
 *                  id:
 *                     type: string
 *            - $ref: '#/components/schemas/UserBase'
 */

/**
 * @swagger
 * /api/v1/users:
 *   post:
 *     summary: Создание User
 *     tags:
 *     - User
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            allOf:
 *              - $ref: '#/components/schemas/UserBase'
 *              - type: object
 *                properties:
 *                   password:
 *                        type: string
 *                        example: 123
 *                   confirmPassword:
 *                        type: string
 *                        example: 123
 *     responses:
 *       200:
 *         description: Созданный пользователь
 *         content:
 *          application/json:
 *            schema:
 *                $ref: '#/components/schemas/UserOut'
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


router.post('/users',  controllers.users.create)


router.post('/users/resetPassword',       controllers.users.resetPassword)

/**
 * @swagger
 * /api/v1/users/{id}:
 *   get:
 *     summary: Получение User
 *     tags:
 *     - User
 *     parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: string
 *           required: true
 *     responses:
 *       200:
 *         description: Возвращается User
 *         content:
 *          application/json:
 *            schema:
 *               $ref: '#/components/schemas/UserOut'
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
router.get('/users/:id',    checkSession, controllers.users.show)


/**
 * @swagger
 * /api/v1/users/:
 *   get:
 *     summary: Получить список User
 *     tags:
 *     - User
 *     parameters:
 *         - in: query
 *           name: search
 *           schema:
 *             type: string
 *         - in: query
 *           name: limit
 *           schema:
 *             type: number
 *             default: 20
 *         - in: query
 *           name: offset
 *           schema:
 *             type: number
 *             default: 0
 *         - in: query
 *           name: sortedBy
 *           schema:
 *             type: string
 *             default: createdAt
 *         - in: query
 *           name: order
 *           schema:
 *             type: string
 *             enum: [ASC, DESC]
 *             default: DESC
 *     responses:
 *       200:
 *         content:
 *          application/json:
 *            schema:
 *               type: object
 *               properties:
 *                  data:
 *                    type: array
 *                    items:
 *                      $ref: '#/components/schemas/UserOut'
 *                  meta:
 *                    type: object
 *                    properties:
 *                       totalCount:
 *                          type: number
 *                       filteredCount:
 *                          type: number
 *                       limit:
 *                          type: number
 *                       offset:
 *                          type: number
 *
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
router.get('/users',  checkSession,    controllers.users.list)

/**
 * @swagger
 * /api/v1/users/{id}:
 *   put:
 *     summary: Обновление User
 *     tags:
 *     - User
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
 *              - $ref: '#/components/schemas/UserBase'
 *     responses:
 *       200:
 *         description: Возвращается обновленный User
 *         content:
 *          application/json:
 *            schema:
 *               $ref: '#/components/schemas/UserOut'
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
router.put('/users/:id',    checkSession, controllers.users.update)


/**
 * @swagger
 * /api/v1/users/{id}:
 *   delete:
 *     summary: Удаление User
 *     tags:
 *     - User
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
router.delete('/users/:id', checkSession, controllers.users.delete)


export default router
