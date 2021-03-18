import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

import { Tabs, CustomButton } from "components";
import { INTERNAL_LINKS, USER_ROLES } from "enum";
import ChannelFilterPanel from "./ChannelFilterPanel";
import ResourcesList from "./ResourcesList";
import PodcastsList from "./PodcastsList";
import VideosList from "./VideosList";
import EventsList from "./EventsList";

import { homeSelector } from "redux/selectors/homeSelector";
import { channelSelector } from "redux/selectors/channelSelector";
import { getChannel } from "redux/actions/channel-actions";

import "./style.scss";

const Channel = ({
  match,
  history,
  selectedChannel,
  userProfile,
  getChannel,
}) => {
  const [currentTab, setCurrentTab] = useState("0");
  const [isChannelOwner, setIsChannelOwner] = useState(true);

  const onFilterChange = (filter) => {
    console.log("Filter Change", filter);
  };

  const followChannel = () => {
    console.log("Follow Channel");
  };

  const TabData = [
    {
      title: "Resources",
      content: () => (
        <ResourcesList
          isOwner={isChannelOwner}
          resources={selectedChannel.resources}
        />
      ),
    },
    {
      title: "Podcasts",
      content: () => (
        <PodcastsList
          isOwner={isChannelOwner}
          podcasts={selectedChannel.podcasts}
        />
      ),
    },
    {
      title: "Videos",
      content: () => (
        <VideosList isOwner={isChannelOwner} videos={selectedChannel.videos} />
      ),
    },
    {
      title: "Events",
      content: () => (
        <EventsList isOwner={isChannelOwner} events={selectedChannel.events} />
      ),
    },
  ];

  useEffect(() => {
    if (userProfile && selectedChannel) {
      setIsChannelOwner(
        userProfile.role === USER_ROLES.CHANNEL_ADMIN &&
          !!userProfile.channel &&
          userProfile.channel === selectedChannel.id
      );
    }
  }, [userProfile, selectedChannel]);

  useEffect(() => {
    let isMounted = true;
    if (match.params.id) {
      getChannel(match.params.id, (error) => {
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

  const { User } = selectedChannel || {};

  return (
    <div className="channel-page">
      <ChannelFilterPanel onChange={onFilterChange} />
      <div className="channel-page__container">
        <div className="channel-page__results">
          <div className="channel-page__row">
            <div className="channel-page__info-column">
              {isChannelOwner ? (
                <div className="channel-page__space" />
              ) : (
                <CustomButton
                  htmlType="button"
                  text="Follow Channel"
                  type="primary"
                  size="md"
                  onClick={followChannel}
                />
              )}
              {User && (
                <>
                  <div className="channel-info__user">
                    {User.img ? (
                      <img src={User.img} alt="user-icon" />
                    ) : (
                      <span>{User.abbrName}</span>
                    )}
                  </div>
                  <div className="channel-info__general-info">
                    <h3 className="channel-info__name text-center">
                      {`${selectedChannel.User.firstName} ${selectedChannel.User.lastName}`}
                    </h3>
                    <p className="channel-info__description text-center">
                      {selectedChannel.description}
                    </p>
                  </div>
                </>
              )}
            </div>
            <div className="channel-page__content">
              <Tabs
                data={TabData}
                current={currentTab}
                onChange={setCurrentTab}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state, props) => ({
  selectedChannel: channelSelector(state).selectedChannel,
  userProfile: homeSelector(state).userProfile,
});

const mapDispatchToProps = {
  getChannel,
};

export default connect(mapStateToProps, mapDispatchToProps)(Channel);
