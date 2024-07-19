import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type LocationState = {
    topCitiesState: any[];
    topCities: string | null
};

const initialState = {
    topCitiesState: [],
    topCities: null
} as LocationState;

export const topCitiesSlice = createSlice({
    name: "city",
    initialState,
    reducers: {
        reset: () => initialState,
        
        setTopCities: (state, action: PayloadAction<any[]>) => {
            state.topCitiesState = action.payload
        },
    },
});

export const {
    setTopCities,
    reset,
} = topCitiesSlice.actions;

export default topCitiesSlice.reducer;
