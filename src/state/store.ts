import { configureStore } from '@reduxjs/toolkit';
import themeReducer from '../features/themeSlice';
import modalReducer from '../features/modalSlice';
import characterReducer from '../features/characterSlice';
import profileReducer from '../features/profileSlice';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    modal: modalReducer,
    character: characterReducer,
    profile: profileReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
