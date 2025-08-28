// features/modalSlice.ts
import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

interface LeaderboardState {
  chosenMonth: string;
  chosenYear: string;
  rankings: string[];
  loaded?: boolean;
}

const initialState: LeaderboardState = {
  chosenMonth: 'August',
  chosenYear: '2025',
  rankings: [],
  loaded: false,
};

const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState,
  reducers: {
    setChosenMonth(state, action: PayloadAction<string>) {
      state.chosenMonth = action.payload;
    },
    setChosenYear(state, action: PayloadAction<string>) {
      state.chosenYear = action.payload;
    },
    setRankings(state, action: PayloadAction<string[]>) {
      state.rankings = action.payload;
    },
    setLoaded(state, action: PayloadAction<boolean>) {
      state.loaded = action.payload;
    },
  },
});

export const { setChosenYear, setChosenMonth, setRankings, setLoaded } = leaderboardSlice.actions;
export default leaderboardSlice.reducer;
