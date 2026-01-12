import { HttpException } from "./http.exceptions";

export class ForbiddenException extends HttpException {
    constructor(message = "Access denied"){
        super(403, message);
    }
}