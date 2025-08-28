import { Character } from '@/types/Character';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProfileState {
  selectedServerId: string | null;
  selectedCharacter: Character | null;
  loading?: boolean;
  selectedCharacterYear: string;
  selectedTimelineYear: string;
}

const initialState: ProfileState = {
  selectedServerId: null,
  selectedCharacter: null,
  loading: true,
  selectedCharacterYear: '2025',
  selectedTimelineYear: '2025',
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setSelectedServerId(state, action: PayloadAction<string | null>) {
      state.selectedServerId = action.payload;
      state.selectedCharacter = null;
    },
    setSelectedCharacterName(state, action: PayloadAction<Character | null>) {
      state.selectedCharacter = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setSelectedCharacterYear(state, action: PayloadAction<string>) {
      state.selectedCharacterYear = action.payload;
    },
    setSelectedTimelineYear(state, action: PayloadAction<string>) {
      state.selectedTimelineYear = action.payload;
    },
  },
});

export const { setSelectedServerId, setSelectedCharacterName, setLoading, setSelectedCharacterYear, setSelectedTimelineYear } = profileSlice.actions;
export default profileSlice.reducer;
