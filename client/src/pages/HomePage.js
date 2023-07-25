import React, { useState, useEffect } from "react";
import { Checkbox, Radio } from "antd";
import { Prices } from "../components/Prices";
import axios from "axios";
import Layout from "./../components/Layout/Layout";
import { AiOutlineReload } from "react-icons/ai";
import "../styles/Homepage.css";
import useCategory from "../hooks/useCategory";
import ImageSlider from "../components/ImageSlider";
import ProductCard from "../components/ProductCard";
import PriceRangeSlider from "../components/RangeSlider";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  //get all category
  const categories = useCategory();          //custom hook
  
  // filter by category
  const handleFilterByCategory = (value, id) => {
    let all = [...checked];
    if (value) {     /* if we select the checkbox */
      all.push(id);
    } else {        /* if we deselect the checkbox */
      all = all.filter((c) => c !== id);
    }
    setChecked(all);
  };

  // getFilterTOtal Count
  const getTotal = async () => {
    try {
      const { data } = await axios.post("/api/v1/product/product-filters-count",{
        checked,
        radio,
      });
      setTotal(data?.total);
    } catch (error) {
      console.log(error);
    }
  };

  //loadmore filtered product
  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(`/api/v1/product/product-filters/${page}`, {
        checked,
        radio,
      });
      setLoading(false);
      if(page===1) setProducts([...data?.products]);
      else setProducts([...products, ...data?.products]);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  
  // Apply all filters
  const handleApplyFilter = () => {
    if(page===1){
      getTotal();
      loadMore();
    } else {
      setPage(1);
    }
  };
  
  // Reset all filters
  const handleReset = () => {
    setRadio([]); 
    setChecked([]); 
  };

  // All Products show karne ke liye
  useEffect(() => {
    if(!radio.length && !checked.length) handleApplyFilter();
  }, [radio, checked]);

  useEffect(() => {
    if(page===1) getTotal();
    loadMore();
  }, [page]);

  return (
    <Layout title={"ALL Products - Best offers "}>
    <div className="H_dash">  
      <ImageSlider />

      <div className="container-fluid row mt-3 home-page">   
        <div className="col-md-3 filters">
          
          {/* category filter  */}
          <div className="accordion my-3">
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="false" aria-controls="panelsStayOpen-collapseOne">
                  Filter By Category
                </button>
              </h2>
              <div id="panelsStayOpen-collapseOne" className="accordion-collapse collapse">
                <div className="accordion-body d-flex flex-column">
                  {categories?.map((c) => (
                    <Checkbox
                      key={c._id}
                      checked={checked.includes(c._id)}
                      onChange={(e) => handleFilterByCategory(e.target.checked, c._id)}
                      className="filter-option-text"
                    >
                      {c.name}
                    </Checkbox>
                  ))}
                </div>
              </div>
            </div>
          </div>
        
          {/* price filter */}
          <div className="accordion mb-3">
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseTwo" aria-expanded="false" aria-controls="panelsStayOpen-collapseTwo">
                  Filter By Price
                </button>
              </h2>
              <div id="panelsStayOpen-collapseTwo" className="accordion-collapse collapse">
                <div className="accordion-body d-flex flex-column">
                  <Radio.Group value={radio} onChange={(e) => setRadio(e.target.value)}>
                    {Prices?.map((p) => (
                      <div key={p._id}>
                        <Radio value={p.array} className="filter-option-text">{p.name}</Radio>
                      </div>
                    ))}
                  </Radio.Group>
                </div>
              </div>
            </div>
          </div>

          {/* Range filter */}
          <div className="accordion mb-3">
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseThree" aria-expanded="false" aria-controls="panelsStayOpen-collapseThree">
                  Filter By Range
                </button>
              </h2>
              <div id="panelsStayOpen-collapseThree" className="accordion-collapse collapse">
                <div className="accordion-body d-flex flex-column">
                  <PriceRangeSlider range={radio} setRange={setRadio} />
                </div>
              </div>
            </div>
          </div>

          {/* Apply filter */}
          <div className="d-flex flex-column">
            <button
              className="btn apply-button"
              onClick={() => handleApplyFilter()}
            >
              APPLY FILTERS
            </button>
          </div>

          {/* Reset filter */}
          <div className="d-flex flex-column">
            <button
              className="btn reset-button"
              onClick={() => handleReset()}
            >
              RESET FILTERS
            </button>
          </div>

        </div>

        <div className="col-md-9 ">  
          <h1 className="text-center">All Products</h1>
          
          <div className="d-flex flex-wrap allProduct">
            {products?.map((p) => (<ProductCard p={p} />))}
          </div>

          <div className="m-2 p-3">
            {products?.length === 0 && total === 0 && (
              <div className="text-center">No Product Found</div>
            )}
            {products && products.length < total && (
              <>
                <div> Showing {products.length} of {total} products</div>
                <button
                  className="btn loadmore"
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(page + 1);
                  }}
                >
                  {loading ? ("Loading ...") : (<> {" "} Loadmore <AiOutlineReload /> </>)}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
    </Layout>
  );
};

export default HomePage;