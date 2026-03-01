'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setChosenCharacter } from '@/features/characterSlice';
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

  useEffect(() => {
    if (character && character.id) {
      dispatch(setChosenCharacter(character));
    }
  }, [character, participants, dispatch]);

  return null;
}
