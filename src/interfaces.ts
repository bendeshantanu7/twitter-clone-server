export interface JWTUser {
    id: string;
    email: string;
}

export interface MyGraphqlContext {
    user?: JWTUser
}