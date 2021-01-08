import React, { useState } from "react";
import PropTypes from "prop-types";
import { Checkbox } from "antd";

import { CustomButton, CustomInput, CustomCheckbox } from "components";
import { PROFILE_SETTINGS } from "enum";

import "./style.scss";

const Specialties = PROFILE_SETTINGS.SPECIALTIES;

const MenteeSetting = ({ setting, onCancel, onSave }) => {
  const [reason, setReason] = useState(setting.reason);
  const [title, setTitle] = useState(setting.title);
  const [specialties, setSpecialties] = useState(setting.specialties || []);

  const onClickSave = () => {
    onSave({
      reason,
      title,
      specialties,
    });
  };

  return (
    <div className="mentee-setting">
      <div className="mentor-setting-container">
        <h2>Becoming into a mentee</h2>
        <h5 className="mentee-setting-sublabel first">
          Why do you want to be a mentee?
        </h5>
        <CustomInput
          className="mentee-setting-input"
          multiple={true}
          defaultValue={reason}
          onChange={setReason}
        />
        <h5 className="mentee-setting-sublabel">
          What is your current title / profession?
        </h5>
        <CustomInput
          className="mentee-setting-input"
          defaultValue={title}
          onChange={setTitle}
        />
        <h5 className="mentee-setting-sublabel">What do you want to learn?</h5>
        <Checkbox.Group
          defaultValue={specialties}
          className="mentee-setting-specialties"
          onChange={setSpecialties}
        >
          {Specialties.map((spec, index) => (
            <CustomCheckbox key={`specialty-${index}`} value={spec}>
              {spec}
            </CustomCheckbox>
          ))}
        </Checkbox.Group>
      </div>
      <div className="mentee-setting-footer">
        <CustomButton
          text="Cancel"
          type="primary outlined"
          size="xl"
          onClick={onCancel}
        />
        <CustomButton
          text="Save"
          type="primary"
          size="lg"
          onClick={onClickSave}
        />
      </div>
    </div>
  );
};

MenteeSetting.propTypes = {
  setting: PropTypes.object,
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
};

MenteeSetting.defaultProps = {
  setting: {},
  onCancel: () => {},
  onSave: () => {},
};

export default MenteeSetting;