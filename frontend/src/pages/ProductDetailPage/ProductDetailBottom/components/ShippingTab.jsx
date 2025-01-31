const ShippingTab = ({ activeTab }) => (
  <div className={`tab-pane ${activeTab === "shipping" ? "active" : ""}`}>
    <div className="product-desc-content">
      <h3>حمل و نقل و بازگشت کالا</h3>
      <p>محصولات ما در سریع‌ترین زمان ممکن ارسال می‌شوند و شما می‌توانید با خیال راحت از خدمات ما استفاده کنید.</p>
      <h4>ارسال</h4>
      <p>ارسال از طریق پست و خدمات مختلف حمل و نقل انجام می‌شود.</p>
      <h4>بازگشت کالا</h4>
      <p>در صورت عدم رضایت از خرید، می‌توانید کالا را در مدت زمان مشخصی بازگردانید.</p>
    </div>
  </div>
);

export default ShippingTab;
