import { RouteHandlerMethod } from 'fastify'

import * as crypto from 'crypto'
import { logError } from '../helpers/errors'
import {
  comparePassword,
  createAccessToken,
  hashPassword,
  prisma,
  sendEmail,
} from '../helpers/utils'

export const signup: RouteHandlerMethod = async (req, reply) => {
  try {
    let { name, email, password } = req.body as any

    password = await hashPassword(password)

    const token = crypto.randomBytes(16).toString('hex')
    let { password: pass, ...user } = await prisma.user.create({
      data: {
        name,
        email,
        password,
        token,
      },
    })

    await sendEmail(
      email,
      `http://localhost:4000/verify?token=${token}`,
      'User Verify'
    )

    reply.send(user)
  } catch (error: any) {
    reply.status(400).send({ error: `User already exists!` })
    logError('signup', error)
  }
}

export const login: RouteHandlerMethod = async (req, reply) => {
  try {
    let { email, password } = req.body as any

    let user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      return reply.status(401).send({ error: 'Invalid email or password' })
    }

    if (!(await comparePassword(password, user.password))) {
      return reply.status(401).send({ error: 'Invalid email or password' })
    }

    const data = {
      id: user.id,
      email,
      active: user.active,
    }
    return reply.send({
      user: { ...data, name: user.name },
      accessToken: await createAccessToken(data),
    })
  } catch (error: any) {
    reply.status(500).send({ error: 'Server error!' })
    logError('login', error)
  }
}

export const activateUser: RouteHandlerMethod = async (req, reply) => {
  try {
    const { token } = req.query as any
    if (!token) {
      return reply.status(400).send({ error: 'Token does not exist' })
    }
    const user = await prisma.user.findFirst({
      where: { token, active: false },
    })
    if (!user) {
      return reply
        .status(400)
        .send({ error: 'Token is not valid or user is already active!' })
    }
    await prisma.user.update({
      where: { id: user.id },
      data: { active: true, token: null },
    })
    return reply.send({ message: 'User has been activated!' })
  } catch (error: any) {
    reply.status(500).send({ error: 'Server error!' })
    logError('activateUser', error)
  }
}

export const changePassword: RouteHandlerMethod = async (req, reply) => {
  try {
    const { oldPassword, newPassword, email } = req.body as any
    let user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      return reply.status(401).send({ error: 'Invalid email or password' })
    }

    if (!(await comparePassword(oldPassword, user.password))) {
      return reply.status(401).send({ error: 'Invalid email or password' })
    }

    const hashedPassword = await hashPassword(newPassword)
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    })

    return { message: 'Password has been updated' }
  } catch (error: any) {
    reply.status(500).send({ error: 'Server error!' })
    logError('resetPassword', error)
  }
}
