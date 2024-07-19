import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ReviewsState = {
    reviewsState: any[];
};

const initialState = {
    reviewsState: [],
} as ReviewsState;

export const reviewsSlice = createSlice({
    name: "reviews",
    initialState,
    reducers: {
        reset: () => initialState,
        
        setReviews: (state, action: PayloadAction<any[]>) => {
            state.reviewsState = action.payload
        }
    },
});

export const {
    setReviews,
    reset,
} = reviewsSlice.actions;

export default reviewsSlice.reducer;
