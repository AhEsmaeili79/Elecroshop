const FooterWidget = ({ title, content, extraContent }) => (
  <div className="col-sm-6 col-lg-3">
    <div className="widget widget-about">
      <h4 className="widget-title">{title}</h4>
      {content}
      {extraContent}
    </div>
  </div>
);

export default FooterWidget;
