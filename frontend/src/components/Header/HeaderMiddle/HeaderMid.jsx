import LeftSide from "./Leftside";
import RightSide from "./Rightside";

const HeaderMid = () => {
  return (
    <>
      <div className="header-middle sticky-header">
        <div className="container">
          <LeftSide />
          <RightSide />
        </div>
      </div>
    </>
  );
};

export default HeaderMid;
