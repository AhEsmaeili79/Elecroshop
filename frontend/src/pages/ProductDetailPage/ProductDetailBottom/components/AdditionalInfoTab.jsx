const AdditionalInfoTab = ({ activeTab }) => (
  <div className={`tab-pane ${activeTab === "additionalInfo" ? "active" : ""}`}>
    <div className="product-desc-content">
      <h3>اطلاعات اضافی</h3>
      <p>این محصول دارای ویژگی‌های اضافی است که شامل موارد زیر می‌شود:</p>
      <h3>با دوام در نگهداری</h3>
      <ul>
        <li>جنس صفحه با کیفیت</li>
        <li>دوربین خوب</li>
      </ul>
      <h3>سایز</h3>
      <p>در ابعاد 23 سانت </p>
    </div>
  </div>
);

export default AdditionalInfoTab;
