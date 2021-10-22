import React, { useState } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";

import { CustomButton, SpecialtyItem } from "components";
import { ReactComponent as IconChevronDown } from "images/icon-chevron-down.svg";

import "./style.scss";

const AnnualConferenceCard = ({
  session,
  attended,
  added,
  onAddSession,
  onRemoveSession,
}) => {
  const [hideInfo, setHideInfo] = useState(true);

  return (
    <div className="annual-conference-card acc">
      <div className="acc-session-header">
        <h3>{session.title}</h3>
        {added ? (
          <CustomButton
            type="primary outlined"
            size="md"
            text="Remove"
            onClick={onRemoveSession}
          />
        ) : attended ? (
          <CustomButton
            size="sm"
            text="Add To My Personalized Agenda"
            onClick={onAddSession}
          />
        ) : null}
      </div>
      {added && <div className="acc-session-added-tag">Added</div>}
      <div className="acc-session-type">{`Session type: ${session.type}`}</div>
      <div className="acc-session-date">{session.date}</div>
      <div className="acc-session-time">
        {session.period} {session.tz}
      </div>
      <div className="d-flex justify-between align-center">
        <div className="acc-session-categories">
          {session.categories.map((category, i) => (
            <SpecialtyItem key={i} title={category} />
          ))}
        </div>
        <div
          className="acc-session-toggle"
          onClick={() => setHideInfo(!hideInfo)}
        >
          {hideInfo ? "Review session" : "Hide information"}
          <div className={clsx("acc-session-toggle-icon", { hide: !hideInfo })}>
            <IconChevronDown />
          </div>
        </div>
      </div>
      {!hideInfo && (
        <div className="acc-details">
          {session.description && (
            <>
              <h4>Description</h4>
              <p>{session.description}</p>
            </>
          )}
          <div className="acc-details-other-brands">
            {(session.brands || []).map((brand, index) => (
              <div className="session-brand" key={index}>
                <img src={brand} alt="brand-img" />
              </div>
            ))}
          </div>

          <div className="acc-details">
            {session.speakers && <h4>Speakers</h4>}
            {(session.speakers || []).map((speaker, index) => (
              <a
                href={speaker.linkSpeaker}
                target="_blank"
                rel="noopener noreferrer"
                key={index}
              >
                <div className="acc-details-speaker">
                  <div className="acc-details-speaker-image">
                    {speaker.img ? (
                      <img src={speaker.img} alt="speaker-img" />
                    ) : (
                      <div className="empty" />
                    )}
                  </div>
                  <div className="acc-details-speaker-desc">
                    <h4>{speaker.name}</h4>
                    <h5>{speaker.description}</h5>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

AnnualConferenceCard.propTypes = {
  session: PropTypes.object,
  attended: PropTypes.number,
  added: PropTypes.bool,
  onAddSession: PropTypes.func,
  onRemoveSession: PropTypes.func,
};

AnnualConferenceCard.defaultProps = {
  session: {},
  attended: 0,
  added: false,
  onAddSession: () => {},
  onRemoveSession: () => {},
};

export default AnnualConferenceCard;
