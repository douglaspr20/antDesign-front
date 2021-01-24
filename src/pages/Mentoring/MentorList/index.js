import React, { useState } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { connect } from "react-redux";

import { CustomButton, MemberCard } from "components";
import { numberWithCommas } from "utils/format";
import Emitter from "services/emitter";
import { EVENT_TYPES } from "enum";
import { setSettingCollapsed } from "redux/actions/home-actions";
import { homeSelector } from "redux/selectors/homeSelector";

import IconLoadingMore from "images/icon-loading-more.gif";

import "./style.scss";

const MentorList = ({
  user,
  data,
  total,
  setting,
  setSettingCollapsed,
  loading,
  hideMore,
  onShowMore,
}) => {
  const entry = {
    firstName: "Edgar",
    lastName: "Davis",
    abbrName: "ED",
    img: null,
    about: `Developing Talent & Leadership behaviors. Positive Design Thinking & Strategy through Positive Leadership Strategy and POSITIVE & AGILE coaching | 2 hack habits, goal achievement, and behavior transformation in organizations, sports clubs, PYMES, and corporations.`,
    titleProfessions: "HR Management & Coaching",
    proficiencyLevel: "",
    topicsOfInterest: [
      "Leadership",
      "Recruiting",
      "Human Resources",
      "Technologies",
    ],
    personalLinks: {},
    language: "English EN - United States",
    timezone: "(GMT -12:00) Eniwetok, Kwajalein",
    completed: false,
    percentOfCompletion: 75,
    role: "mentor",
    reason:
      "HHRR leader, community cultivator, speaker, mentor, & advisor. Founder at @CraftAndRigor. Curator of HHRSeattle.org. Formerly HHRR leadership FB & AWS",
    connected: false,
  };
  const Data = Array.from(Array(10).keys()).map((item) => ({
    id: item,
    ...entry,
  }));
  const collapsed = setting.collapsed.mentee;

  const [mentorList, setMentorList] = useState(Data);
  const [match] = useState(8);

  const onMemberCardClick = (member) => {
    Emitter.emit(EVENT_TYPES.OPEN_MEMBER_PANEL, {
      member,
      match: (user || {}).areas || [],
    });
  };

  const onMatchClicked = (index) => {
    if (!mentorList[index].connected) {
      setMentorList((prev) => {
        prev[index].connected = true;
        return [...prev];
      });
    }
  };

  Emitter.on(EVENT_TYPES.MEMBER_CHANGED, (member) => {
    setMentorList((prev) => {
      prev[member.id] = member;
      return [...prev];
    });
  });

  const onCollapseClick = () => {
    setSettingCollapsed({ mentee: !collapsed });
  };

  return (
    <div className="mentor-list">
      <div className="mentor-list-collapse" onClick={onCollapseClick}>
        <i
          className={clsx(
            "fas",
            { "fa-chevron-down": collapsed },
            { "fa-chevron-up": !collapsed }
          )}
        />
      </div>
      <div className="mentor-list-header">
        <div className="mentor-list-header-left">
          <span>{`${numberWithCommas(total)}`}</span>
          <span>{` ${total === 1 ? "mentor" : "mentors"} match with you`}</span>
        </div>
        <span className="mentor-list-header-right">
          {`You have ${numberWithCommas(match)} match left this month`}
        </span>
      </div>
      <div className="mentor-list-items">
        {(data || []).map((mentor, index) => (
          <MemberCard
            key={`mentor-${index}`}
            user={mentor}
            match={user ? user.areas : []}
            onClick={() => onMemberCardClick(mentor)}
            onMatchClicked={() => onMatchClicked(index)}
          />
        ))}
        {!hideMore && (
          <div className="mentor-list-items-more">
            {loading && <img src={IconLoadingMore} alt="loading-more-img" />}
            {!loading && (
              <CustomButton
                text="Show more"
                type="primary outlined"
                size="lg"
                onClick={onShowMore}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

MentorList.propTypes = {
  user: PropTypes.object,
  data: PropTypes.array,
  total: PropTypes.number,
  loading: PropTypes.bool,
  hideMore: PropTypes.bool,
  onShowMore: PropTypes.func,
};

MentorList.defaultProps = {
  user: {},
  data: [],
  total: 0,
  loading: false,
  hideMore: false,
  onShowMore: () => {},
};

const mapStateToProps = (state) => ({
  setting: homeSelector(state).setting,
});

const mapDispatchToProps = {
  setSettingCollapsed,
};

export default connect(mapStateToProps, mapDispatchToProps)(MentorList);
