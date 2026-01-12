import { HttpException } from "./http.exceptions";

export class NotFoundException extends HttpException {
    constructor(resource = "Resource"){
        super(404, `${resource} not found`);
    }
}