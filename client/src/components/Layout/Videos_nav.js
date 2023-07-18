import React from 'react'


export default function Videos_nav() {
  return (
  <>
    <div id="carouselExampleRide" className="carousel slide" data-bs-ride="true">
      <div className="carousel-inner">
        <div className="carousel-item active" data-bs-interval="3000">
          <img src="/images/b_1_n.jpg" height="350" className="d-block w-100" alt="..." />
        </div>
        <div className="carousel-item" data-bs-interval="3000">
          <img src="/images/b_2_n.jpg" height="350" className="d-block w-100" alt="..." />
        </div>
        <div className="carousel-item">
          <img src="/images/b_3_n.jpg" height="350" className="d-block w-100" alt="..." />
        </div>
        <div className="carousel-item">
          <img src="/images/b_4_n.jpg" height="350" className="d-block w-100" alt="..." />
        </div>
      </div>
      <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleRide" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true" />
        <span className="visually-hidden">Previous</span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleRide" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true" />
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  </>
  )
}
