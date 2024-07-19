import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type LocationState = {
    activitiesState: any[];
};

const initialState = {
    activitiesState: [],
} as LocationState;

export const popularActivities = createSlice({
    name: "restaurants",
    initialState,
    reducers: {
        reset: () => initialState,
        
        setActivities: (state, action: PayloadAction<any[]>) => {
            state.activitiesState = action.payload
        }
    },
});

export const {
    setActivities,
    reset,
} = popularActivities.actions;

export default popularActivities.reducer;
