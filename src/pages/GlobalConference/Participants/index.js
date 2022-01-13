import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { sessionSelector } from "redux/selectors/sessionSelector";
import { getBonfires } from "redux/actions/bonfire-actions";
import { homeSelector } from "redux/selectors/homeSelector";
import {
  getParticipants,
  getRecommendedParticipants,
} from "redux/actions/session-actions";
import { Chat, Tabs } from "components";
import SocketIO from "services/socket";
import { SOCKET_EVENT_TYPE } from "enum";
import RecommendedParticipants from "./RecommendedParticipants";
import ParticipantsOnline from "./ParticipantsOnline";

import "./style.scss";

const Participants = ({
  participants,
  recommendedParticipants,
  userProfile,
  getParticipants,
  getRecommendedParticipants,
  getBonfires,
}) => {
  const [currentTab, setCurrentTab] = useState("0");

  useEffect(() => {
    if (userProfile.topicsOfInterest.length > 0 && userProfile.id) {
      getRecommendedParticipants({
        topics: userProfile.topicsOfInterest,
        userId: userProfile.id,
        num: 50,
      });
      getParticipants(userProfile.id);
      getBonfires();
    }
  }, [getParticipants, getRecommendedParticipants, getBonfires, userProfile]);

  useEffect(() => {
    SocketIO.on(SOCKET_EVENT_TYPE.USER_ONLINE, () => {
      getRecommendedParticipants({
        topics: userProfile.topicsOfInterest,
        userId: userProfile.id,
        num: 50,
      });
      getParticipants({
        topics: userProfile.topicsOfInterest,
        userId: userProfile.id,
      });
      getBonfires();
    });

    SocketIO.on(SOCKET_EVENT_TYPE.USER_OFFLINE, () => {
      getRecommendedParticipants({
        topics: userProfile.topicsOfInterest,
        userId: userProfile.id,
        num: 50,
      });
      getParticipants({
        topics: userProfile.topicsOfInterest,
        userId: userProfile.id,
      });
      getBonfires();
    });
  }, [getParticipants, getBonfires, getRecommendedParticipants, userProfile]);

  const TabData = [
    {
      title: "Recommended Participants To Connect",
      content: () => (
        <RecommendedParticipants
          participants={recommendedParticipants}
          getBonfires={getBonfires}
          key="0"
        />
      ),
    },
    {
      title: "Participants Online",
      content: () => (
        <ParticipantsOnline
          participants={participants.filter(
            (participant) => participant.isOnline === true
          )}
          key="1"
        />
      ),
    },
  ];

  const handleTab = (key) => {
    setCurrentTab(key);
  };

  return (
    <div className="participants-wrapper">
      <Tabs data={TabData} current={currentTab} onChange={handleTab} />
      <Chat />
    </div>
  );
};

const mapStateToProps = (state) => ({
  ...sessionSelector(state),
  userProfile: homeSelector(state).userProfile,
});

const mapDispatchToProps = {
  getParticipants,
  getRecommendedParticipants,
  getBonfires,
};

export default connect(mapStateToProps, mapDispatchToProps)(Participants);
