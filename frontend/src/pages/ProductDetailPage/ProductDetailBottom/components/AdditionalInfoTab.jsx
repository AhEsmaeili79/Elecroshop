const AdditionalInfoTab = ({ activeTab, product }) => (
  <div className={`tab-pane ${activeTab === "additionalInfo" ? "active" : ""}`}>
    <div className="product-desc-content">
      <h2 className="mb-4">اطلاعات اضافی</h2>

      <p className="mb-3">این محصول دارای ویژگی‌های اضافی است که شامل موارد زیر می‌شود:</p>

      <h4 className="mt-4">ویژگی‌های اضافی</h4>
      <ul className="list-unstyled">
        <li><i className="fas fa-check-circle"></i> جنس صفحه با کیفیت</li>
        <li><i className="fas fa-check-circle"></i> دوربین با کیفیت بالا</li>
      </ul>

      <h4 className="mt-4">سایز</h4>
      <p className="mb-3">در ابعاد 23 سانت</p>

      <div className="row">
        <div className="col-md-6 mb-3">
          <h5 className="font-weight-bold">مواد ساخت:</h5>
          <ul>
            <li>آلومینیوم مقاوم</li>
            <li>شیشه ضد خش</li>
          </ul>
        </div>
        
        <div className="col-md-6 mb-3">
          <h5 className="font-weight-bold">ویژگی‌های فنی:</h5>
          <ul>
            <li>پردازنده سریع</li>
            <li>اتصال بلوتوث 5.0</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

export default AdditionalInfoTab;
