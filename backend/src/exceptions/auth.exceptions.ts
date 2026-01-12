import { HttpException } from "./http.exceptions";

export class AuthException extends HttpException {
    constructor(message = "Authentication failed"){
        super(401, message);
    }
}