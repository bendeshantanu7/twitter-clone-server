import axios from 'axios'
import { prismaClient } from '../clients/db';
import JWTService from '../services/jwt';
import { MyGraphqlContext } from '../interfaces';
import { User } from '@prisma/client';

const queries = {
    verifyGoogleToken: async (parent: any, {token}:{token: string}) => {
        const googleToken = token;
        const googleOAuthURL = new URL('https://oauth2.googleapis.com/tokeninfo')
        googleOAuthURL.searchParams.set('id_token', googleToken)

        const  {data} = await axios.get(googleOAuthURL.toString(), {
            responseType: 'json'
        })
        console.log(data)
        const user = await prismaClient.user.findUnique( {where: {email: data.email }})

        if(!user) {
            await prismaClient.user.create({
                data: {
                    email: data.email,
                    firstName: data.given_name,
                    lastName: data.family_name,
                    profileImageUrl: data.picture
                }
            })
        }

        const userInDb = await prismaClient.user.findUnique({where: {email: data.email}})

        if(!user) throw new Error('User not found!')
        return JWTService.jsonwebtoken(user)
    },

    getLoggedInUser: async(parent: any, args: any, ctx: MyGraphqlContext) => {
        const user = await prismaClient.user.findUnique({where: {id: ctx.user?.id}})
        console.log(user)
        if(!user) return null
        return user as User
    }
}

export const resolvers = { queries }