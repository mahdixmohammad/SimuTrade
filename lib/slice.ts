import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";

export interface DashboardState {
	accountBalance: number;
	pnl: number;
	wins: number;
	losses: number;
	winrate: number;
	units: number;
	totalTradeDuration: number;
	averageWin: number;
	averageLoss: number;
	averageUnits: number;
	averageTradeDuration: number;
}

const initialState: DashboardState = {
	accountBalance: 10000,
	pnl: 0,
	wins: 0,
	losses: 0,
	winrate: 0,
	units: 0,
	totalTradeDuration: 0,
	averageWin: 0,
	averageLoss: 0,
	averageUnits: 0,
	averageTradeDuration: 0,
};

interface PayloadObject {
	pnl: number;
	units: number;
	tradeStartDate: Date;
	tradeEndDate: Date;
}

export const dashboardSlice = createSlice({
	name: "dashboard",
	initialState,
	reducers: {
		changePNL: (state, action: PayloadAction<PayloadObject>) => {
			state.accountBalance += action.payload.pnl;
			state.pnl += action.payload.pnl;

			if (action.payload.pnl > 0) {
				state.averageWin = (state.averageWin * state.wins + action.payload.pnl) / (state.wins + 1);
				state.wins += 1;
			}
			if (action.payload.pnl < 0) {
				state.averageLoss = (state.averageLoss * state.losses + action.payload.pnl) / (state.losses + 1);
				state.losses += 1;
			}

			state.winrate = (state.wins / (state.wins + state.losses)) * 100;
			state.units += action.payload.units;
			state.averageUnits = (state.averageUnits * (state.wins + state.losses - 1) + action.payload.units) / (state.wins + state.losses);
			const tradeDurationDifference = Math.round(
				(action.payload.tradeEndDate.getTime() - action.payload.tradeStartDate.getTime()) / (1000 * 3600)
			);
			state.totalTradeDuration += tradeDurationDifference;
			state.averageTradeDuration =
				(state.averageTradeDuration * (state.wins + state.losses - 1) + tradeDurationDifference) / (state.wins + state.losses);
		},
	},
});

export const { changePNL } = dashboardSlice.actions;

export const selectAccountBalance = (state: RootState) => state.dashboard.accountBalance;
export const selectPNL = (state: RootState) => state.dashboard.pnl;
export const selectWins = (state: RootState) => state.dashboard.wins;
export const selectLosses = (state: RootState) => state.dashboard.losses;
export const selectWinrate = (state: RootState) => state.dashboard.winrate;
export const selectUnits = (state: RootState) => state.dashboard.units;
export const selectTotalTradeDuration = (state: RootState) => state.dashboard.totalTradeDuration;
export const selectAverageWin = (state: RootState) => state.dashboard.averageWin;
export const selectAverageLoss = (state: RootState) => state.dashboard.averageLoss;
export const selectAverageUnits = (state: RootState) => state.dashboard.averageUnits;
export const selectAverageTradeDuration = (state: RootState) => state.dashboard.averageTradeDuration;

export default dashboardSlice.reducer;
