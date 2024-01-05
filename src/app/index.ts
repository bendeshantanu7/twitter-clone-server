import express from'express';
import { ApolloServer } from '@apollo/server';
import {expressMiddleware} from '@apollo/server/express4'
import cors from 'cors';
import bodyParser from 'body-parser';
import  {User} from '../user/index'
import { MyGraphqlContext } from '../interfaces';
import JWTService from '../services/jwt';

export async function initServer() {
    const app = express()

    const server = new ApolloServer<MyGraphqlContext>({
        typeDefs: `
            ${User.types}
            type Query {
                ${User.queries}
            }
        `,
        resolvers: {
            Query: {
                ...User.resolvers.queries
            }
        }
    })

    await server.start()

    app.use(cors())

    app.use(bodyParser.json())

    app.use('/graphql', expressMiddleware(server, {context: async({req, res}) => {
        return {
            user: req.headers.authorization ? JWTService.decodeToken(req.headers.authorization.split('Bearer ')[1]) : undefined
        }
    }
    }))

    return app
}