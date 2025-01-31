const DescriptionTab = ({ activeTab }) => (
  <div className={`tab-pane ${activeTab === "description" ? "active" : ""}`}>
    <div className="product-desc-content">
      <h3>اطلاعات محصول</h3>
      <p>این محصول شامل ویژگی‌های خاصی است که در ادامه به آنها پرداخته می‌شود:</p>
      <ul>
        <li>دارای کیفیت بالای ساخت</li>
        <li>طراحی منحصر به فرد </li>
        <li>مناسب برای استفاده در هر موقعیت</li>
      </ul>
    </div>
  </div>
);

export default DescriptionTab;
