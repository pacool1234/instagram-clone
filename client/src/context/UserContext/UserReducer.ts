import { type IUser } from "../../domain/interfaces.js";

export enum ACTION_TYPES {
  GetProfile = "getProfile",
}

export type StateType = {
  users: IUser[];
};

export type Actions = { type: ACTION_TYPES.GetProfile; payload: { user: IUser } };

const user = (state: StateType, action: Actions) => {
  switch (action.type) {
    case ACTION_TYPES.GetProfile:
      const existingUserIndex = state.users.findIndex((u) => u._id === action.payload.user._id);

      if (existingUserIndex !== -1) {
        const updatedUsers = [...state.users];
        updatedUsers[existingUserIndex] = action.payload.user;
        return {
          users: updatedUsers,
        };
      }
			
      return {
        users: [action.payload.user],
      };

    default:
      return state;
  }
};

export default user;
