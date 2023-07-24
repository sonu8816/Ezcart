import React, { useState, useEffect } from "react";
import "../styles/RangeSliderStyle.css";

const PriceRangeSlider = ({setValue}) => {
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const priceGap = 1000;

  useEffect(() => {
    updateRange();
    setValue([minPrice, maxPrice]);
  }, [minPrice, maxPrice]);

  const handleMinInputChange = (event) => {
    let min = parseInt(event.target.value, 10);
    if (min > maxPrice - priceGap) {
      min = maxPrice - priceGap;
    } else if (min < 0) {
      min = 0;
    }
    setMinPrice(min);
  };

  const handleMaxInputChange = (event) => {
    let max = parseInt(event.target.value, 10);
    if (max < minPrice + priceGap) {
      max = minPrice + priceGap;
    } else if (max > 10000) {
      max = 10000;
    }
    setMaxPrice(max);
  };

  const updateRange = () => {
    const rangeInput = document.querySelectorAll(".range-input input");
    const range = document.querySelector(".slider .progress");

    rangeInput[0].value = parseInt(rangeInput[0].value, 10);
    rangeInput[1].value = parseInt(rangeInput[1].value, 10);

    const leftPercentage = (minPrice / rangeInput[0].max) * 100;
    const rightPercentage = 100 - (maxPrice / rangeInput[1].max) * 100;

    range.style.left = `${leftPercentage}%`;
    range.style.right = `${rightPercentage}%`;
  };

  return (
    <div className="range-slider">
      <div className="wrapper">
        <div className="price-input">
          <div className="field">
            <span className="filter-option-text">Min</span>
            <input
              type="number"
              className="input-min"
              value={minPrice}
            //   onChange={handleMinInputChange}
              disabled={true}
            />
          </div>
          <div className="field">
            <span className="filter-option-text">Max</span>
            <input
              type="number"
              className="input-max"
              value={maxPrice}
            //   onChange={handleMaxInputChange}
              disabled={true}
            />
          </div>
        </div>

        <div className="slider-bottom">
        <div className="slider">
          <div className="progress"></div>
        </div>

        <div className="range-input">
          <input
            type="range"
            className="range-min"
            min="0"
            max="10000"
            value={minPrice}
            step="100"
            onChange={handleMinInputChange}
          />
          <input
            type="range"
            className="range-max"
            min="0"
            max="10000"
            value={maxPrice}
            step="100"
            onChange={handleMaxInputChange}
          />
        </div>
        </div>

      </div>
    </div>
  );
};

export default PriceRangeSlider;
