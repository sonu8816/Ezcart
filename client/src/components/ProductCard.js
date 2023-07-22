import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/cart';
import { toast } from 'react-hot-toast';
import '../styles/ProductCardStyle.css';

const ProductCard = ({p}) => {
    const navigate = useNavigate();
    const [cart, setCart] = useCart();
    
    return (
        <div className="card card-component m-2" key={p._id}>
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
            </Link >
            <div className="card-body">
              <div className="card-name-price">
                <h5 className="card-title">{p.name}</h5>
                <h5 className="card-title card-price">₹{p.price}</h5>
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
    )
}

export default ProductCard
