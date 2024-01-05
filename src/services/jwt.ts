import { User } from "@prisma/client";
import JWT from 'jsonwebtoken'
import { JWTUser } from "../interfaces";

const JWT_SECRET = '@Super123.'
class JWTService {
    public static jsonwebtoken(user: User) {
        const payload: JWTUser = {
            id: user.id,
            email: user.email
        }
        const token = JWT.sign(payload, JWT_SECRET)
        return token
    }

    public static decodeToken(token: string) {
        try {
            return JWT.verify(token, JWT_SECRET)
        } catch (error) {
            return null
        }
        
    }
}

export default JWTService