import LeftSide from "./Leftside";
import RightSide from "./Rightside";

const HeaderMid = ({isLoggedIn, handleLogout ,username,toggleModal}) => {
  return (
    <>
      <div className="header-middle sticky-header">
        <div className="container">
          <LeftSide username={username} isLoggedIn={isLoggedIn} handleLogout={handleLogout} toggleModal={toggleModal}/>
          <RightSide />
        </div>
      </div>
    </>
  );
};

export default HeaderMid;
