import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type LocationState = {
    allLocationsState: any[];
    allLocation: string | null
};

const initialState = {
    allLocationsState: [],
    allLocation: null
} as LocationState;

export const allLocationSlice = createSlice({
    name: "All Locations",
    initialState,
    reducers: {
        reset: () => initialState,
        
        setAllLocations: (state, action: PayloadAction<any[]>) => {
            state.allLocationsState = action.payload
        },
    },
});

export const {
    setAllLocations,
    reset,
} = allLocationSlice.actions;

export default allLocationSlice.reducer;
