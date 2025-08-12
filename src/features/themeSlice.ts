import { Slide } from '@/types/Slide';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Theme {
  year: number;
  themes: Slide[];
  isThemePanelOpen: boolean;
  activeSlide?: Slide;
  loaded?: boolean;
  navbarOpen?: boolean;
}

const initialState: Theme = {
  year: new Date().getFullYear(),
  themes: [],
  activeSlide: undefined,
  isThemePanelOpen: false,
  loaded: false,
  navbarOpen: false,
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
    setLoaded: (state, action: PayloadAction<boolean>) => {
      state.loaded = action.payload;
    },
    toggleNavbar: (state, action: PayloadAction<boolean>) => {
      state.navbarOpen = action.payload;
    },
  },
});

export const { setThemeYear, toggleThemePanel, setThemes, setActiveSlide, setLoaded, toggleNavbar } = themeSlice.actions;

export default themeSlice.reducer;
