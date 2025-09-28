import { createContext, useReducer } from "react";
import { type IProviderProps } from "../../domain/interfaces.js";
import UserReducer, { type StateType, ACTION_TYPES } from "./UserReducer.ts";
import { getProfile, searchUser } from "../../services/user.api.js";

const initialState: StateType = {
  users: [],
};

type UserContextType = StateType & {
  fetchProfile: (userId: string) => Promise<void>;
};

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: IProviderProps) => {
  const [state, dispatch] = useReducer(UserReducer, initialState);

  const fetchProfile = async (userId: string) => {
    const res = await getProfile(userId);

    if (res.data) {
      dispatch({
        type: ACTION_TYPES.GetProfile,
        payload: { user: res.data },
      });
    }
  };

  return (
    <UserContext.Provider
      value={{
        users: state.users,
				fetchProfile
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
