import { configureStore } from '@reduxjs/toolkit';
import themeReducer from '../features/themeSlice';
import modalReducer from '../features/modalSlice';
import characterReducer from '../features/characterSlice';
import profileReducer from '../features/profileSlice';
import leaderboardReducer from '../features/leaderboardSlice';
import pollReducer from '../features/pollSlice';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    modal: modalReducer,
    character: characterReducer,
    profile: profileReducer,
    leaderboard: leaderboardReducer,
    poll: pollReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
