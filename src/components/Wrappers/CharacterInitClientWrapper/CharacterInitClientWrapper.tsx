'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setChosenCharacter, setParticipants } from '@/features/characterSlice';
import { Character } from '@/types/Character';
import { Participant } from '@/types/Participant';
import { RootState } from '@/state/store';

interface Props {
  character?: Character;
  participants?: Participant[];
}

export default function CharacterInitClientWrapper({ character, participants }: Props) {
  const dispatch = useDispatch();
  const chosenCharacter = useSelector((state: RootState) => state.character.chosenCharacter);
  const participantsState = useSelector((state: RootState) => state.character.participants);

  useEffect(() => {
    console.log('CharacterInitWrapper mounted or updated');
    if (character && character.id) {
      console.log('Dispatching setChosenCharacter with:', character);
      dispatch(setChosenCharacter(character));
    }
    if (participants && participants.length > 0) {
      console.log('Dispatching setParticipants with:', participants);
      dispatch(setParticipants(participants));
    }
  }, [character, participants, dispatch]);

  useEffect(() => {
    console.log('Redux chosenCharacter updated:', chosenCharacter);
  }, [chosenCharacter]);

  useEffect(() => {
    console.log('Redux participants updated:', participantsState);
  }, [participantsState]);

  return null;
}
