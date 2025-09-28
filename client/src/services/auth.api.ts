import API from "./api";
import { type ILoginRequest, type IRegisterRequest } from "../domain/interfaces";


export const loginUser = (request: ILoginRequest) => {
  return API.post("/users/login", request);
};

export const registerUser = (request: IRegisterRequest) => {
  return API.post("/users/register", request);
};
