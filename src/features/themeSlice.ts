import { Slide } from '@/types/Slide';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Theme {
  year: number;
  themes: Slide[];
  isThemePanelOpen: boolean;
}

const initialState: Theme = {
  year: new Date().getFullYear(),
  themes: [],
  isThemePanelOpen: false,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemes: (state, action: PayloadAction<Slide[]>) => {
      state.themes = action.payload;
    },
    setThemeYear: (state, action: PayloadAction<number>) => {
      state.year = action.payload;
    },
    toggleThemePanel: (state) => {
      state.isThemePanelOpen = !state.isThemePanelOpen;
    },
  },
});

export const { setThemeYear, toggleThemePanel, setThemes } = themeSlice.actions;

export default themeSlice.reducer;
