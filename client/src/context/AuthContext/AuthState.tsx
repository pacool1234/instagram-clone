import { createContext, useReducer } from "react";
import { type ILoginRequest, type IRegisterRequest, type IProviderProps } from "../../domain/interfaces.js";
import AuthReducer, { type StateType, ACTION_TYPES } from "./AuthReducer.ts";
import { loginUser, registerUser } from "../../services/auth.api.js";

const initialState: StateType = {
  token: localStorage.getItem("token") || null,
  user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : null,
};

type AuthContextType = StateType & {
  login: (data: ILoginRequest) => Promise<void>;
  logout: () => void;
  register: (data: IRegisterRequest) => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: IProviderProps) => {
  const [state, dispatch] = useReducer(AuthReducer, initialState);

  const login = async (data: ILoginRequest) => {
    const res = await loginUser(data);

    const { token, ...userData } = res.data;

    if (res.data) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      dispatch({
        type: ACTION_TYPES.Login,
        payload: { user: userData, token: token },
      });
    }
  };

  const register = async (data: IRegisterRequest) => {
    try {
      const res = await registerUser(data);

      const { token, ...userData } = res.data;

      if (res.data) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));
        dispatch({
          type: ACTION_TYPES.Register,
          payload: { user: userData, token: token },
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch({ type: ACTION_TYPES.Logout });
  };

  return (
    <AuthContext.Provider
      value={{
        token: state.token,
        user: state.user,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
