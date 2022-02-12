import { onRequestHookHandler } from 'fastify'
import { verifyToken } from '../helpers/utils'

export const isAuth: onRequestHookHandler = async (req, res) => {
  try {
    let auth = req.headers['authorization']
    let token = auth?.replace('Bearer ', '')

    let user = await verifyToken(token)

    if (!user.active) {
      return res.send({ error: 'Please Active Your Account!' })
    }
    req.user = user
  } catch (error) {
    return res.status(401).send({ error: 'Unauthorized!' })
  }
}
