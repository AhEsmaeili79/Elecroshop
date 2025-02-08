const IconBox = ({ icon, title, description }) => (
  <div className="col-sm-6 col-lg-3">
      <div className="icon-box icon-box-side">
        <span className="icon-box-icon text-dark">
          <i className={`icon-${icon}`}></i>
        </span>
        <div className="icon-box-content">
          <h3 className="icon-box-title">{title}</h3>
          <p>{description}</p>
        </div>
      </div>
    </div>
  );
  
  export default IconBox;
  