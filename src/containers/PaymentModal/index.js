import React from "react";
import PropTypes from "prop-types";
import { Modal } from "antd";
import { connect } from "react-redux";
import { CloseCircleFilled } from "@ant-design/icons";

import { setPlanUpdated } from "redux/actions/home-actions";
import PaymentForm from "../PaymentForm";

import IconLogo from "images/logo-sidebar.svg";

import "./style.scss";

const PaymentModal = ({ visible, onPay, setPlanUpdated, ...rest }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    onPay();
    setPlanUpdated(true);
  };

  return (
    <Modal
      {...rest}
      className="payment-modal"
      title={
        <div className="payment-modal-title">
          <h3>Plan update</h3>
          <h5>Access to all content</h5>
          <div className="payment-modal-logo">
            <img src={IconLogo} alt="payment-logo" />
          </div>
        </div>
      }
      centered
      visible={visible}
      width={300}
      closable={true}
      footer={[]}
      closeIcon={<CloseCircleFilled className="payment-modal-close" />}
    >
      <PaymentForm handleSubmit={handleSubmit} />
    </Modal>
  );
};

PaymentModal.propTypes = {
  visible: PropTypes.bool,
  onPay: PropTypes.func,
};

PaymentModal.defaultProps = {
  visible: false,
  onPay: () => {},
};

const mapStateToProps = () => ({});

const mapDispatchToProps = {
  setPlanUpdated,
};

export default connect(mapStateToProps, mapDispatchToProps)(PaymentModal);
