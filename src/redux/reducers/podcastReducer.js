import { handleActions } from "redux-actions";
import { Map } from "immutable";
import cloneDeep from "lodash/cloneDeep";

// Action Type Imports
import { constants as podcastConstants } from "../actions/podcast-actions";

// Events's Reducer
export const reducers = {
  [podcastConstants.SET_ALL_PODCASTS]: (state, { payload }) => {
    if (payload.page === 1) {
      return state.merge({
        allEpisodes: cloneDeep(payload.podcasts),
        currentPage: payload.page,
        countOfResults: payload.total,
      });
    }
    const allEpisodes = state.get("allEpisodes");
    return state.merge({
      allEpisodes: cloneDeep([...allEpisodes, ...payload.podcasts]),
      currentPage: payload.page,
      countOfResults: payload.total,
    });
  },
  [podcastConstants.SET_ALL_PODCAST_SERIES]: (state, { payload }) => {
    return state.merge({ ...payload });
  },
  [podcastConstants.SET_PODCAST_SERIES]: (state, { payload }) => {
    return state.merge({ ...payload });
  },
  [podcastConstants.SET_LOADING]: (state, { payload }) => {
    return state.merge({ ...payload });
  },
  [podcastConstants.SET_FIRST_CHANNEL_PODCAST_LIST]: (state, { payload }) => {
    return state.merge({
      allEpisodes: cloneDeep([...payload.channelPodcasts]),
      currentPage: payload.page,
      countOfResults: payload.total,
    });
  },
  [podcastConstants.SET_MORE_CHANNEL_PODCAST_LIST]: (state, { payload }) => {
    const allEpisodes = state.get("allEpisodes");
    return state.merge({
      allEpisodes: cloneDeep([...allEpisodes, ...payload.channelPodcasts]),
      currentPage: payload.page,
      countOfResults: payload.total,
    });
  },
};

export const initialState = () =>
  Map({
    loading: false,
    allEpisodes: [],
    allPodcastSeries: [],
    podcastSeries: {},
    countOfResults: 0,
    currentPage: 1,
  });

export default handleActions(reducers, initialState());
