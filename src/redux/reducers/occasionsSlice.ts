import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type LocationState = {
    ocassionsState: any[];
    ocassion: string | null
};

const initialState = {
    ocassionsState: [],
    ocassion: null
} as LocationState;

export const occasionsSlice = createSlice({
    name: "locations",
    initialState,
    reducers: {
        reset: () => initialState,
        
        setOccasions: (state, action: PayloadAction<any[]>) => {
            state.ocassionsState = action.payload
        },
    },
});

export const {
    setOccasions,
    reset,
} = occasionsSlice.actions;

export default occasionsSlice.reducer;
