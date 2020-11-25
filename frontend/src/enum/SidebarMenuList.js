import INTERNAL_LINKS from "./InternalLinks";

import IconHome from "images/icon-home.svg";
import IconLibrary from "images/icon-library.svg";
import IconMentoring from "images/icon-mentoring.svg";
import IconCalendar from "images/icon-calendar.svg";
import IconMedal from "images/icon-medal.svg";
import IconReader from "images/icon-reader.svg";
import IconStar from "images/icon-star.svg";
import IconBookmark from "images/icon-bookmark.svg";

export default {
  TOP_MENUS: [
    {
      label: "Home",
      icon: IconHome,
      url: INTERNAL_LINKS.HOME,
    },
    {
      label: "Learning library",
      icon: IconLibrary,
      url: INTERNAL_LINKS.LEARNING_LIBRARY,
    },
    {
      label: "Mentoring",
      icon: IconMentoring,
      url: INTERNAL_LINKS.MENTORING,
    },
    {
      label: "Events",
      icon: IconCalendar,
      url: INTERNAL_LINKS.EVENTS,
    },
    {
      label: "Certifications",
      icon: IconMedal,
      url: INTERNAL_LINKS.CERTIFICATIONS,
    },
    {
      label: "Hub",
      icon: IconReader,
      url: INTERNAL_LINKS.HUB,
    },
  ],
  BOTTOM_MENUS: [
    {
      label: "Favorites",
      icon: IconStar,
      url: INTERNAL_LINKS.FAVORITES,
    },
    {
      label: "Read later",
      icon: IconBookmark,
      url: INTERNAL_LINKS.READ_LATER,
    },
  ],
};
