const FooterLinks = ({ title, links }) => (
  <div className="col-sm-6 col-lg-3">
    <div className="widget">
      <h4 className="widget-title">{title}</h4>
      <ul className="widget-list">
        {links.map((link, index) => (
          <li key={index}>
            <a href={link.href}>{link.label}</a>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export default FooterLinks;
