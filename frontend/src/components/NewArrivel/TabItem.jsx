const TabItem = ({ id, label, isActive, onClick }) => (
  <li className="nav-item">
    <a
      className={`nav-link ${isActive ? 'active' : ''}`}
      id={`${id}-link`}
      data-toggle="tab"
      href={`#${id}-tab`}
      role="tab"
      aria-controls={`${id}-tab`}
      aria-selected={isActive}
      onClick={onClick} 
    >
      {label}
    </a>
  </li>
);

export default TabItem;
