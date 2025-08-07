import { Slide } from '@/types/Slide';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Theme {
  year: number;
  themes: Slide[];
  isThemePanelOpen: boolean;
  activeSlide?: Slide;
}

const initialState: Theme = {
  year: new Date().getFullYear(),
  themes: [],
  activeSlide: undefined,
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
    setActiveSlide(state, action: PayloadAction<Slide>) {
      state.activeSlide = action.payload;
    },
  },
});

export const { setThemeYear, toggleThemePanel, setThemes, setActiveSlide } = themeSlice.actions;

export default themeSlice.reducer;
