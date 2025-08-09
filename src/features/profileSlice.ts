import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProfileState {
  selectedServerId: string | null;
  selectedCharacterName: string | null;
}

const initialState: ProfileState = {
  selectedServerId: null,
  selectedCharacterName: null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setSelectedServerId(state, action: PayloadAction<string | null>) {
      state.selectedServerId = action.payload;
      state.selectedCharacterName = null;
    },
    setSelectedCharacterName(state, action: PayloadAction<string | null>) {
      state.selectedCharacterName = action.payload;
    },
  },
});

export const { setSelectedServerId, setSelectedCharacterName } = profileSlice.actions;
export default profileSlice.reducer;
