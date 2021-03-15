import { MiddlewareFn } from "type-graphql";
import { MyCtx } from "../types";
import { AuthenticationError } from 'apollo-server-express';

export const isAuthed: MiddlewareFn<MyCtx> = async ({ context }, next) => {
    if(!context.req.session.userId) {
        // throw new AuthenticationError('Unauthorized')
        return {
            errors: [
                {
                    field: "Authorization",
                    message: "This request requires authorization"
                }
            ]
        }
    }
    return next();
}
