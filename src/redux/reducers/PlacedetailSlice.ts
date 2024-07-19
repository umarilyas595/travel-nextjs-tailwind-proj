import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type PlacedetailState = {
    show: boolean;
    item: any
};

const initialState = {
    show: false,
    item: null
} as PlacedetailState;

const PlacedetailSlice = createSlice({
    name: "Placedetail",
    initialState,
    reducers: {
        reset: () => initialState,
        setItem: (state, action: PayloadAction<any>) => {
            state.show = true
            state.item = action.payload
        }
    }
})

export const { reset, setItem } = PlacedetailSlice.actions

export default PlacedetailSlice.reducer