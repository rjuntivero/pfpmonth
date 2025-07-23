import { configureStore } from '@reduxjs/toolkit';
import themeReducer from '../features/themeSlice';
import modalReducer from '../features/modalSlice';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    modal: modalReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
