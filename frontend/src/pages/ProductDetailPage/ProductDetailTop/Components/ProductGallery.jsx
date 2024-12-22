import React from "react";

const ProductGallery = ({ activeImage, images, handleImageSwitch }) => (
  <div className="product-gallery product-gallery-vertical">
    <div className="row">
      <figure className="product-main-image">
        <img id="product-zoom" src={activeImage} alt="محصول" />
      </figure>
      <div id="product-zoom-gallery" className="product-image-gallery">
        {images
          .filter(Boolean)
          .map((photo, index) => (
            <a
              className={`product-gallery-item ${activeImage === photo ? "active" : ""}`}
              href="#"
              key={index}
              onClick={(e) => {
                e.preventDefault();
                handleImageSwitch(photo);
              }}
            >
              <img src={photo} alt={`تصویر کوچک محصول ${index + 1}`} />
            </a>
          ))}
      </div>
    </div>
  </div>
);

export default ProductGallery;
