import { createSelector } from "reselect";

const channelDataSelector = (state) => state.channel;

const resultSelector = createSelector(channelDataSelector, (payload) => {
  return {
    loading: payload.get("loading"),
    allChannels: payload.get("allChannels"),
    selectedChannel: payload.get("selectedChannel"),
    error: payload.get("error"),
    countOfResults: payload.get("countOfResults"),
    currentPage: payload.get("currentPage"),
  };
});

export const channelSelector = (state) => ({
  ...resultSelector(state),
});
