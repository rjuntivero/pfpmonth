import { Character } from '@/types/Character';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProfileState {
  selectedServerId: string | null;
  selectedCharacter: Character | null;
  loading?: boolean;
}

const initialState: ProfileState = {
  selectedServerId: null,
  selectedCharacter: null,
  loading: false,
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
  },
});

export const { setSelectedServerId, setSelectedCharacterName, setLoading } = profileSlice.actions;
export default profileSlice.reducer;
