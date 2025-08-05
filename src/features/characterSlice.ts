// features/modalSlice.ts
import { Character } from '@/types/Character';
import { Participant } from '@/types/Participant';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CharacterState {
  chosenCharacter: Character;
  participants: Participant[];
}

const initialState: CharacterState = {
  chosenCharacter: { name: 'No Character', image_url: '/no-image-placeholder.jpg', id: '', theme_id: '', user_id: '' },
  participants: [],
};

const characerSlice = createSlice({
  name: 'character',
  initialState,
  reducers: {
    setChosenCharacter(state, action: PayloadAction<Character>) {
      state.chosenCharacter = action.payload as Character;
    },
    updateCharacterName(state, action: PayloadAction<string>) {
      state.chosenCharacter.name = action.payload;
    },
    updateCharacterImage(state, action: PayloadAction<string>) {
      state.chosenCharacter.image_url = action.payload;
    },
    setParticipants(state, action: PayloadAction<Participant[]>) {
      state.participants = action.payload;
    },
  },
});

export const { setChosenCharacter, setParticipants, updateCharacterImage, updateCharacterName } = characerSlice.actions;
export default characerSlice.reducer;
