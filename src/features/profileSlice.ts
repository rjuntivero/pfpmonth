import { Character } from '@/types/Character';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProfileState {
  selectedServerId: string | null;
  selectedCharacter: Character | null;
}

const initialState: ProfileState = {
  selectedServerId: null,
  selectedCharacter: null,
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
  },
});

export const { setSelectedServerId, setSelectedCharacterName } = profileSlice.actions;
export default profileSlice.reducer;
