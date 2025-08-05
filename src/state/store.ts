import { configureStore } from '@reduxjs/toolkit';
import themeReducer from '../features/themeSlice';
import modalReducer from '../features/modalSlice';
import characterReducer from '../features/characterSlice';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    modal: modalReducer,
    character: characterReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
