import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import clsx from "clsx";
import Helmet from "react-helmet";
import { CheckOutlined, DownOutlined } from "@ant-design/icons";
import { Modal, Dropdown, Space, Menu } from "antd";
import moment from "moment";
import { isEmpty } from "lodash";

import {
  convertToLocalTime,
  getEventPeriod,
  convertToCertainTime,
} from "utils/format";
import Emitter from "services/emitter";
import { CustomButton, SpecialtyItem, RichEdit } from "components";
import Login from "pages/Login";
import { getEvent, addToMyEventList } from "redux/actions/event-actions";
import { getUser } from "redux/actions/home-actions";
import { eventSelector } from "redux/selectors/eventSelector";
import { authSelector } from "redux/selectors/authSelector";
import { envSelector } from "redux/selectors/envSelector";
import { homeSelector } from "redux/selectors/homeSelector";
import { INTERNAL_LINKS, EVENT_TYPES, TIMEZONE_LIST } from "enum";

import "./style.scss";

const PublicEventPage = ({
  match,
  updatedEvent,
  isAuthenticated,
  isMobile,
  getEvent,
  addToMyEventList,
  history,
  userProfile,
  getUser,
}) => {
  const [canonicalUrl, setCanonicalUrl] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [editor, setEditor] = useState("froala");
  const [showFirewall, setShowFirewall] = useState(false);

  const onAttend = () => {
    if (isAuthenticated) {
      if (updatedEvent.ticket === "premium") {
        if (!isEmpty(userProfile) && userProfile.memberShip === "premium") {
          const timezone = moment.tz.guess();
          addToMyEventList(updatedEvent, timezone);
          history.push(INTERNAL_LINKS.EVENTS);
        } else {
          setShowFirewall(true);
        }
      } else {
        const timezone = moment.tz.guess();
        addToMyEventList(updatedEvent, timezone);
        history.push(INTERNAL_LINKS.EVENTS);
      }
    } else {
      setModalVisible(true);
    }
  };

  useEffect(() => {
    getUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (updatedEvent.description && updatedEvent.description.blocks) {
      setEditor("draft");
    } else {
      setEditor("froala");
    }
  }, [updatedEvent]);

  useEffect(() => {
    let isMounted = true;
    if (match.params.id) {
      setCanonicalUrl(
        `${process.env.REACT_APP_DOMAIN_URL}${INTERNAL_LINKS.PUBLIC_EVENT}/${match.params.id}`
      );
      getEvent(match.params.id, (error) => {
        if (isMounted && error) {
          history.push(INTERNAL_LINKS.NOT_FOUND);
        }
      });
    }

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const planUpgrade = (e) => {
    e.preventDefault();
    e.stopPropagation();
    Emitter.emit(EVENT_TYPES.OPEN_PAYMENT_MODAL);
  };

  const onCancelModal = () => {
    setModalVisible(false);
  };

  const onClickDownloadCalendar = (day) => {
    window.open(
      `${process.env.REACT_APP_API_ENDPOINT}/public/event/ics/${updatedEvent?.id}?day=${day}`,
      "_blank"
    );
  };

  const onClickAddGoogleCalendar = (startDate, endDate) => {
    let googleCalendarUrl = `http://www.google.com/calendar/event?action=TEMPLATE&text=${
      updatedEvent?.title
    }&dates=${convertToLocalTime(startDate).format(
      "YYYYMMDDTHHmm"
    )}/${convertToLocalTime(endDate).format("YYYYMMDDTHHmmss")}&location=${
      updatedEvent?.location
    }&trp=false&sprop=https://www.hackinghrlab.io/&sprop=name:`;

    window.open(googleCalendarUrl, "_blank");
  };

  const onClickAddYahooCalendar = (startDate, endDate) => {
    let yahooCalendarUrl = `http://calendar.yahoo.com/?v=60&type=10&title=${
      updatedEvent?.title
    }&st=${convertToLocalTime(startDate).format(
      "YYYYMMDDTHHmm"
    )}&dur${convertToLocalTime(endDate).format("HHmmss")}&in_loc=${
      updatedEvent?.location
    }`;
    window.open(yahooCalendarUrl, "_blank");
  };

  const handleOnClick = ({ item, key, domEvent }) => {
    domEvent.stopPropagation();
    domEvent.preventDefault();

    const [startTime, endTime, day] = item.props.value;

    const timezone = TIMEZONE_LIST.find(
      (item) => item.value === updatedEvent.timezone
    );
    const offset = timezone.offset;

    const convertedStartTime = convertToLocalTime(
      moment(startTime).utcOffset(offset, true)
    );
    const convertedEndTime = convertToLocalTime(
      moment(endTime).utcOffset(offset, true)
    );

    switch (key) {
      case "1":
        onClickDownloadCalendar(day);
        break;
      case "2":
        onClickAddGoogleCalendar(convertedStartTime, convertedEndTime);
        break;
      case "3":
        onClickAddYahooCalendar(convertedStartTime, convertedEndTime);
        break;
      default:
      //
    }
  };

  const downloadDropdownOptions = (startTime, endTime, day) => {
    return (
      <Menu onClick={handleOnClick}>
        <Menu.Item key="1" value={[startTime, endTime, day]}>
          Download ICS File
        </Menu.Item>
        <Menu.Item key="2" value={[startTime, endTime]}>
          Add to Google Calendar
        </Menu.Item>
        <Menu.Item key="3" value={[startTime, endTime]}>
          Add to Yahoo Calendar
        </Menu.Item>
      </Menu>
    );
  };

  return (
    <div className="public-event-page">
      {showFirewall && (
        <div
          className="event-card-firewall"
          onClick={() => setShowFirewall(false)}
        >
          <div className="upgrade-notification-panel" onClick={planUpgrade}>
            <h3>
              This event requires a PREMIUM Membership to join. Click here to
              upgrate to a Premium Membership and get unlimited access to the
              LAB features.
            </h3>
          </div>
        </div>
      )}
      <Helmet>
        <title>{updatedEvent.title}</title>
        <meta name="description" content={updatedEvent.about} />
        <meta name="twitter:creator" />
        <meta
          name="twitter:image"
          content={updatedEvent.image || updatedEvent.image2}
        />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={updatedEvent.title} />
        <meta property="og:description" content={updatedEvent.about} />
        <meta
          property="og:image"
          content={updatedEvent.image || updatedEvent.image2}
        />
        <link rel="canonical" href={canonicalUrl} />
        <link
          rel="image_src"
          href={updatedEvent.image || updatedEvent.image2}
        />
      </Helmet>
      <div className="public-event-page-header">
        {updatedEvent.image2 && (
          <img src={updatedEvent.image2} alt="updatedEvent-img" />
        )}
        {!updatedEvent.image2 && updatedEvent.image && (
          <img src={updatedEvent.image} alt="event-img" />
        )}
        {!updatedEvent.image2 && !updatedEvent.image && (
          <div className="public-event-page-header-defaultimg" />
        )}
        <div className="public-event-page-header-title">
          <Modal
            visible={modalVisible}
            footer={null}
            width={400}
            bodyStyle={{ overflow: "auto", padding: "20px" }}
            className="modal-container-login"
            onCancel={onCancelModal}
          >
            <Login
              login={true}
              signUp={false}
              history={null}
              match={{ params: {} }}
              onClose={onCancelModal}
            />
          </Modal>
          {updatedEvent.status === "attend" && (
            <CustomButton
              text="REGISTER HERE"
              size={isMobile ? "md" : "lg"}
              type="primary"
              onClick={onAttend}
            />
          )}
          {updatedEvent.status === "going" && (
            <div className="going-label">
              <CheckOutlined />
              <span>I'm going</span>
            </div>
          )}
        </div>
      </div>
      <div className="public-event-page-content">
        <div className="public-event-page-content-calendar">
          {updatedEvent.status === "going" && isAuthenticated && (
            <Space direction="vertical">
              {updatedEvent?.startAndEndTimes.map((time, index) => {
                const startTime = convertToCertainTime(
                  time.startTime,
                  updatedEvent.timezone
                );
                const endTime = convertToCertainTime(
                  time.endTime,
                  updatedEvent.timezone
                );

                return (
                  <div className="d-flex calendar" key={index}>
                    <Space size="middle">
                      <Dropdown
                        overlay={downloadDropdownOptions(
                          startTime,
                          endTime,
                          index
                        )}
                      >
                        <a
                          href="/#"
                          className="ant-dropdown-link"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                        >
                          <Space>
                            {updatedEvent?.startAndEndTimes.length > 1
                              ? `Download Calendar Day ${index + 1}: ${moment(
                                  startTime
                                ).format("MMM DD")} `
                              : "Download Calendar"}
                            <DownOutlined />
                          </Space>
                        </a>
                      </Dropdown>
                    </Space>
                  </div>
                );
              })}
            </Space>
          )}
        </div>
        <h1
          className={clsx("event-title", {
            "no-image": !updatedEvent.image2 && !updatedEvent.image,
          })}
        >
          {updatedEvent.title}
        </h1>
        <h3 className="event-date">
          {getEventPeriod(
            updatedEvent.startDate,
            updatedEvent.endDate,
            updatedEvent.timezone
          )}
        </h3>
        <h3 className="event-type">{`${(updatedEvent.location || []).join(
          ", "
        )} event`}</h3>
        <h3 className="event-cost">{updatedEvent.ticket}</h3>

        <h5>Event Type:</h5>
        {updatedEvent.type && updatedEvent.type.length > 0 && (
          <div className="event-topics">
            {updatedEvent.type.map((tp, index) => (
              <SpecialtyItem key={index} title={tp} active={false} />
            ))}
          </div>
        )}
        <h5>Event Topics:</h5>
        {updatedEvent.categories && updatedEvent.categories.length > 0 && (
          <div className="event-topics">
            {updatedEvent.categories.map((tp, index) => (
              <SpecialtyItem key={index} title={tp} active={false} />
            ))}
          </div>
        )}
        {editor === "froala" ? (
          <div
            className="event-description"
            dangerouslySetInnerHTML={{
              __html: (updatedEvent.description || {}).html || "",
            }}
          />
        ) : (
          <RichEdit data={updatedEvent.description} />
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  updatedEvent: eventSelector(state).updatedEvent,
  isAuthenticated: authSelector(state).isAuthenticated,
  isMobile: envSelector(state).isMobile,
  userProfile: homeSelector(state).userProfile,
});

const mapDispatchToProps = {
  getEvent,
  addToMyEventList,
  getUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(PublicEventPage);
