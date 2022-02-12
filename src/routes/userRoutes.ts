import { RouteOptions } from 'fastify'
import * as controllers from '../controllers'
import * as middleware from '../middleware'
import { $ref } from '../types'

type RouteConfig = Record<string, RouteOptions>

const routes: RouteConfig = {
  healthCheck: {
    schema: {
      operationId: 'healthCheck',
      description: 'Health Check ',
      response: {
        200: {
          type: 'string',
          example: 'Ok',
        },
      },
    },
    method: 'GET',
    url: '/health',
    handler: (_, res) => {
      res.status(200).send('Ok')
    },
  },
  signup: {
    schema: {
      tags: ['Auth'],
      operationId: 'signup',
      description: 'Signup EndPoint',
      response: {
        200: $ref('User'),
      },
      body: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            example: 'Mohamed',
          },
          email: {
            type: 'string',
            example: 'mohamed@gmail.com',
          },
          password: {
            type: 'string',
            example: 'password1234',
          },
        },
      },
    },
    method: 'POST',
    url: '/signup',
    handler: controllers.signup,
  },
  login: {
    schema: {
      tags: ['Auth'],
      operationId: 'login',
      description: 'Login User',
      response: {
        200: {
          type: 'object',
          properties: {
            user: $ref('User'),
            accessToken: {
              type: 'string',
              example:
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJtb2hhbWVkYmFsc2h5MjAxNEBnbWFpbC5jb20iLCJhY3RpdmUiOnRydWUsImlhdCI6MTY0NDY4NzIxOCwiZXhwIjoxNjQ1MjkyMDE4fQ.ij7FyQM35ceW3JT6zINkULVJvDjxZNeduF1Rkb3N1As',
            },
          },
        },
      },
      body: {
        type: 'object',
        properties: {
          email: {
            type: 'string',
            example: 'mohamed@gmail.com',
          },
          password: {
            type: 'string',
            example: 'password1234',
          },
        },
      },
    },
    method: 'POST',
    url: '/login',
    handler: controllers.login,
  },
  getAllUsers: {
    schema: {
      tags: ['User'],
      operationId: `getAllUsers`,
      description: 'List All Users',
      response: {
        200: $ref(`Users`),
      },
      security: [
        {
          apiKey: [],
        },
      ],
    },
    method: 'GET',
    url: '/user',
    preHandler: [middleware.isAuth],
    handler: controllers.getAllUsers,
  },

  getLoggedInUser: {
    schema: {
      tags: ['User'],
      operationId: `getLoggedInUser`,
      description: 'Get Logged In User With References',
      response: {
        200: $ref(`User`),
      },
      security: [
        {
          apiKey: ['apiKey'],
        },
      ],
    },
    method: 'GET',
    url: '/user/loggedIn',
    preHandler: [middleware.isAuth],
    handler: controllers.getLoggedInUser,
  },

  updateUserPrefereneces: {
    schema: {
      tags: ['User'],
      operationId: `updateUserPreferences`,
      description: 'Update User Preferences',
      body: {
        type: 'object',
        properties: {
          preferences: {
            type: 'array',
            example: ['Music', 'Clothes'],
          },
        },
      },
      response: {
        200: $ref(`User`),
      },
      security: [
        {
          apiKey: ['apiKey'],
        },
      ],
    },

    method: 'PUT',
    url: '/user',
    preHandler: [middleware.isAuth],
    handler: controllers.updateUserReferenece,
  },

  changeUserPassword: {
    schema: {
      tags: ['User'],
      operationId: `changeUserPassword`,
      description: 'Change Password, must provide old, new and the email.',
      body: {
        type: 'object',
        properties: {
          newPassword: {
            type: 'string',
            example: '123456a',
          },
          oldPassword: {
            type: 'string',
            example: 'newPassword123',
          },
          email: {
            type: 'string',
            example: 'example@test.com',
          },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Password has been updated',
            },
          },
        },
        400: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              example: 'wrong password or email',
            },
          },
        },
      },
      security: [
        {
          apiKey: ['apiKey'],
        },
      ],
    },
    method: 'PUT',
    url: '/user/change-password',
    preHandler: [middleware.isAuth],
    handler: controllers.changePassword,
  },

  activateUser: {
    schema: {
      tags: ['User'],
      operationId: `activateUser`,
      description: 'Activate User',
      querystring: {
        type: 'object',
        properties: {
          token: {
            type: 'string',

            example: 'jwttoken',
          },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Password has been updated',
            },
          },
        },
        400: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              example: 'wrong password or email',
            },
          },
        },
      },
    },
    method: 'GET',
    url: '/verify',
    handler: controllers.activateUser,
  },
}

export const renderRoutes = Object.values(routes)
