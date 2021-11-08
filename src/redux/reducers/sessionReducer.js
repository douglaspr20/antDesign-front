import { handleActions } from "redux-actions";
import { Map } from "immutable";

// Action Type Imports
import { constants as sessionConstants } from "../actions/session-actions";
import { cloneDeep } from "lodash";

// Session's Reducer
export const reducers = {
  [sessionConstants.SET_ALL_SESSIONS]: (state, { payload }) => {
    return state.merge({
      allSessions: payload.allSessions,
    });
  },
  [sessionConstants.SET_SESSIONS_ADDED_BY_USER]: (state, { payload }) => {
    return state.merge({
      sessionsUser: payload.sessionsUser,
    });
  },
  [sessionConstants.SET_PARTICIPANTS]: (state, { payload }) => {
    if (payload.page === 1) {
      return state.merge({
        participants: cloneDeep(payload.participants),
        currentPageParticipants: payload.page,
        countOfResults: payload.total,
      });
    }
    const participants = state.get("participants");
    return state.merge({
      participants: cloneDeep([...participants, payload.participants]),
      currentPageParticipants: payload.page,
      countOfResults: payload.total,
    });
  },
  [sessionConstants.SET_SESSION_LOADING]: (state, { payload }) => {
    return state.merge({
      sessionLoading: payload.loading,
    });
  },
};

export const initialState = () =>
  Map({
    sessionLoading: false,
    allSessions: [],
    sessionsUser: [],
    participants: [],
    countOfResults: 0,
    currentPageParticipants: 1,
  });

export default handleActions(reducers, initialState());
