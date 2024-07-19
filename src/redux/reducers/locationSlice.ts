import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type LocationState = {
    locationsState: any[];
    locationAddress: string | null
};

const initialState = {
    locationsState: [],
    locationAddress: null
} as LocationState;

export const locationSlice = createSlice({
    name: "locations",
    initialState,
    reducers: {
        reset: () => initialState,
        
        setLocations: (state, action: PayloadAction<any[]>) => {
            state.locationsState = action.payload
        },

        setLocationAddress: (state, action: PayloadAction<string>) => {
            state.locationAddress = action.payload
        }
    },
});

export const {
    setLocations,
    setLocationAddress,
    reset,
} = locationSlice.actions;

export default locationSlice.reducer;
