import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PollOption } from '@/lib/api/poll/fetchPollOptions';

interface Poll {
  pollOptions: PollOption[];
}

const initialState: Poll = {
  pollOptions: [],
};

const pollSlice = createSlice({
  name: 'poll',
  initialState,
  reducers: {
    setPollOptions: (state, action: PayloadAction<PollOption[]>) => {
      state.pollOptions = action.payload;
    },
  },
});

export const { setPollOptions } = pollSlice.actions;

export default pollSlice.reducer;
