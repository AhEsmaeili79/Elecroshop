"use client";
import React, { useCallback, useRef } from "react";
import shopData from "@/components/Shop/shopData";
import ShopDetailProductCard from "../ShopDetailProductCard";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css/navigation";
import "swiper/css";

const RecentlyViewdItems = () => {
  const sliderRef = useRef(null);

  const handlePrev = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slideNext();
  }, []);

  return (
    <section className="overflow-hidden pt-17.5">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0 pb-15 border-b border-gray-3">
        {/* <!-- section title --> */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <span className="flex items-center gap-2.5 font-medium text-dark dark:text-text-primary-dark mb-1.5">
              <Image
                src="/images/icons/icon-05.svg"
                width={17}
                height={17}
                alt="icon"
              />
              Categories
            </span>
            <h2 className="font-semibold text-xl xl:text-heading-5 text-dark dark:text-text-primary-dark">
              Browse by Category
            </h2>
          </div>

          {/* Navigation buttons - Desktop only */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={handlePrev}
              className="swiper-button-prev flex items-center justify-center w-10 h-10 rounded-lg bg-white dark:bg-bg-cardDark border border-gray-3 dark:border-border-dark text-dark dark:text-text-primary-dark transition-all duration-200 hover:bg-blue dark:hover:bg-blue hover:text-white dark:hover:text-white hover:border-blue dark:hover:border-blue active:scale-95 shadow-sm"
              aria-label="Previous slide"
            >
              <svg
                className="fill-current w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M15.4881 4.43057C15.8026 4.70014 15.839 5.17361 15.5694 5.48811L9.98781 12L15.5694 18.5119C15.839 18.8264 15.8026 19.2999 15.4881 19.5695C15.1736 19.839 14.7001 19.8026 14.4306 19.4881L8.43056 12.4881C8.18981 12.2072 8.18981 11.7928 8.43056 11.5119L14.4306 4.51192C14.7001 4.19743 15.1736 4.161 15.4881 4.43057Z"
                  fill="currentColor"
                />
              </svg>
            </button>

            <button
              onClick={handleNext}
              className="swiper-button-next flex items-center justify-center w-10 h-10 rounded-lg bg-white dark:bg-bg-cardDark border border-gray-3 dark:border-border-dark text-dark dark:text-text-primary-dark transition-all duration-200 hover:bg-blue dark:hover:bg-blue hover:text-white dark:hover:text-white hover:border-blue dark:hover:border-blue active:scale-95 shadow-sm"
              aria-label="Next slide"
            >
              <svg
                className="fill-current w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M8.51192 4.43057C8.82641 4.161 9.29989 4.19743 9.56946 4.51192L15.5695 11.5119C15.8102 11.7928 15.8102 12.2072 15.5695 12.4881L9.56946 19.4881C9.29989 19.8026 8.82641 19.839 8.51192 19.5695C8.19743 19.2999 8.161 18.8264 8.43057 18.5119L14.0122 12L8.43057 5.48811C8.161 5.17361 8.19743 4.70014 8.51192 4.43057Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Grid - Show on mobile and tablet */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 lg:hidden mb-8">
          {shopData.map((item, key) => (
            <ShopDetailProductCard key={key} item={item} />
          ))}
        </div>

        {/* Desktop Carousel - Show on desktop */}
        <div className="hidden lg:block mb-8">
          <Swiper
            ref={sliderRef}
            modules={[Navigation]}
            slidesPerView={4}
            spaceBetween={20}
            className="!pb-0 [&_.swiper-wrapper]:py-[10px] [&_.swiper-wrapper]:items-stretch"
            breakpoints={{
              1024: {
                slidesPerView: 3,
                spaceBetween: 20,
              },
              1280: {
                slidesPerView: 4,
                spaceBetween: 20,
              },
            }}
          >
            {shopData.map((item, key) => (
              <SwiperSlide key={key} className="!h-auto !flex">
                <div className="w-full h-full flex flex-col mb-[5px]">
                  <ShopDetailProductCard item={item} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default RecentlyViewdItems;
