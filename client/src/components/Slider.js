import React from "react";

const Slider = () => {
  return (
    <>
        <div id="carouselExampleAutoplaying" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-inner">
            {[1,2,3,4,5,6].map((i) => (
                <div className={`carousel-item ${i === 1 ? 'active' : ''}`} data-bs-interval="3000" key={i}>
                    <img src={`/images/b_${i}.jpg`} height="300" className="d-block w-100" alt={`slider_img_${i}`} />
                </div>
            ))}    
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true" />
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true" />
            <span className="visually-hidden">Next</span>
          </button>
        </div>
    </>
  );
};

export default Slider;
