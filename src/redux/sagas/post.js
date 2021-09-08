import { put, fork, takeLatest, call } from "redux-saga/effects";

import {
  constants as postConstants,
  actions as postActions,
} from "../actions/post-actions";
import { actions as homeActions } from "../actions/home-actions";
import { logout } from "../actions/auth-actions";
import { get, getAllPosts, post, put as putPost } from "../../api/module/post";
import {
  post as postLike,
  remove as removeLike,
} from "../../api/module/postLike";
import { post as postComment } from "../../api/module/postComment";

export function* getAllPostSaga({ payload }) {
  if (payload.page === 1) {
    yield put(homeActions.setLoading(true));
  } else {
    yield put(postActions.setLoading(true));
  }

  try {
    const response = yield call(getAllPosts, payload);

    if (response.status === 200) {
      yield put(
        postActions.setAllPosts(
          response.data.posts.count,
          payload.filter.page || 1,
          response.data.posts.rows
        )
      );
    }
  } catch (error) {
    console.log(error);

    if (error && error.response && error.response.status === 401) {
      yield put(logout());
    }
  } finally {
    yield put(postActions.setLoading(false));
    yield put(homeActions.setLoading(false));
  }
}

export function* addPostSaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(post, payload.post);

    if (response.status === 200) {
      yield put(postActions.getAllPost({ page: 1 }));
    }
  } catch (error) {
    console.log(error);

    if (error && error.response && error.response.status === 401) {
      yield put(logout());
    }
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

export function* updatePostSaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(putPost, payload.post);

    if (response.status === 200) {
      console.log(response.data);
      yield put(postActions.setPost(response.data.post));
    }
  } catch (error) {
    console.log(error);

    if (error && error.response && error.response.status === 401) {
      yield put(logout());
    }
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

export function* setPostLikeSaga({ payload }) {
  try {
    yield call(postLike, payload.data);
  } catch (error) {
    console.log(error);

    if (error && error.response && error.response.status === 401) {
      yield put(logout());
    }
  }
}

export function* deletePostLikeSaga({ payload }) {
  try {
    yield call(removeLike, payload.id);
  } catch (error) {
    console.log(error);

    if (error && error.response && error.response.status === 401) {
      yield put(logout());
    }
  }
}

export function* addPostCommentSaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(postComment, payload.data);

    if (response.status === 200) {
      yield put(postActions.getAllPost());
    }
  } catch (error) {
    console.log(error);

    if (error && error.response && error.response.status === 401) {
      yield put(logout());
    }
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

export function* getPostSaga({ payload }) {
  yield put(homeActions.setLoading(true));

  try {
    const response = yield call(get, payload.id);

    if (response.status === 200) {
      yield put(postActions.setPost(response.data.post));
    }
  } catch (error) {
    console.log(error);

    if (error && error.response && error.response.status === 401) {
      yield put(logout());
    }
  } finally {
    yield put(homeActions.setLoading(false));
  }
}

function* watchLogin() {
  yield takeLatest(postConstants.ADD_POST, addPostSaga);
  yield takeLatest(postConstants.GET_ALL_POST, getAllPostSaga);
  yield takeLatest(postConstants.SET_POST_LIKE, setPostLikeSaga);
  yield takeLatest(postConstants.DELETE_POST_LIKE, deletePostLikeSaga);
  yield takeLatest(postConstants.ADD_POST_COMMENT, addPostCommentSaga);
  yield takeLatest(postConstants.GET_POST, getPostSaga);
  yield takeLatest(postConstants.UPDATE_POST, updatePostSaga);
}

export const postSaga = [fork(watchLogin)];
