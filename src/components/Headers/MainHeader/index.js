import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { SIDEBAR_MENU_LIST, EVENT_TYPES } from "enum";
import CustomButton from "../../Button";
import ProfilePopupMenu from "../../ProfilePopupMenu";
import Emitter from "services/emitter";
import { setCollapsed } from "redux/actions/env-actions";

import IconChevronDown from "images/icon-chevron-down.svg";

import "./style.scss";

const MenuList = [
  ...SIDEBAR_MENU_LIST.TOP_MENUS,
  ...SIDEBAR_MENU_LIST.BOTTOM_MENUS,
];

class MainHeader extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {
        img: null,
        name: "Edgar davis",
        abbrName: "ED",
      },
    };
  }

  planUpgrade = () => {
    Emitter.emit(EVENT_TYPES.OPEN_PAYMENT_MODAL);
  };

  onShowSidebar = () => {
    this.props.setCollapsed(false);
  };

  render() {
    const { user } = this.state;
    const { pathname } = this.props.history.location || {};
    const pathInfo = MenuList.find((item) => item.url === pathname);
    const { planUpdated } = this.props.home;

    return (
      <div className="main-header">
        <div className="main-header-left">
          {this.props.isMobile && (
            <div className="main-header-left-menu" onClick={this.onShowSidebar}>
              <i className="fal fa-bars" />
            </div>
          )}
          {pathInfo && (
            <>
              <div className="page-icon">
                <img src={pathInfo.icon} alt="page-icon" />
              </div>
              <span className="page-label">{pathInfo.label}</span>
            </>
          )}
        </div>
        <div className="main-header-right">
          {!planUpdated && (
            <CustomButton
              text="Upgrade"
              type="primary"
              size="lg"
              className="btn-upgrade"
              onClick={this.planUpgrade}
            />
          )}
          <ProfilePopupMenu>
            <div className="user-avatar">
              {user.img ? (
                <img src={user.img} alt="user-avatar" />
              ) : (
                user.abbrName
              )}
            </div>
            <span className="user-name">{user.name}</span>
            <div className="profile-menu-chevron">
              <img src={IconChevronDown} alt="profile-menu" />
            </div>
          </ProfilePopupMenu>
        </div>
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

const mapStateToProps = (state, props) => {
  return { ...state, ...props, isMobile: state.env.isMobile };
};

const mapDispatchToProps = {
  setCollapsed,
};

export default connect(mapStateToProps, mapDispatchToProps)(MainHeader);
