export interface IApiResponse<T = any> {
    status: number;
    success: boolean;
    message: string;
    data?: T;
}
  