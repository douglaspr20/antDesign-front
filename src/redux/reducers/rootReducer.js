import { combineReducers } from "redux";

import homeReducer from "./homeReducer";
import envReducer from "./envReducer";
import authReducer from "./authReducer";
import eventReducer from "./eventReducer";
import libraryReducer from "./libraryReducer";
import mentoringReducer from "./mentoringReducer";
import podcastReducer from "./podcastReducer";
import marketplaceReducer from "./marketplaceReducer";
import marketplaceCategoriesReducer from "./marketplaceCategoriesReducer";

export default combineReducers({
  home: homeReducer,
  env: envReducer,
  auth: authReducer,
  event: eventReducer,
  library: libraryReducer,
  mentoring: mentoringReducer,
  podcast: podcastReducer,
  marketplace: marketplaceReducer,
  marketplaceCategories: marketplaceCategoriesReducer,
});
