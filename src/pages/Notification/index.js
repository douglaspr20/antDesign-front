/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Spin } from "antd";
import moment from "moment";

import { CustomButton } from "components";
import { notificationSelector } from "redux/selectors/notificationSelector";
import { getNotifications } from "redux/actions/notification-actions";

import IconLoading from "images/icon-loading.gif";
import IconLoadingMore from "images/icon-loading-more.gif";

import "./style.scss";

const MAX_NOTIFICATIONS = 3;

const NotificationPage = ({
  notificationList,
  loading,
  moreLoading,
  currentPage,
  countOfResults,
  getNotifications,
}) => {
  useEffect(() => {
    getNotifications(1, MAX_NOTIFICATIONS);
  }, []);

  const onShowMore = () => {
    getNotifications(currentPage + 1, MAX_NOTIFICATIONS);
  };

  const renderLoading = () => <div className="loading-container" />;

  const renderNotifications = () => (
    <>
      {notificationList.length > 0 ? (
        <>
          {notificationList.map((noti) => (
            <div className="notification-list-item" key={noti.id}>
              <div className="notification-list-item-left">
                <h4 className="notification-list-item-message">
                  {noti.message}
                </h4>
                <h6 className="notification-list-item-date">
                  {moment(noti.createdAt).format("YYYY, MMM DD h:mm a")}
                </h6>
              </div>
              {noti.type === "event" && (
                <a
                  className="notification-list-item-link"
                  href={noti.meta.publicLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Go to public page
                </a>
              )}
            </div>
          ))}
          {currentPage * MAX_NOTIFICATIONS < countOfResults && (
            <div className="notification-page-showmore d-flex justify-center items-center">
              {moreLoading && (
                <img src={IconLoadingMore} alt="loading-more-img" />
              )}
              {!moreLoading && (
                <CustomButton
                  text="Show more"
                  type="primary outlined"
                  size="lg"
                  onClick={onShowMore}
                />
              )}
            </div>
          )}
        </>
      ) : (
        <div className="notification-list-item">
          <h5>No notifications</h5>
        </div>
      )}
    </>
  );

  return (
    <div className="notification-page">
      <div className="notification-page-wrapper">
        {loading ? renderLoading() : renderNotifications()}
      </div>
    </div>
  );
};

NotificationPage.propTypes = {
  title: PropTypes.string,
};

NotificationPage.defaultProps = {
  title: "",
};

const mapStateToProps = (state) => ({
  ...notificationSelector(state),
});

const mapDispatchToProps = {
  getNotifications,
};

export default connect(mapStateToProps, mapDispatchToProps)(NotificationPage);
