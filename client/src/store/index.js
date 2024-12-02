import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';

const loadState = () => {
  try {
    const serializedState = localStorage.getItem('user');
    return serializedState ? JSON.parse(serializedState) : undefined;
  } catch (err) {
    return undefined;
  }
};

const saveState = (state) => {
  try {
    const serializedState = JSON.stringify({
      user_id: state.user.user_id,
      user_name: state.user.user_name,
    });
    localStorage.setItem('user', serializedState);
  } catch (err) {
    console.error("Could not save state", err);
  }
};


const store = configureStore({
  reducer: {
    user: userReducer,
  },
  preloadedState: { user: loadState() }, // Load persisted state
});

// Subscribe to store updates to save the state
store.subscribe(() => {
  saveState(store.getState());
});

export default store;
