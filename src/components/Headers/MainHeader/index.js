import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import {
  SIDEBAR_MENU_LIST,
  EVENT_TYPES,
  INTERNAL_LINKS,
  INTERNAL_LINKS_ADDITIONAL_DATA_FOR_HEADER,
} from "enum";
import CustomButton from "../../Button";
import ProfilePopupMenu from "../../ProfilePopupMenu";
import PremiumAlert from "../../PremiumAlert";
import Emitter from "services/emitter";
import { setCollapsed } from "redux/actions/env-actions";
import Notification from "containers/Notification";

import IconChevronDown from "images/icon-chevron-down.svg";
import IconTvOutline from "images/icon-tv-outline.svg";
import IconMedal from "images/icon-medal.svg";
import IconNotification from "images/icon-notification-header.svg";
import IconHeadsetOutline from "images/icon-headset-outline.svg";
import IconLibrary from "images/icon-library.svg";
import IconFlaskOutline from "images/icon-flask-outline.svg";
import IconBriefcaseOutline from 'images/icon-briefcase-outline.svg'
import IconHome from 'images/icon-home.svg'

import IconGlobal from "images/icon-global.svg";
import { homeSelector } from "redux/selectors/homeSelector";
import { envSelector } from "redux/selectors/envSelector";
import { channelSelector } from "redux/selectors/channelSelector";
import { courseSelector } from "redux/selectors/courseSelector";
import { liveSelector } from "redux/selectors/liveSelector";
import { podcastSelector } from "redux/selectors/podcastSelector";
import { skillCohortSelector } from "redux/selectors/skillCohortSelector";

import "./style.scss";
import { sessionSelector } from "redux/selectors/sessionSelector";

const MenuList = [
  ...SIDEBAR_MENU_LIST.TOP_MENUS,
  ...SIDEBAR_MENU_LIST.BOTTOM_MENUS,
  ...INTERNAL_LINKS_ADDITIONAL_DATA_FOR_HEADER,
];

