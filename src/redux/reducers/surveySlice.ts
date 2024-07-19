import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type SurveyState = {
    surveySlice: any;
    show:boolean;
};

const initialState = {
    surveySlice: {},
    show:false,
} as SurveyState;

export const surveyValues = createSlice({
    name: "survey",
    initialState,
    reducers: {
        reset: () => initialState,
        
        setSurveyValue: (state, action: PayloadAction<any>) => {
            state.surveySlice = action.payload
        },
        setShow:(state, action:PayloadAction<any>) => {
            state.show = action.payload
        }
    },
});

export const {
    setShow,
    setSurveyValue,
    reset,
} = surveyValues.actions;

export default surveyValues.reducer;
