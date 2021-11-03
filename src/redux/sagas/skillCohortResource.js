import { put, fork, call, takeLatest } from "redux-saga/effects";

import {
  constants as resourcesConstants,
  actions as resourcesActions,
} from "../actions/skillCohortResource-actions";
import { actions as homeActions } from "../actions/home-actions";

import { getAllResources, getResource } from "../../api";

export function* getAllResourceSaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(getAllResources, { ...payload });

    if (response.status === 200) {
      console.log(response.data);
      yield put(
        resourcesActions.setAllSkillCohortResources(
          response.data.skillCohortResources.count,
          1,
          response.data.skillCohortResources.rows
        )
      );
    }
  } catch (error) {
    console.log(error);
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

export function* getMoreResourceSaga({ payload }) {
  yield put(resourcesActions.setLoading(true));

  try {
    const response = yield call(getAllResources, { ...payload });

    if (response.status === 200) {
      yield put(
        resourcesActions.setMoreSkillCohortResources(
          response.data.skillCohortResources.count,
          payload.filter.page,
          response.data.skillCohortResources.rows
        )
      );
    }
  } catch (error) {
    console.log(error);
  } finally {
    yield put(resourcesActions.setLoading(false));
  }
}

export function* getResourceSaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(getResource, { ...payload });

    if (response.status === 200) {
      yield put(
        resourcesActions.setSkillCohortResource(
          response.data.skillCohortResource
        )
      );
    }
  } catch (error) {
    console.log(error);
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

function* watchResourceSaga() {
  yield takeLatest(resourcesConstants.GET_ALL_RESOURCE, getAllResourceSaga);
  yield takeLatest(resourcesConstants.GET_RESOURCE, getResourceSaga);
  yield takeLatest(resourcesConstants.GET_MORE, getMoreResourceSaga)
}

export const skillCohortResourceSaga = [fork(watchResourceSaga)];
