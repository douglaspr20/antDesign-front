import { put, fork, takeLatest, call } from "redux-saga/effects";

import {
  constants as liveConstants,
  actions as liveActions,
} from "../actions/live-actions";
import { actions as homeActions } from "../actions/home-actions";
import {
  get,
} from "../../api/module/live";

export function* getLiveSaga() {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(get);

    if (response.status === 200) {
      yield put(liveActions.setLive(response.data.live));
    }

    yield put(homeActions.setLoading(false));
  } catch (error) {
    console.log(error);
    yield put(homeActions.setLoading(false));
  }
}

function* watchLogin() {
  yield takeLatest(liveConstants.GET_LIVE, getLiveSaga);
}

export const liveSaga = [fork(watchLogin)];
