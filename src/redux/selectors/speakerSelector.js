import { createSelector } from "reselect";

const speakerSelector = (state) => state.speakers;

const resultSelector = createSelector(speakerSelector, (payload) => {
  return {
    allPanelSpeakers: payload.get("allPanelSpeakers"),
    allUserSpeakers: payload.get("allUserSpeakers")
  };
});

export const speakerAllPanelSpeakerSelector = (state) => ({
  ...resultSelector(state),
});