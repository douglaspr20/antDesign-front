import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import html2canvas from "html2canvas";
import jsPdf from "jspdf";
import moment from "moment";
import converter from "number-to-words";

import { CustomButton } from "components";
import { setLoading } from "redux/actions/home-actions";
import { getEvent } from "redux/actions/event-actions";
import { homeSelector } from "redux/selectors/homeSelector";
import { eventSelector } from "redux/selectors/eventSelector";

import LogoSidebar from "images/logo-sidebar.svg";

import "./style.scss";

const CertificatePage = ({
  user,
  updatedEvent,
  getEvent,
  match,
  setLoading,
}) => {
  const downloadPdf = async () => {
    setLoading(true);
    const domElement = document.getElementById("certificate-panel");
    const canvas = await html2canvas(domElement);

    const width = domElement.clientWidth;
    const height = domElement.clientHeight;

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPdf({
      orientation: "landscape",
      format: [width, height],
      unit: "px",
    });
    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save("certificate.pdf");
    setLoading(false);
  };

  const getPerodOfEvent = (startDate, endDate) => {
    const duration = moment.duration(moment(endDate).diff(moment(startDate)));

    return duration.asHours();
  };

  useEffect(() => {
    const {
      params: { id: eventId },
    } = match;
    getEvent(eventId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const period = getPerodOfEvent(updatedEvent.startDate, updatedEvent.endDate);

  return (
    <div className="certificate-page">
      <div className="certificate-page-wrapper" id="certificate-panel">
        <div className="certificate">
          <div className="certificate-top">
            <div className="certificate-logo">
              <img src={LogoSidebar} alt="sidebar-logo" />
            </div>
            <h3 className="certificate-title">
              Hacking HR’s Certificate of Participation
            </h3>
            <h1 className="certificate-username">{`${user.firstName} ${user.lastName}`}</h1>
          </div>
          <div className="certificate-center">
            <h5 className="certificate-text1">
              For Attending The Hacking HR Mumbai Chapter Session:
            </h5>
            <h4 className="certificate-text2">{updatedEvent.title}</h4>
            <h5 className="certificate-text1 duration">{`Duration: ${converter.toWords(
              period
            )} Hour${period > 1 ? "s" : ""}`}</h5>
          </div>
          <div className="certificate-bottom">
            <div className="certificate-bottom-sign">
              <h5 className="certificate-text1 date">{`${moment(
                updatedEvent.startDate
              ).format("MMMM DD, YYYY")}`}</h5>
              <div className="certificate-divider" />
              <h5 className="certificate-text1">Date</h5>
            </div>
            <div className="certificate-bottom-image">
              <img src={LogoSidebar} alt="certificate-img" />
            </div>
            <div className="certificate-bottom-sign">
              <div className="certificate-signature"></div>
              <div className="certificate-divider" />
              <h5 className="certificate-text1 signature">
                Founder | Hacking HR signature
              </h5>
            </div>
          </div>
        </div>
      </div>
      <div className="certificate-page-actions">
        <CustomButton
          id="print-button"
          text="Download PDF"
          type="primary"
          size="lg"
          onClick={downloadPdf}
        />
      </div>
    </div>
  );
};

CertificatePage.propTypes = {
  title: PropTypes.string,
};

CertificatePage.defaultProps = {
  title: "",
};

const mapStateToProps = (state) => ({
  user: homeSelector(state).userProfile,
  updatedEvent: eventSelector(state).updatedEvent,
});

const mapDispatchToProps = {
  setLoading,
  getEvent,
};

export default connect(mapStateToProps, mapDispatchToProps)(CertificatePage);
