import type { Request } from 'express';


export interface JwtPayload {
    tokenId: string;
    sub: string; 
    email: string;
}


export interface RequestWithUser extends Request {
  user: {
    id: string;
    email: string;
    name?: string;
    tokenId: string;
  };
}
