import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type LocationState = {
    restaurantsState: any[];
};

const initialState = {
    restaurantsState: [],
} as LocationState;

export const restaurantsSlice = createSlice({
    name: "restaurants",
    initialState,
    reducers: {
        reset: () => initialState,
        
        setRestaurants: (state, action: PayloadAction<any[]>) => {
            state.restaurantsState = action.payload
        }
    },
});

export const {
    setRestaurants,
    reset,
} = restaurantsSlice.actions;

export default restaurantsSlice.reducer;