class MainHeader extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visiblePremiumAlert: false,
    };
  }

  planUpgrade = () => {
    Emitter.emit(EVENT_TYPES.OPEN_PAYMENT_MODAL);
  };

  // inviteFriend = () => {
  //   Emitter.emit(EVENT_TYPES.OPEN_INVITE_FRIEND_MODAL);
  // };

  onShowSidebar = () => {
    this.props.setCollapsed(false);
  };

  onHideAlert = () => {
    this.setState({ visiblePremiumAlert: false });
  };

  showPremiumAlert = () => {
    this.setState({ visiblePremiumAlert: true });
  };

  render() {
    const { userProfile: user } = this.props;
    const { visiblePremiumAlert } = this.state;
    const { pathname } = this.props.history.location || {};
    let pathInfo = MenuList.find((item) => item.url.includes(pathname));

    if (pathname === INTERNAL_LINKS.NOTIFICATIONS) {
      pathInfo = {
        icon: IconNotification,
        label: "Notifications",
      };
    } else if (!pathInfo && pathname.includes(`${INTERNAL_LINKS.CHANNELS}/`)) {
      const { selectedChannel } = this.props;
      pathInfo = {
        icon: IconTvOutline,
        label: (selectedChannel || {}).name || "",
      };
    }

    if (pathname.includes(`${INTERNAL_LINKS.COUNCIL}`)) {
      pathInfo = {
        icon: IconLibrary,
        label: `Council`,
      };
    }

    if (pathname.includes(`${INTERNAL_LINKS.BUSINESS_PARTNER}`)) {
      pathInfo = {
        // icon: ,
        label: `HR Business Partners Community`,
      };
    }

    if (!pathInfo && pathname.includes(`${INTERNAL_LINKS.MICRO_CLASS}/`)) {
      const { selectedCourse } = this.props;
      pathInfo = {
        icon: IconMedal,
        label: `Class - ${(selectedCourse || {}).title || ""}`,
      };
    }

    if (!pathInfo && pathname.includes(`${INTERNAL_LINKS.MICRO_CONFERENCE}/`)) {
      const { session } = this.props;

      pathInfo = {
        icon: IconGlobal,
        label: `Hacking HR 2022 Global Online Conference - ${
          (session || {}).title || ""
        }`,
      };
    }

    if (!pathInfo && pathname.includes(`${INTERNAL_LINKS.PODCAST_SERIES}`)) {
      const { podcastSeries } = this.props;
      pathInfo = {
        icon: IconHeadsetOutline,
        label: (podcastSeries || {}).title || "Podcast Series",
      };
    }

    if (!pathInfo && pathname.includes(`${INTERNAL_LINKS.POST}/`)) {
      pathInfo = {
        icon: IconMedal,
        label: `Post Details`,
      };
    }

    if (!pathInfo && pathname.includes(`${INTERNAL_LINKS.LIBRARY_ITEM}/`)) {
      if (pathname.includes(`${INTERNAL_LINKS.LIBRARY_ITEM}/podcast`)) {
        pathInfo = {
          icon: IconHeadsetOutline,
          label: `Podcast`,
        };
      } else {
        pathInfo = {
          icon: IconLibrary,
          label: `Library Item`,
        };
      }
    }

    if (!pathInfo && pathname.includes(`${INTERNAL_LINKS.PROJECTX}/`)) {
      pathInfo = {
        icon: IconFlaskOutline,
        label: `ProjectX - Cohort: ${this.props.skillCohort.title || ""}`,
      };
    }

    if (!pathInfo && pathname.includes(`${INTERNAL_LINKS.MY_LEARNINGS}`)) {
      pathInfo = {
        icon: IconFlaskOutline,
        label: "My Learnings",
      };
    }

    if (!pathInfo && pathname.includes(`${INTERNAL_LINKS.SPONSOR_DASHBOARD}`)) {
      pathInfo = {
        // icon: ,
        label: "Partners Dashboard",
      };
    }

    if (!pathInfo && pathname.includes(`${INTERNAL_LINKS.TALENT_MARKETPLACE}`)) {
      pathInfo = {
        icon: IconBriefcaseOutline,
        label: "Talent Marketplace",
      };
    }

    if (!pathInfo && pathname.includes(`${INTERNAL_LINKS.AD_HOME_PREVIEW}`)) {
      pathInfo = {
        icon: IconHome,
        label: "Advertisement Preview",
      };
    }

    if (!pathInfo && pathname.includes(`${INTERNAL_LINKS.AD_CONFERENCE_LIBRARY_PREVIEW}`)) {
      pathInfo = {
        icon: IconHome,
        label: "Advertisement Preview",
      };
    }

    if (!pathInfo && pathname.includes(`${INTERNAL_LINKS.AD_EVENTS_PREVIEW}`)) {
      pathInfo = {
        icon: IconHome,
        label: "Advertisement Preview",
      };
    }

    if (!pathInfo && pathname.includes(`${INTERNAL_LINKS.AD_PROJECT_X_PREVIEW}`)) {
      pathInfo = {
        icon: IconFlaskOutline,
        label: "Advertisement Preview",
      };
    }

    return (
      <div className="main-header">
        <div className="main-header-left">
          {this.props.isMobile && (
            <div className="main-header-left-menu" onClick={this.onShowSidebar}>
              <i className="fal fa-bars" />
            </div>
          )}
          {pathInfo ? (
            <>
              <div className="page-icon">
                {pathInfo.icon ? (
                  <img src={pathInfo.icon} alt="page-icon" />
                ) : (
                  <></>
                )}
              </div>
              <span className="page-label">
                {pathInfo.label === "Global Conference"
                  ? "Hacking HR 2022 Global Online Conference"
                  : pathInfo.label}
              </span>
            </>
          ) : (
            <>
              {/* <div className="page-icon">
                <img src={IconReader} alt="page-icon" />
              </div>
              <span className="page-label">
                Hacking HR 2022 Global Online Conference
              </span> */}
            </>
          )}
        </div>
        <div className="main-header-right">
          {this.props.live?.live === true && (
            <div
              className="live-button"
              onClick={() => {
                if (user.completed === true) {
                  this.props.history.push(INTERNAL_LINKS.LIVE);
                } else {
                  Emitter.emit(EVENT_TYPES.SHOW_FIREWALL, "live");
                }
              }}
            >
              <div className="live-container">
                <div className="live-circle"></div>
                <div>LIVE</div>
                <p>: {this.props.live.title}</p>
              </div>
            </div>
          )}
          {/* <CustomButton
            text="Invite friend"
            type="primary"
            size="lg"
            className="btn-invite"
            onClick={this.inviteFriend}
          /> */}
          {user.memberShip === "free" && (
            <CustomButton
              text="Upgrade to PREMIUM"
              type="primary"
              size="lg"
              className="btn-upgrade"
              onClick={this.planUpgrade}
            />
          )}
          <Notification className="main-header-notification" />
          <ProfilePopupMenu showPremiumAlert={this.showPremiumAlert}>
            <div className="user-avatar">
              {user.img ? (
                <img src={user.img} alt="user-avatar" />
              ) : (
                user.abbrName
              )}
            </div>
            <span className="user-name">{`${user.firstName || ""} ${
              user.lastName || ""
            }`}</span>
            <div className="profile-menu-chevron">
              <img src={IconChevronDown} alt="profile-menu" />
            </div>
          </ProfilePopupMenu>
        </div>
        <PremiumAlert
          visible={visiblePremiumAlert}
          onCancel={() => this.onHideAlert()}
        />
      </div>
    );
  }
}

MainHeader.propTypes = {
  title: PropTypes.string,
};

MainHeader.defaultProps = {
  title: "",
};

const mapStateToProps = (state) => ({
  userProfile: homeSelector(state).userProfile,
  isMobile: envSelector(state).isMobile,
  selectedChannel: channelSelector(state).selectedChannel,
  selectedCourse: courseSelector(state).course,
  session: sessionSelector(state).session,
  live: liveSelector(state).live,
  podcastSeries: podcastSelector(state).podcastSeries,
  skillCohort: skillCohortSelector(state).skillCohort,
});

const mapDispatchToProps = {
  setCollapsed,
};

export default connect(mapStateToProps, mapDispatchToProps)(MainHeader);
