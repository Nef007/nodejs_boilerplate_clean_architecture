// import { inspect } from 'util';
import cookieParser  from 'cookie-parser'
import cors         from 'cors'
import busboy       from 'connect-busboy'
import { v4 }         from 'uuid'
import multer from 'multer'
import express from 'express'
import clsNamespace from '../../clsNamespace.mjs'
import logger       from '../logger.mjs'
import config from '../../config.cjs'


const storage = multer.memoryStorage()

const whitelist = config.whitelisted_domains
    ? config.whitelisted_domains.split(',')
    : []


export default {
    clsMiddleware : (req, res, next) => {
        // req and res are event emitters. We want to access CLS context inside of their event callbacks
        clsNamespace.bind(req)
        clsNamespace.bind(res)

        const traceID = v4()

        clsNamespace.run(() => {
            clsNamespace.set('traceID', traceID)

            logger.info({
                // url    : req.url,
                pathname : req._parsedUrl.pathname,
                method   : req.method,
                // body   : inspect(req.body, { showHidden: false, depth: null })
                body     : req.body,
                query    : req.query
            })

            next()
        })
    },
    json : express.json({ limit  : 1024 * 1024,
        verify : (req, res, buf) => {
            try {
                JSON.parse(buf)
            } catch (e) {
                res.send({
                    status : 0,
                    error  : {
                        code    : 'BROKEN_JSON',
                        message : 'Please, verify your json'
                    }
                })
                throw new Error('BROKEN_JSON')
            }
        } }),
    urlencoded : express.urlencoded({ extended: true }),
    cors       : cors({

        origin : (origin, callback) => {
            if (!origin || whitelist.includes(origin)) {
                return  callback(null, true)
            }

            return  callback(new Error('Not allowed by CORS'))
        },

        credentials : true
    }), // We allow any origin because we DO NOT USE cookies and basic auth
    include : (req, res, next) => {
        const { query } = req

        if (query.include) {
            query.include = query.include.split(',')
        }


        return next()
    },
    busboy       : busboy(),
    upload       : multer({ storage }),
    cookieParser : cookieParser(config.cookie_secret)
    //  passport     : passport.initialize()
}
