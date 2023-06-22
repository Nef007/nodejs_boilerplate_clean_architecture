import express     from 'express'
// import middlewares from '../../middlewares.mjs'

import controllers from '../controllers/index.mjs'

const router = express.Router()
const checkSession = controllers.tokens.check


// Auth


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
 *     Token:
 *        type: object
 *        properties:
 *            data:
 *              type: object
 *              properties:
 *                 accessToken:
 *                   type: string
 *                   default: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjAyOTUyNjA3LTcwZmYtNDIyYS1hOGVhLWQyM2Q3NDA5ZmFlMyIsImlhdCI6MTY4MzcyMjU0NCwiZXhwIjoxNjgzNzIzNDQ0fQ.KrXqD0FbbBzRGuzhRSvMz-l0V0bHNYg9MkMTz6Fhkno
 *                 refreshToken:
 *                   type: string
 *                   default: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjAyOTUyNjA3LTcwZmYtNDIyYS1hOGVhLWQyM2Q3NDA5ZmFlMyIsImlhdCI6MTY4MzcyMjU0NCwiZXhwIjoxNjgzNzIzNDQ0fQ.KrXqD0FbbBzRGuzhRSvMz-l0V0bHNYg9MkMTz6Fhkno
 */


/**
 * @openapi
 * '/api/v1/login':
 *  post:
 *     tags:
 *     - Token
 *     summary: Получение токена авторизации
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *         schema:
 *           type: object
 *           required:
 *             - email
 *             - password
 *           properties:
 *              email:
 *                  type: string
 *                  default: vmiheev@ya.ru
 *              password:
 *                  type: string
 *                  default: 123
 *     responses:
 *       200:
 *         description: Созданный токен
 *         headers:
 *             Set-Cookie:
 *               schema:
 *                type: string
 *                example: refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjAyOTUyNjA3LTcwZmYtNDIyYS1hOGVhLWQyM2Q3N; Max-Age=1800; Path=/; Expires=Wed, 10 May 2023 14:53:54 GMT; HttpOnly; Secure; SameSite=None
 *         content:
 *          application/json:
 *            schema:
 *                $ref: '#/components/schemas/Token'
 *       400:
 *        description: Ошибка данных
 *        content:
 *          application/json:
 *            schema:
 *               $ref: '#/components/schemas/Error400'
 *       401:
 *        description: Ошибка Авторизации
 *        content:
 *          application/json:
 *            schema:
 *               $ref: '#/components/schemas/Error401'
 *       500:
 *          description: Ошибка сервера
 *          content:
 *           application/json:
 *            schema:
 *               $ref: '#/components/schemas/Error500'
 */
router.post('/login', controllers.tokens.create)


/**
 * @openapi
 * '/api/v1/refresh':
 *  put:
 *     tags:
 *     - Token
 *     summary: Обновление токена авторизации
 *     responses:
 *       200:
 *         description: Созданный токен
 *         headers:
 *             Set-Cookie:
 *               schema:
 *                 type: string
 *                 example: refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjAyOTUyNjA3LTcwZmYtNDIyYS1hOGVhLWQyM2Q3N; Max-Age=1800; Path=/; Expires=Wed, 10 May 2023 14:53:54 GMT; HttpOnly; Secure; SameSite=None
 *         content:
 *          application/json:
 *            schema:
 *               $ref: '#/components/schemas/Token'
 *       400:
 *        description: Ошибка данных
 *        content:
 *          application/json:
 *            schema:
 *               $ref: '#/components/schemas/Error400'
 *       401:
 *        description: Ошибка Авторизации
 *        content:
 *          application/json:
 *            schema:
 *               $ref: '#/components/schemas/Error401'
 *       500:
 *          description: Ошибка сервера
 *          content:
 *           application/json:
 *            schema:
 *               $ref: '#/components/schemas/Error500'
 */
router.put('/refresh', controllers.tokens.update)


/**
 * @openapi
 * '/api/v1/logout':
 *  delete:
 *     tags:
 *     - Token
 *     summary: Удаление токена авторизации
 *     responses:
 *       200:
 *          description: Успешно
 *       400:
 *        description: Ошибка данных
 *        content:
 *          application/json:
 *            schema:
 *               $ref: '#/components/schemas/Error400'
 *       401:
 *        description: Ошибка Авторизации
 *        content:
 *          application/json:
 *            schema:
 *               $ref: '#/components/schemas/Error401'
 *       500:
 *          description: Ошибка сервера
 *          content:
 *           application/json:
 *            schema:
 *               $ref: '#/components/schemas/Error500'
 */

router.delete('/logout', checkSession, controllers.tokens.delete)


/**
 * @openapi
 * '/api/v1/me':
 *  get:
 *     security:
 *      - bearerAuth: []
 *     tags:
 *      - Token
 *     summary: Проверка авторизации
 *     responses:
 *       200:
 *         description: Получение данных пользователя
 *         content:
 *          application/json:
 *            schema:
 *             allOf:
 *                - $ref: '#/components/schemas/UserOut'
 *       400:
 *        description: Ошибка данных
 *        content:
 *          application/json:
 *            schema:
 *               $ref: '#/components/schemas/Error400'
 *       401:
 *        description: Ошибка Авторизации
 *        content:
 *          application/json:
 *            schema:
 *               $ref: '#/components/schemas/Error401'
 *       500:
 *          description: Ошибка сервера
 *          content:
 *           application/json:
 *            schema:
 *               $ref: '#/components/schemas/Error500'
 */

router.get('/me',  controllers.tokens.me)


export default router
