import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { CheckOutlined } from "@ant-design/icons";

import {
  DateAvatar,
  CustomButton,
  CustomDrawer,
  SpecialtyItem,
  RichEdit,
} from "components";
import { EVENT_TYPES } from "enum";
import Emitter from "services/emitter";
import { actions as eventActions } from "redux/actions/event-actions";
import { homeSelector } from "redux/selectors/homeSelector";

import "./style.scss";

const EventDrawer = ({
  addToMyEventList,
  removeFromMyEventList,
  visible,
  event,
  userProfile,
  onClose,
}) => {
  const onDrawerClose = () => {
    onClose();
  };

  const onAttend = () => {
    addToMyEventList(event);
  };

  const onCancelAttend = () => {
    removeFromMyEventList(event);
  };

  const onClickClaimDigitalCertificate = (e) => {};

  const onClickConfirm = (e) => {
    Emitter.emit(EVENT_TYPES.OPEN_ATTENDANCE_DISCLAIMER, event);
  };

  const onClickClaimCredits = (e) => {};

  const onCLickDownloadCalendar = () => {
    window.open(`${process.env.REACT_APP_API_ENDPOINT}/public/event/ics/${event.id}`,"_blank");
  };

  // const menu = (
  //   <Menu>
  //     <Menu.Item>Google</Menu.Item>
  //     <Menu.Item>Google</Menu.Item>
  //     <Menu.Item>Google</Menu.Item>
  //   </Menu>
  // );

  const planUpgrade = () => {
    Emitter.emit(EVENT_TYPES.OPEN_PAYMENT_MODAL);
  };

  return (
    <CustomDrawer
      title={""}
      width={772}
      visible={visible}
      onClose={onDrawerClose}
    >
      <div className="event-details">
        <div className="event-details-header">
          {event.image2 && <img src={event.image2} alt="event-img" />}
          {!event.image2 && event.image && (
            <img src={event.image} alt="event-img" />
          )}
        </div>
        <div className="event-details-content">
          <div className="event-details-content-actions">
            <DateAvatar day={event.day || 0} month={event.month || ""} />
            {event.status === "past" && (
              <div className="claim-buttons">
                <CustomButton
                  className="claim-digital-certificate"
                  text="Confirm I attended this event"
                  size="md"
                  type="primary outlined"
                  onClick={onClickConfirm}
                />
              </div>
            )}
            {event.status === "confirmed" && (
              <React.Fragment>
                {(userProfile || {}).memberShip === "premium" ? (
                  <React.Fragment>
                    <CustomButton
                      className="claim-digital-certificate"
                      text="Claim digital certificate"
                      size="lg"
                      type="primary outlined"
                      onClick={onClickClaimDigitalCertificate}
                    />
                    <CustomButton
                      text="Claim credits"
                      size="lg"
                      type="primary"
                      onClick={onClickClaimCredits}
                    />
                  </React.Fragment>
                ) : (
                  <CustomButton
                    text="Upgrade to premium"
                    size="md"
                    type="primary"
                    onClick={planUpgrade}
                  />
                )}
              </React.Fragment>
            )}
            {event.status === "attend" && (
              <CustomButton
                text="Attend"
                size="lg"
                type="primary"
                onClick={onAttend}
              />
            )}
            {event.status === "going" && (
              <React.Fragment>
                <div className="going-label">
                  <CheckOutlined />
                  <span>I'm going</span>
                </div>
                <CustomButton
                  className="not-going-btn"
                  text="Not going"
                  size="lg"
                  type="remove"
                  remove={true}
                  onClick={onCancelAttend}
                />
              </React.Fragment>
            )}
          </div>
          <h1 className="event-title">{event.title}</h1>
          <div className="d-flex items-center event-info">
            <div className="d-flex items-center">
              <h3 className="event-date">{event.period}</h3>
            </div>
            { event.status !== "past" && event.status !== "confirmed" && (
              <CustomButton onClick={() => { onCLickDownloadCalendar(); }} text="Download Calendar" size="sm" />
            )}
            {/* {event.status === "going" && event.status !== "past" && (
              <Dropdown overlay={menu}>
                <h3 className="add-to-calendar ant-dropdown-link">
                  Add to calendar
                </h3>
              </Dropdown>
            )} */}
          </div>
          <h3 className="event-type">{`${event.location} event`}</h3>
          <h3 className="event-cost">{event.ticket}</h3>
          {event.type && event.type.length > 0 && (
            <div className="event-topics">
              {event.type.map((tp, index) => (
                <SpecialtyItem key={index} title={tp} active={false} />
              ))}
            </div>
          )}
          <RichEdit data={event.description} />
        </div>
      </div>
    </CustomDrawer>
  );
};

EventDrawer.propTypes = {
  title: PropTypes.string,
  visible: PropTypes.bool,
  event: PropTypes.object,
  onClose: PropTypes.func,
};

EventDrawer.defaultProps = {
  title: "",
  visible: false,
  event: {},
  onClose: () => {},
};

const mapStateToProps = (state) => ({
  userProfile: homeSelector(state).userProfile,
});

const mapDispatchToProps = {
  ...eventActions,
};

export default connect(mapStateToProps, mapDispatchToProps)(EventDrawer);
