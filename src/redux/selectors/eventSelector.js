import { createSelector } from "reselect";

const eventDataSelector = (state) => state.event;

const resultSelector = createSelector(eventDataSelector, (payload) => {
  return {
    loading: payload.get("loading"),
    allEvents: payload.get("allEvents"),
    allLiveEvents: payload.get("allLiveEvents"),
    updatedEvent: payload.get("updatedEvent"),
    error: payload.get("error"),
    myEvents: payload.get("myEvents"),
    channelEvents: payload.get("channelEvents"),
  };
});

export const eventSelector = (state) => ({
  ...resultSelector(state),
});
