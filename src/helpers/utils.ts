import { PrismaClient } from '@prisma/client'
import { compare, genSaltSync, hash } from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import { createTransport } from 'nodemailer'
import { logError } from './errors'

export const envs = {
  PORT: process.env.PORT || 4000,
  HOST: process.env.HOST || 'http://localhost',
  CORS_HOST: process.env.CORS_HOST || 'http://localhost:3000/',
  JWT_SECRET: process.env.JWT_SECRET || 'secret123',
  EMAIL_USERNAME: process.env.EMAIL_USERNAME,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
}

const transporter = createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // upgrade later with STARTTLS
  auth: {
    user: envs.EMAIL_USERNAME,
    pass: envs.EMAIL_PASSWORD,
  },
})

export const isDev = () => process.env.NODE_ENV === 'development'

export const prisma = new PrismaClient()

export const hashPassword = (password: string) => {
  let salt = genSaltSync(10)
  return new Promise<string>(res => {
    hash(password, salt, (err, saltedPassword) => {
      res(saltedPassword)
    })
  })
}

export const comparePassword = (password: string, hashedPassword: string) => {
  return new Promise<boolean>(res => {
    compare(password, hashedPassword, (err, same) => {
      if (err) res(false)
      else res(same)
    })
  })
}

export const createAccessToken = (data: any, expiresIn = '7d') => {
  return new Promise<string | undefined>((res, rej) => {
    jwt.sign(data, envs.JWT_SECRET, { expiresIn }, (err, token) => {
      if (err) rej(err)
      res(token)
    })
  })
}

export const verifyToken = (token: string | undefined): any => {
  return new Promise((res, rej) => {
    if (!token) {
      rej('invalid token')
      return
    }

    jwt.verify(token, envs.JWT_SECRET, {}, (err, decoded) => {
      if (err) {
        rej('invalid token')
        return
      }
      res(decoded)
    })
  })
}

export const sendEmail = (email: string, text: string, subject: string) => {
  return new Promise((res, rej) => {
    transporter.sendMail(
      {
        from: envs.EMAIL_USERNAME,
        to: email,
        text,
        subject,
      },
      (err, response) => {
        if (err) {
          logError('sendEmail', err)
          rej(err)
        }

        res(response)
      }
    )
  })
}
