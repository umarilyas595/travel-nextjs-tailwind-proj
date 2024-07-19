import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type LocationState = {
    priorityState: any[];
    priority: string | null
};

const initialState = {
    priorityState: [],
    priority: null
} as LocationState;

export const prioritySlice = createSlice({
    name: "locations",
    initialState,
    reducers: {
        reset: () => initialState,
        
        setPriorities: (state, action: PayloadAction<any[]>) => {
            state.priorityState = action.payload
        },
    },
});

export const {
    setPriorities,
    reset,
} = prioritySlice.actions;

export default prioritySlice.reducer;
