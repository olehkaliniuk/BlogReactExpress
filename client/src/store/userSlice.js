import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user_id: null,
  user_name: '',
  isLoggedIn: false,
};

const persistedUser = JSON.parse(localStorage.getItem('user'));

const userSlice = createSlice({
  name: 'user',
  initialState: persistedUser
    ? { ...initialState, ...persistedUser, isLoggedIn: true }
    : initialState,
  reducers: {
    login: (state, action) => {
      state.user_id = action.payload.user_id;
      state.user_name = action.payload.user_name;
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.user_id = null;
      state.user_name = '';
      state.isLoggedIn = false;
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;

