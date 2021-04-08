import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Dropdown, Menu } from 'antd';
import { CheckOutlined, DownOutlined } from "@ant-design/icons";

import clsx from "clsx";
import moment from 'moment';
import { withRouter } from "react-router-dom";
import { homeSelector } from "redux/selectors/homeSelector";

import { CustomButton, SpecialtyItem } from "components";
import { EVENT_TYPES, INTERNAL_LINKS } from "enum";
import Emitter from "services/emitter";

import "./style.scss";

class EventCard extends React.Component {

  onAttend = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.onAttend(true);
  };

  onCancelAttend = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.onAttend(false);
  };

  openEventDetails = () => {
    this.props.onClick(this.props.data);
  };

  onClickConfirm = (e) => {
    e.preventDefault();
    e.stopPropagation();

    Emitter.emit(EVENT_TYPES.OPEN_ATTENDANCE_DISCLAIMER, this.props.data);
  };

  onClickClaimDigitalCertificate = (e) => {
    e.preventDefault();
    e.stopPropagation();

    window.open(
      `${INTERNAL_LINKS.CERTIFICATE}/${this.props.data.id}`,
      "_blank"
    );
  };

  onClickClaimCredits = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  planUpgrade = (e) => {
    e.preventDefault();
    e.stopPropagation();
    Emitter.emit(EVENT_TYPES.OPEN_PAYMENT_MODAL);
  };

  onCLickDownloadCalendar = (e) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(`${process.env.REACT_APP_API_ENDPOINT}/public/event/ics/${this.props.data.id}`, "_blank");
  };

  onCLickAddGoogleCalendar = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const description = this.props.data.description.blocks[0].text.replace(/(\r\n|\n|\r)/gm, "");
    let googleCalendarUrl = `http://www.google.com/calendar/event?action=TEMPLATE&text=${this.props.data.title}&dates=${moment(this.props.data.startDate).format('YYYYMMDDTHHmm')}/${moment(this.props.data.endDate).format('YYYYMMDDTHHmmss')}&details=${description}&location=${this.props.data.location}&trp=false&sprop=https://www.hackinghrlab.io/&sprop=name:`;
    window.open(googleCalendarUrl ,"_blank");
  };

  onCLickAddYahooCalendar = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const description = this.props.data.description.blocks[0].text.replace(/(\r\n|\n|\r)/gm, "");
    let yahooCalendarUrl = `http://calendar.yahoo.com/?v=60&type=10&title=${this.props.data.title}&st=${moment(this.props.data.startDate).format('YYYYMMDDTHHmm')}&dur${moment(this.props.data.endDate).format('HHmmss')}&desc=${description}&in_loc=${this.props.data.location}`;
    window.open(yahooCalendarUrl ,"_blank");
  };

  downloadDropdownOptions = () => (
    <Menu>
      <Menu.Item key="1">
        <a href="/#" onClick={this.onCLickDownloadCalendar}>Download ICS File</a>
      </Menu.Item>
      <Menu.Item key="2" >
        <a href="/#" onClick={this.onCLickAddGoogleCalendar}>Add to Google Calendar</a>
      </Menu.Item>
      <Menu.Item key="3">
        <a href="/#" onClick={this.onCLickAddYahooCalendar}>Add to Yahoo Calendar</a>
      </Menu.Item>
    </Menu>
  );

  render() {
    const {
      data: { title, type, ticket, location, status, image, period },
      className,
      userProfile: { memberShip },
    } = this.props;

    return (
      <div
        className={clsx("event-card", className)}
        onClick={this.openEventDetails}
      >
        <div className="event-card-img">
          {image && <img src={image} alt="card-img" />}
        </div>
        <div className="event-card-content d-flex flex-column justify-between items-start">
          <h3>{title}</h3>
          <h5>{period}</h5>
          <h5>{`${location ? location.join(",") : ""} event`}</h5>
          {status !== "past" && status !== "confirmed" && (
            <Dropdown overlay={this.downloadDropdownOptions}>
              <a href="/#" className="ant-dropdown-link" onClick={(e) => {e.preventDefault(); e.stopPropagation(); }}>
                Download calendar <DownOutlined />
              </a>
            </Dropdown>
          )}
          <h6 className="event-card-cost">{ticket}</h6>
          {type && type.length > 0 && (
            <div className="event-card-topics">
              {type.map((ty, index) => (
                <SpecialtyItem key={index} title={ty} active={false} />
              ))}
            </div>
          )}
          <div className="event-card-content-footer">
            <div className="event-card-content-footer-actions">
              {status === "past" && (
                <div className="claim-buttons">
                  <CustomButton
                    className="claim-digital-certificate"
                    text="Confirm I attended this event"
                    size="md"
                    type="primary outlined"
                    onClick={this.onClickConfirm}
                  />
                </div>
              )}
              {status === "confirmed" && (
                <div className="claim-buttons">
                  {memberShip === "premium" ? (
                    <React.Fragment>
                      <CustomButton
                        className="claim-digital-certificate"
                        text="Claim digital certificate"
                        size="md"
                        type="primary outlined"
                        onClick={this.onClickClaimDigitalCertificate}
                      />
                      <CustomButton
                        text="Claim credits"
                        size="md"
                        type="primary"
                        onClick={this.onClickClaimCredits}
                      />
                    </React.Fragment>
                  ) : (
                    <CustomButton
                      text="Upgrade to premium"
                      size="md"
                      type="primary"
                      onClick={this.planUpgrade}
                    />
                  )}
                </div>
              )}
              {status === "attend" && (
                <CustomButton
                  text="Attend"
                  size="md"
                  type="primary"
                  onClick={this.onAttend}
                />
              )}
              {status === "going" && (
                <div className="going-group-part">
                  <div className="going-label">
                    <CheckOutlined />
                    <span>I'm going</span>
                  </div>
                  <CustomButton
                    className="not-going-btn"
                    text="Not going"
                    size="md"
                    type="remove"
                    remove={true}
                    onClick={this.onCancelAttend}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

EventCard.propTypes = {
  data: PropTypes.object,
  className: PropTypes.string,
  onClick: PropTypes.func,
  onAttend: PropTypes.func,
};

EventCard.defaultProps = {
  data: {},
  className: "",
  onClick: () => { },
  onAttend: () => { },
};

const mapStateToProps = (state) => ({
  userProfile: homeSelector(state).userProfile,
});

export default withRouter(connect(mapStateToProps)(EventCard));
