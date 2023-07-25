import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import axios from "axios";
import { useCart } from "../context/cart";
import { useParams } from "react-router-dom";
import "../styles/ProductDetailsStyles.css";
import toast from "react-hot-toast";
import ProductCard from "../components/ProductCard";
import { Select } from "antd";
const { Option } = Select;

const ProductDetails = () => {
  const params = useParams();
  const [cart, setCart] = useCart();
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);

  //inital product details
  useEffect(() => {
    if (params?.slug) getProduct();
  }, [params?.slug]);

  //getProduct
  const getProduct = async () => {
    try {
      const { data } = await axios.get(`/api/v1/product/get-product/${params.slug}`);
      setProduct(data?.product);
      getSimilarProduct(data?.product._id, data?.product.category._id);
    } catch (error) {
      console.log(error);
    }
  };

  //add product to cart
  const handleAddCart = () => {
    const existingItem = cart.find(item => item.product._id === product._id);
  
    if (existingItem) {
      const updatedCart = cart.map((item) =>{
        if(item.product._id === product._id) {
          if(item.count + quantity <= 10) {
            toast.success(`${product.name} added to cart`);
            return {...item, count: item.count + quantity}
          }
          else {
            toast.error("Maximum 10 items can be added to cart");
            return {...item, count: 10}
          }
         } else {
          return item ;
         }
      });
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    } else {
      const newItem = { product : product, count: quantity };
      const updatedCart = [...cart, newItem];
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      toast.success(`${product.name} added to cart`);
    }
  };

  //get similar product
  const getSimilarProduct = async (pid, cid) => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/related-product/${pid}/${cid}`
      );
      setRelatedProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <div className="product-details">
      <div className="row container">
        <div className="col-md-6">
          <img
            src={`/api/v1/product/product-photo/${product?._id}`}
            className="card-img-top"
            alt={product?.name}
            height="300"
            width={"300px"} 
          />
        </div>
        <div className="col-md-6 product-details-info">
          <h1 className="text-center">Product Details</h1>
          <hr />
          <h6>Name : {product?.name}</h6>
          <h6>Description : {product?.description}</h6>
          <h6>
            Price :
            {product?.price?.toLocaleString("en-US", {
              style: "currency",
              currency: "INR",
            })}
          </h6>
          <h6>Category : {product?.category?.name}</h6>
          <h6>Shipping : {product?.shipping ? "Yes" : "No"}</h6>
          <div className="product-detail-bottom">
            <Select
              className="select-quantity"
              onChange={(value) => setQuantity(value)}
              defaultValue={1}
            >
              {[...Array(10)].map((_,i) => (
                <Option key={i+1} value={i+1}>
                  {i+1}
                </Option>
              ))}
            </Select>
            <button className="btn btn-dark ms-1" onClick={handleAddCart}>
              ADD TO CART
            </button>
          </div>
        </div>
      </div>
      </div>

      <hr />

      <div className="similar-products">
        <div>
          <h4>Similar Products ➡️</h4>
          {relatedProducts.length < 1 && (
            <p className="text-center">No Similar Products found</p>
          )}
          <div className="similar-product-container">
            {relatedProducts?.map((p) => (<ProductCard p={p} />))}
          </div>
        </div>
      </div>

    </Layout>
  );
};

export default ProductDetails;