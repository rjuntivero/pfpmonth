// features/modalSlice.ts
import { Character } from '@/types/Character';
import { Participant } from '@/types/Participant';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CharacterState {
  chosenCharacter: { [themeId: string]: Character };
  participants: Participant[];
}

const initialState: CharacterState = {
  chosenCharacter: {},
  participants: [],
};

const characerSlice = createSlice({
  name: 'character',
  initialState,
  reducers: {
    setChosenCharacter(state, action: PayloadAction<Character>) {
      const char = action.payload;
      state.chosenCharacter[char.theme_id] = char;
    },
    updateCharacterName(state, action: PayloadAction<{ themeId: string; name: string }>) {
      const { themeId, name } = action.payload;
      if (state.chosenCharacter[themeId]) {
        state.chosenCharacter[themeId].name = name;
      }
    },
    updateCharacterImage(state, action: PayloadAction<{ themeId: string; image_url: string }>) {
      const { themeId, image_url } = action.payload;
      if (state.chosenCharacter[themeId]) {
        state.chosenCharacter[themeId].image_url = image_url;
      }
    },
    setParticipants(state, action: PayloadAction<Participant[]>) {
      state.participants = action.payload;
    },
  },
});

export const { setChosenCharacter, setParticipants, updateCharacterImage, updateCharacterName } = characerSlice.actions;
export default characerSlice.reducer;
