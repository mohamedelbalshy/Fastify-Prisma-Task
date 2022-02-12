import { RouteHandlerMethod } from 'fastify'
import { prisma } from '../helpers/utils'

export const getAllUsers: RouteHandlerMethod = async (req, res) => {
  try {
    let users = await prisma.user.findMany({
      select: { name: true, email: true, id: true, preferences: true },
    })
    return res.send(users)
  } catch (error) {
    console.error('users', error)
    res.status(500).send({ error: `Cannot fetch users` })
  }
}

export const getLoggedInUser: RouteHandlerMethod = async (req, res) => {
  try {
    const user = await prisma.user.findFirst({
      where: { id: req.user.id },
      select: { id: true, name: true, preferences: true, email: true },
    })

    return res.send(user)
  } catch (error) {
    console.error('users', error)
    res.status(500).send({ error: `Cannot fetch loggedin user` })
  }
}

export const updateUserReferenece: RouteHandlerMethod = async (req, res) => {
  try {
    const user = req.user

    const { preferences } = req.body as any

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { preferences },
      select: { id: true, email: true, preferences: true, name: true },
    })

    return res.send(updatedUser)
  } catch (error) {
    console.error('update user', error)
    res.status(500).send({ error: `Cannot fetch loggedin user` })
  }
}
