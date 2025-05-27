import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Theme {
  year: number;
  isThemePanelOpen: boolean;
}

const initialState: Theme = {
  year: new Date().getFullYear(),
  isThemePanelOpen: false,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemeYear: (state, action: PayloadAction<number>) => {
      state.year = action.payload;
    },
    toggleThemePanel: (state) => {
      state.isThemePanelOpen = !state.isThemePanelOpen;
    },
  },
});

export const { setThemeYear, toggleThemePanel } = themeSlice.actions;

export default themeSlice.reducer;
