// src/components/Main.js
import Slider from "../../components/Slider/Slider";
import Offer1 from "../../components/Offer/offer1";
import Categories from "../../components/Categories/Categories";
import NewArrivals from "../../components/NewArrivel/NewArrivals";
import Offer2 from "../../components/Offer/offer2";
import DealsOutlet from "../../components/Offer/offer3";
import BrandCarousel from "../../components/Brand/brands";
import TrendingProducts from "../../components/Trending/Trending";
import Recommendation from "../../components/Recommendation/Recommend";
import IconBoxesContainer from "../../components/Terms/IconBoxesContainer";
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
