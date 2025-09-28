import { type IUser } from "../../domain/interfaces.js";

export enum ACTION_TYPES {
  Login = "login",
  Logout = "logout",
  Register = "register",
}

export type StateType = {
  user: IUser | null;
  token: string | null;
};

export type Actions =
  | { type: ACTION_TYPES.Login; payload: { user: IUser; token: string } }
  | { type: ACTION_TYPES.Logout }
  | { type: ACTION_TYPES.Register; payload: { user: IUser; token: string } };

const auth = (state: StateType, action: Actions) => {
  switch (action.type) {
		case ACTION_TYPES.Register:
    case ACTION_TYPES.Login:
      return {
        user: action.payload.user,
				token: action.payload.token,
      };

    case ACTION_TYPES.Logout:
      return {
        user: null,
				token: null,
      };


    default:
      return state;
  }
};

export default auth;
