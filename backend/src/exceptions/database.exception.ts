import { HttpException } from "./http.exceptions";

export class DatabaseException extends HttpException {
    constructor(message = "Database error"){
        super(500, message);
    }
}