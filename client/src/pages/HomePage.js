import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Checkbox, Radio } from "antd";
import { Prices } from "../components/Prices";
import { useCart } from "../context/cart";
import axios from "axios";
import toast from "react-hot-toast";
import Layout from "./../components/Layout/Layout";
import { AiOutlineReload } from "react-icons/ai";
import "../styles/Homepage.css";
import useCategory from "../hooks/useCategory";
import Slider from "../components/Slider";
import { Link } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useCart();
  const [products, setProducts] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  //get all category
  const categories = useCategory();          //custom hook

  // Reset all filters
  const handleReset = () => {
    setRadio([]); 
    setChecked([]); 
  };
  
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
  
  useEffect(() => {
    getTotal();
    setPage(1);              // Agar Pahle se hi page 1 pe hai toh loadmore() call nhi hoga
    loadMore();              // Isliye 1 times loadmore() call karna padega   
  }, [checked, radio]);

  useEffect(() => {
    loadMore();
  }, [page]);

  return (
    <Layout title={"ALL Products - Best offers "}>
    <div className="H_dash">  
      <Slider />

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
                        <Radio value={p.array}>{p.name}</Radio>
                      </div>
                    ))}
                  </Radio.Group>
                </div>
              </div>
            </div>
          </div>

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
            {products?.map((p) => (
              <div className="card m-2" key={p._id}>
                <Link
                  key={p._id}
                  to={`/product/${p.slug}`}
                  className="product-link"
                >
                  <img
                    src={`/api/v1/product/product-photo/${p._id}`}
                    className="card-img-top"
                    alt={p.name}
                  />
                </Link>

                <div className="card-body">
                  <div className="card-name-price">
                    <h5 className="card-title">{p.name}</h5>
                    <h5 className="card-title card-price">
                      {p.price.toLocaleString("en-US", {
                        style: "currency",
                        currency: "INR",
                      })}
                    </h5>
                  </div>
                  <p className="card-text ">
                    {p.description.substring(0, 60)}...
                  </p>
                  <div className="card-bottom">
                    <button
                      className="btn btn-dark ms-1"
                      onClick={() => {
                        setCart([...cart, p]);
                        localStorage.setItem(
                          "cart",
                          JSON.stringify([...cart, p])
                        );
                        toast.success("Item Added to cart");
                      }}
                    >
                      ADD TO CART
                    </button>
                    <button
                      className="btn btn-info ms-1"
                      onClick={() => navigate(`/product/${p.slug}`)}
                      // disabled={2 > 1}
                    >
                      {/* BUY NOW */}
                      MORE DETAILS
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="m-2 p-3">
            {
              products.length === 0 && total === 0 && (
                <div className="text-center">No Product Found</div>
              )
            }
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
