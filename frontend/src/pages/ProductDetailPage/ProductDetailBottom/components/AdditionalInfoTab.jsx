const AdditionalInfoTab = ({ activeTab , product }) => (
  <div className={`tab-pane ${activeTab === "additionalInfo" ? "active" : ""}`}>
    <div className="product-desc">
      <h2 className="mb-5 text-center">اطلاعات اضافی</h2>

      <p className="lead mb-4 text-center">
        این محصول دارای ویژگی‌های اضافی است که شامل موارد زیر می‌شود:
      </p>

      {/* "ویژگی‌های اضافی" Section */}
      <div className="row mb-4 align-items-center">
        <div className="col-md-6">
          <h4 className="section-title">ویژگی‌های اضافی</h4>
          <ul className="list-unstyled">
            <li><i className="fas fa-check-circle me-2 mr-3"></i>جنس صفحه با کیفیت</li>
            <li><i className="fas fa-check-circle me-2 mr-3"></i>دوربین با کیفیت بالا</li>
            <li><i className="fas fa-check-circle me-2 mr-3"></i>صفحه نمایش با وضوح بالا و رنگ‌های دقیق</li>
            <li><i className="fas fa-check-circle me-2 mr-3"></i>طراحی زیبا و ارگونومیک</li>
            <li><i className="fas fa-check-circle me-2 mr-3"></i>حافظه داخلی بالا</li>
            <li><i className="fas fa-check-circle me-2 mr-3"></i>قابلیت شارژ سریع</li>
          </ul>
        </div>
        <div className="col-md-6">
          <img 
            src={product.photo2}
            alt={product.name}
            className="img-fluid rounded"
            style={{ maxWidth: "80%", height: "auto" }}
          />
        </div>
      </div>

      <div className="section">
        <h4 className="section-title">سایز و رنگ</h4>
        <p className="mb-3">
          این محصول در ابعاد 23 سانت موجود است و در رنگ‌های مختلف از جمله مشکی، نقره‌ای و طلایی ارائه می‌شود.
        </p>
      </div>

      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="section">
            <h5 className="section-title">مواد ساخت</h5>
            <ul>
              <li><i className="fas fa-cogs me-2 mr-3"></i>آلومینیوم مقاوم</li>
              <li><i className="fas fa-cogs me-2 mr-3"></i>شیشه ضد خش</li>
              <li><i className="fas fa-cogs me-2 mr-3"></i>پلاستیک فشرده و مقاوم در برابر ضربه</li>
              <li><i className="fas fa-cogs me-2 mr-3"></i>لاستیک ضد لغزش در بخش پایه</li>
            </ul>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="section">
            <h5 className="section-title">ویژگی‌های فنی</h5>
            <ul>
              <li><i className="fas fa-microchip me-2 mr-3"></i>پردازنده سریع و قدرتمند با سرعت 3.0 گیگاهرتز</li>
              <li><i className="fas fa-wifi me-2 mr-3"></i>اتصال بلوتوث 5.0 برای انتقال داده سریع‌تر</li>
              <li><i className="fas fa-wifi me-2 mr-3"></i>پشتیبانی از وای‌فای 6 برای اتصال پایدارتر</li>
              <li><i className="fas fa-battery-full me-2 mr-3"></i>باتری با عمر طولانی و قابلیت شارژ سریع (80٪ در 30 دقیقه)</li>
              <li><i className="fas fa-memory me-2 mr-3"></i>حافظه RAM 8GB و حافظه داخلی 128GB</li>
              <li><i className="fas fa-tv me-2 mr-3"></i>پشتیبانی از فناوری 4K برای تماشای ویدیوها</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="section">
        <h4 className="section-title">راهنمای استفاده</h4>
        <p className="mb-3">
          برای استفاده بهینه از دستگاه، توصیه می‌شود که آن را در محیطی خشک و با دمای متعادل نگه دارید. از قرار دادن آن در معرض آب یا گرمای بیش از حد خودداری کنید.
        </p>
      </div>

      <div className="section">
        <h4 className="section-title">گارانتی</h4>
        <p className="mb-3">
          این محصول با گارانتی 12 ماهه از تاریخ خرید همراه است. در صورت بروز مشکل فنی، می‌توانید به خدمات پس از فروش مراجعه کنید.
        </p>
      </div>

      <div className="section">
        <h4 className="section-title">سازگاری</h4>
        <p className="mb-3">
          این محصول با سیستم‌عامل‌های مختلف شامل ویندوز، macOS، و اندروید سازگار است.
        </p>
      </div>
    </div>
  </div>
);

export default AdditionalInfoTab;
