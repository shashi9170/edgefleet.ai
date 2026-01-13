export type LoginRequest = {
    email: string;
    password: string;
}


export type User = {
    id: string;
    name: string;
    email: string;
}


export type LoginResponse = {
    user: User;
};


export type SignupRequest = {
    name: string;
    email: string;
    password: string;
};
  
export type SignupResponse = {
    user: User;
};
  