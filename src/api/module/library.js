import httpClient from "./httpClient";
import { SETTINGS } from "enum";

export const addLibrary = ({ library }) => {
  return httpClient.post(`private/library/share`, { ...library });
};

export const getLibrary = ({ id }) => {
  return httpClient.get(`private/library/${id}`);
};

export const searchLibrary = ({ filter, order }) => {
  let newFilter = {
    page: 1,
    num: SETTINGS.MAX_SEARCH_ROW_NUM,
    order,
  };

  if (filter) {
    newFilter = { ...newFilter, ...filter };
  }

  const parsedFilter = Object.keys(newFilter)
    .map((item) => `${item}=${newFilter[item]}`)
    .join("&");

  return httpClient.get(`private/library/approved?${parsedFilter}`);
};

export const getRecommendations = () => {
  return httpClient.get("private/library/recommendations");
};

export const addChannelLibrary = ({ library }) => {
  return httpClient.post("private/library/channel", { ...library });
};

export const searchChannelLibrary = ({ filter, order }) => {
  let newFilter = {
    page: 1,
    num: SETTINGS.MAX_SEARCH_ROW_NUM,
    order,
  };

  if (filter) {
    newFilter = { ...newFilter, ...filter };
  }

  const parsedFilter = Object.keys(newFilter)
    .map((item) => `${item}=${newFilter[item]}`)
    .join("&");

  return httpClient.get(`private/library/channel?${parsedFilter}`);
};

export const deleteChannelLibrary = ({ library }) => {
  return httpClient.delete(
    `private/library/channel/${library.id}?channel=${library.channel}`
  );
};

export const updateChannelLibrary = ({ library }) => {
  return httpClient.put(`private/library/channel/${library.id}`, library);
};
