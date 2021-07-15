import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { SpecialtyItem } from "components";
import { categorySelector } from "redux/selectors/categorySelector";

import "./style.scss";

const PodcastSeriesCard = ({ data, allCategories, onClick }) => {
  const [lineClamp, setLineClamp] = useState(12);
  const { title, img, description, hrCreditOffered, categories } = data || {};
  const randomId = `podcastseries-description-${Math.floor(
    Math.random() * 1000
  )}`;

  useEffect(() => {
    let isMounted = true;
    setTimeout(() => {
      if (isMounted) {
        getRowNum();
      }
    }, 500);

    window.addEventListener("resize", getRowNum);

    return () => {
      isMounted = false;
      window.removeEventListener("resize", getRowNum);
    };
    // eslint-disable-next-line
  }, []);

  const getRowNum = () => {
    const descElement = document.querySelector(`#${randomId}`);
    if (descElement) {
      const maxRow = Math.floor(descElement.offsetHeight / 18);
      setLineClamp(maxRow ? maxRow : 1);
    }
  };

  return (
    <div className="podcast-series-card" onClick={onClick}>
      <div className="podcast-series-card-header">
        {img ? (
          <img src={img} alt="header-img" />
        ) : (
          <div className="podcast-series-card-backimg" />
        )}
      </div>
      <div className="podcast-series-card-content">
        <h3 className="podcast-series-card-title">{title}</h3>
        <div id={randomId} className="d-flex">
          <p
            className="podcast-series-card-desc"
            style={{
              WebkitLineClamp: lineClamp,
              maxHeight: 50 * lineClamp,
            }}
          >
            {description}
          </p>
        </div>
        <h5 className="podcast-series-card-hr">
          <strong>{`HR Credit Offered: `}</strong>
          {hrCreditOffered || ""}
        </h5>
        <div className="podcast-series-card-categories">
          {(categories || []).map((item, index) => {
            const category = allCategories.find((cat) => cat.value === item);
            return (
              <SpecialtyItem
                key={index}
                title={category ? category.title : item}
                active={false}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

PodcastSeriesCard.propTypes = {
  data: PropTypes.object,
  onClick: PropTypes.func,
};

PodcastSeriesCard.defaultProps = {
  data: {},
  onClick: () => {},
};

const mapStateToProps = (state) => ({
  allCategories: categorySelector(state).categories,
});

export default connect(mapStateToProps)(PodcastSeriesCard);