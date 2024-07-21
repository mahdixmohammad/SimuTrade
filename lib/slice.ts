import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";

// Define a type for the slice state
export interface DashboardState {
	pnl: number;
}

// Define the initial state using that type
const initialState: DashboardState = {
	pnl: 0,
};

export const dashboardSlice = createSlice({
	name: "dashboard",
	// `createSlice` will infer the state type from the `initialState` argument
	initialState,
	reducers: {
		// Use the PayloadAction type to declare the contents of `action.payload`
		changePNL: (state, action: PayloadAction<number>) => {
			state.pnl += action.payload;
		},
	},
});

export const { changePNL } = dashboardSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectPNL = (state: RootState) => (state as RootState).dashboard.pnl;

export default dashboardSlice.reducer;
