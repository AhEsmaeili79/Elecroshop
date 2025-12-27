import React from "react";
import Image from "next/image";

const PromoBanner = () => {
  return (
    <section className="overflow-hidden py-20 bg-black">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        {/* <!-- promo banner big --> */}
        <div className="relative z-1 overflow-hidden rounded-lg bg-gradient-to-br from-gray-1 via-white to-gray-2 dark:from-bg-cardDark dark:via-bg-cardDark dark:to-bg-hoverDark border border-gray-3 dark:border-border-dark shadow-2 dark:shadow-dark-2 py-12.5 lg:py-17.5 xl:py-22.5 px-4 sm:px-7.5 lg:px-14 xl:px-19 mb-7.5 transition-all hover:shadow-3 dark:hover:shadow-dark-3">
          <div className="max-w-[550px] w-full">
            <span className="block font-medium text-xl text-dark dark:text-text-primary-dark mb-3">
              Apple iPhone 14 Plus
            </span>

            <h2 className="font-bold text-xl lg:text-heading-4 xl:text-heading-3 text-dark dark:text-text-primary-dark mb-5">
              UP TO 30% OFF
            </h2>

            <p className="text-body dark:text-text-secondary-dark">
              iPhone 14 has the same superspeedy chip that's in iPhone 13 Pro,
              A15 Bionic, with a 5‑core GPU, powers all the latest features.
            </p>

            <a
              href="#"
              className="inline-flex font-medium text-custom-sm text-white bg-blue dark:bg-cta py-[11px] px-9.5 rounded-md ease-out duration-200 hover:bg-blue-dark dark:hover:bg-cta-hover mt-7.5 shadow-lg hover:shadow-xl transition-all"
            >
              Buy Now
            </a>
          </div>

          <Image
            src="/images/promo/promo-01.png"
            alt="promo img"
            className="absolute bottom-0 right-4 lg:right-26 -z-1 opacity-90 dark:opacity-80"
            width={274}
            height={350}
          />
        </div>

        <div className="grid gap-7.5 grid-cols-1 lg:grid-cols-2">
          {/* <!-- promo banner small - Treadmill --> */}
          <div className="relative z-1 overflow-hidden rounded-lg bg-gradient-to-br from-[#E0F5F3] via-[#D4F0ED] to-[#C8EBE7] dark:from-[#0F1F1D] dark:via-[#0D2522] dark:to-[#0B2A27] border border-gray-3 dark:border-[#1A3A36] shadow-2 dark:shadow-dark-2 py-10 xl:py-16 px-4 sm:px-7.5 xl:px-10 transition-all hover:shadow-3 dark:hover:shadow-dark-3 hover:scale-[1.01] group">
            <div className="absolute inset-0 bg-gradient-to-br from-teal/10 to-transparent dark:from-teal/20 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Image
              src="/images/promo/promo-02.png"
              alt="promo img"
              className="absolute top-1/2 -translate-y-1/2 left-3 sm:left-10 -z-1 opacity-90 dark:opacity-70"
              width={241}
              height={241}
            />

            <div className="text-right relative z-1">
              <span className="block text-lg text-dark dark:text-text-primary-dark mb-1.5 font-medium">
                Foldable Motorised Treadmill
              </span>

              <h2 className="font-bold text-xl lg:text-heading-4 text-dark dark:text-text-primary-dark mb-2.5">
                Workout At Home
              </h2>

              <p className="font-semibold text-custom-1 text-teal dark:text-teal-light mb-4">
                Flat 20% off
              </p>

              <a
                href="#"
                className="inline-flex font-medium text-custom-sm text-white bg-teal dark:bg-teal-light py-2.5 px-8.5 rounded-md ease-out duration-200 hover:bg-teal-dark dark:hover:bg-teal shadow-lg hover:shadow-xl transition-all"
              >
                Grab Now
              </a>
            </div>
          </div>

          {/* <!-- promo banner small - Apple Watch --> */}
          <div className="relative z-1 overflow-hidden rounded-lg bg-gradient-to-br from-[#FFF4ED] via-[#FFE8DB] to-[#FFDCC9] dark:from-[#1F1814] dark:via-[#251E19] dark:to-[#2B241E] border border-gray-3 dark:border-[#3A2F26] shadow-2 dark:shadow-dark-2 py-10 xl:py-16 px-4 sm:px-7.5 xl:px-10 transition-all hover:shadow-3 dark:hover:shadow-dark-3 hover:scale-[1.01] group">
            <div className="absolute inset-0 bg-gradient-to-br from-orange/10 to-transparent dark:from-orange/20 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Image
              src="/images/promo/promo-03.png"
              alt="promo img"
              className="absolute top-1/2 -translate-y-1/2 right-3 sm:right-8.5 -z-1 opacity-90 dark:opacity-70"
              width={200}
              height={200}
            />

            <div className="relative z-1">
              <span className="block text-lg text-dark dark:text-text-primary-dark mb-1.5 font-medium">
                Apple Watch Ultra
              </span>

              <h2 className="font-bold text-xl lg:text-heading-4 text-dark dark:text-text-primary-dark mb-2.5">
                Up to <span className="text-orange dark:text-orange-light">40%</span> off
              </h2>

              <p className="max-w-[285px] text-custom-sm text-body dark:text-text-secondary-dark mb-4">
                The aerospace-grade titanium case strikes the perfect balance of
                everything.
              </p>

              <a
                href="#"
                className="inline-flex font-medium text-custom-sm text-white bg-orange dark:bg-orange-light py-2.5 px-8.5 rounded-md ease-out duration-200 hover:bg-orange-dark dark:hover:bg-orange shadow-lg hover:shadow-xl transition-all"
              >
                Buy Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
