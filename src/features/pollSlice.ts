import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PollOption } from '@/lib/api/poll/fetchPollOptions';

interface Poll {
  suggestions: PollOption[];
}

const initialState: Poll = {
  suggestions: [],
};

const pollSlice = createSlice({
  name: 'poll',
  initialState,
  reducers: {
    setSuggestions: (state, action: PayloadAction<PollOption[]>) => {
      state.suggestions = action.payload;
    },
  },
});

export const { setSuggestions } = pollSlice.actions;

export default pollSlice.reducer;
