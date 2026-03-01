// features/modalSlice.ts
import { Character } from '@/types/Character';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CharacterState {
  chosenCharacter: { [themeId: string]: Character };
}

const initialState: CharacterState = {
  chosenCharacter: {},
};

const characterSlice = createSlice({
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
        state.chosenCharacter[themeId].character_name = name;
      }
    },
    updateCharacterImage(state, action: PayloadAction<{ themeId: string; image_url: string }>) {
      const { themeId, image_url } = action.payload;
      if (state.chosenCharacter[themeId]) {
        state.chosenCharacter[themeId].image_url = image_url;
      }
    },
  },
});

export const { setChosenCharacter, updateCharacterImage, updateCharacterName } =
  characterSlice.actions;
export default characterSlice.reducer;
