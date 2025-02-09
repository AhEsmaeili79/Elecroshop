import { FaTruck, FaUndoAlt } from 'react-icons/fa';

const ShippingTab = ({ activeTab }) => (
  <div className={`tab-pane ${activeTab === "shipping" ? "active" : ""}`}>
    <div className="product-desc-content">
      <h2 className="mb-4">حمل و نقل و بازگشت کالا</h2>
      <p className="mb-4">محصولات ما در سریع‌ترین زمان ممکن ارسال می‌شوند و شما می‌توانید با خیال راحت از خدمات ما استفاده کنید.</p>

      <div className="mb-5">
        <h4 className="d-flex align-items-center mb-3">
          <FaTruck className="me-3 mr-2" /> 
          ارسال
        </h4>
        <p className="mb-4">ارسال از طریق پست و خدمات مختلف حمل و نقل انجام می‌شود. ما به شما اطمینان می‌دهیم که محصول در کمترین زمان ممکن به دست شما برسد.</p>
      </div>

      <div>
        <h4 className="d-flex align-items-center mb-3">
          <FaUndoAlt className="me-3 mr-2" /> 
          بازگشت کالا
        </h4>
        <p>در صورت عدم رضایت از خرید، می‌توانید کالا را در مدت زمان مشخصی بازگردانید. برای راحتی شما، فرآیند بازگشت کالا بسیار آسان است.</p>
      </div>
    </div>
  </div>
);

export default ShippingTab;
