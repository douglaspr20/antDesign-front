import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Avatar } from "antd";
import { CustomButton } from "components";

import "./style.scss";

const MemberSpeakers = ({
    usersPanel,
    isAdmin,
    remove
}) => {

    const { id, isModerator, UserId} = usersPanel
    const { firstName, img, titleProfessions, lastName, abbrName} = usersPanel.User

    return (
      <>
        <div className="container-users" key={id} id={UserId}>
          <div className="container-data-member">
            {img ? (
              <Avatar size={50} src={img} />
            ) : (
              <Avatar size={50} style={{ fontSize: "1rem" }}>
                {abbrName}
              </Avatar>
            )}
            <div className="container-p">
              <p className="p-title">{firstName} {lastName}</p>
              <p className="p-profession">{titleProfessions}{isModerator ? " / Moderator" : ""}</p>
            </div>
          </div>
          {isAdmin &&
            <CustomButton
              className="button-speaker"
              text="Remove"
              size="md"
              type="third"
              onClick={() => {remove(id)}}
            />}
        </div>
      </>
    );
  };
  
  const mapStateToProps = (state, props) => ({

  });
  
  const mapDispatchToProps = {

  };

  MemberSpeakers.propTypes = {
    usersPanel: PropTypes.object,
    isAdmin: PropTypes.bool,
    remove: PropTypes.func,
  };
  
  MemberSpeakers.defaultProps = {
    usersPanel: {},
    isAdmin: false,
    remove: () => {},
  };
  
  export default connect(mapStateToProps, mapDispatchToProps)(MemberSpeakers);
  