import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { sessionSelector } from "redux/selectors/sessionSelector";
import { getBonfires } from "redux/actions/bonfire-actions";
import { homeSelector } from "redux/selectors/homeSelector";
import { conversationsSelector } from "redux/selectors/conversationSelector";
import {
  getParticipants,
  getRecommendedParticipants,
  setRecomnendedParticipants,
  setParticipants,
} from "redux/actions/session-actions";
import { getConversations } from "redux/actions/conversation-actions";
import { Chat, Tabs } from "components";
import SocketIO from "services/socket";
import { SOCKET_EVENT_TYPE } from "enum";
import RecommendedParticipants from "./RecommendedParticipants";
import ParticipantsOnline from "./ParticipantsOnline";

import "./style.scss";

const Participants = ({
  participants,
  recommendedParticipants,
  setRecomnendedParticipants,
  setParticipants,
  userProfile,
  getParticipants,
  getRecommendedParticipants,
  getBonfires,
  getConversations,
  conversations,
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
    getConversations(userProfile.id);
  }, [
    getParticipants,
    getRecommendedParticipants,
    getBonfires,
    userProfile,
    getConversations,
  ]);

  useEffect(() => {
    SocketIO.on(SOCKET_EVENT_TYPE.USER_ONLINE, (participant) => {
      setRecomnendedParticipants(
        recommendedParticipants.map((p) =>
          p.id === participant.id ? participant : p
        )
      );

      setParticipants(
        participants.map((p) => (p.id === participant.id ? participant : p))
      );
    });
  }, [
    recommendedParticipants,
    setRecomnendedParticipants,
    participants,
    setParticipants,
  ]);

  useEffect(() => {
    SocketIO.on(SOCKET_EVENT_TYPE.USER_OFFLINE, (participant) => {
      setRecomnendedParticipants(
        recommendedParticipants.map((p) =>
          p.id === participant.id ? participant : p
        )
      );

      setParticipants(
        participants.map((p) => (p.id === participant.id ? participant : p))
      );
    });
  }, [
    recommendedParticipants,
    setRecomnendedParticipants,
    participants,
    setParticipants,
  ]);

  const handleTab = (key) => {
    setCurrentTab(key);
  };

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
  conversations: conversationsSelector(state).conversations,
});

const mapDispatchToProps = {
  getParticipants,
  getRecommendedParticipants,
  getBonfires,
  setRecomnendedParticipants,
  setParticipants,
  getConversations,
};

export default connect(mapStateToProps, mapDispatchToProps)(Participants);
