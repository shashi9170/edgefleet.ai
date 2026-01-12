import { HttpException } from "./http.exceptions";

export class ValidationException extends HttpException {
    constructor(message = "Invalid request data"){
        super(400, message);
    }
}