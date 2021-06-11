import httpClient from "./httpClient";
import { SETTINGS } from "enum";

export const getAllPodcasts = async (data) => {
  let newFilter = {
    page: 1,
    num: SETTINGS.MAX_SEARCH_ROW_NUM,
  };

  if (data.filter) {
    newFilter = { ...newFilter, ...data.filter };
  }

  const parsedFilter = Object.keys(newFilter)
    .map((item) => `${item}=${newFilter[item]}`)
    .join("&");

  return await httpClient.get(`private/podcast/search?${parsedFilter}`);
};

export const addPodcastToChannel = ({ podcast }) => {
  return httpClient.post("private/podcast/channel", { ...podcast });
};

export const searchChannelPodcast = ({ filter }) => {
  let newFilter = {
    page: 1,
    num: SETTINGS.MAX_SEARCH_ROW_NUM,
  };

  if (filter) {
    newFilter = { ...newFilter, ...filter };
  }

  const parsedFilter = Object.keys(newFilter)
    .map((item) => `${item}=${newFilter[item]}`)
    .join("&");

  return httpClient.get(`private/podcast/channel?${parsedFilter}`);
};

export const deleteChannelPodcast = ({ episode }) => {
  return httpClient.delete(
    `private/podcast/channel/${episode.id}?channel=${episode.channel}`
  );
};

export const updateChannelPodcast = ({ episode }) => {
  return httpClient.put(`private/podcast/channel/${episode.id}`, episode);
};
