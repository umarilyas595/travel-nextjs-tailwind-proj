import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type LocationState = {
    topCountriesState: any[];
    topCountries: string | null
};

const initialState = {
    topCountriesState: [],
    topCountries: null
} as LocationState;

export const topCountriesSlice = createSlice({
    name: "locations",
    initialState,
    reducers: {
        reset: () => initialState,
        
        setTopCountries: (state, action: PayloadAction<any[]>) => {
            state.topCountriesState = action.payload
        },
    },
});

export const {
    setTopCountries,
    reset,
} = topCountriesSlice.actions;

export default topCountriesSlice.reducer;
