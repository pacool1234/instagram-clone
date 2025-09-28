import API from './api';

export const fetchUserById = (userId: string) => API.get(`/users/${userId}`);
export const getProfile = (userId: string) => API.get(`/users/${userId}/profile`);
export const searchUser = (query: string) => API.get(`/users/search/${query}`);