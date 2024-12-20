// src/components/Main.js
import Slider from "./Body/Slider";
import Offer1 from "./offers/offer1";
import Categories from "./Body/Categories";
import NewArrivals from "./new-arrivals/NewArrivals";
import Offer2 from "./offers/offer2";
import DealsOutlet from "./offers/offer3";
import BrandCarousel from "./Body/brands";
import TrendingProducts from "./Body/Trending/Trending";
import Recommendation from "./Body/Recommendation/Recommend";
import IconBoxesContainer from "./Body/Terms/IconBoxesContainer";
import './css/body.css'

const Main = () => {
    return (
        <>
            <main className="main">
                <Slider />
                <Categories/>
                <Offer1/>
                <NewArrivals />
                <Offer2/>
                <DealsOutlet/>
                <BrandCarousel/>
                <TrendingProducts/>
                <Recommendation/>
                <IconBoxesContainer/>
            </main>
        </>
    );
};

export default Main;
