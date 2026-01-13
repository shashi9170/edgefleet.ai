export interface IRefreshToken {
    id?: string;
    userId: string;
    token: string;
    tokenId: string;
    expiresAt?: Date;
    isRevoked?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}  