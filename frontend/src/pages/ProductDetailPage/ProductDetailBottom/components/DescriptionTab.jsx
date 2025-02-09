const DescriptionTab = ({ activeTab, product }) => (
  <div
    className={`tab-pane fade ${activeTab === "description" ? "show active" : ""}`}
    id="description"
  >
    <div className="product-desc-content py-5 px-4">
      <h2 className="text-dark mb-4 display-4 font-weight-bold">{`اطلاعات محصول ${product.name}`}</h2>
      <p className="lead mb-4 text-muted">
        این محصول طراحی شده است تا نه تنها نیازهای شما را برآورده کند بلکه تجربه‌ای خاص و بی‌نظیر در استفاده برای شما فراهم آورد.
        در این بخش ویژگی‌های کلیدی و مزایای این محصول بیان شده است که باعث می‌شود شما به راحتی تصمیم به خرید آن بگیرید.
      </p>

      <div className="row mb-5">
        <div className="col-lg-6">
            <div className="card shadow-sm border-light rounded">
              <div className="card-body">
                <h4 className="p-4 font-weight-bold text-primary">مشخصات محصول</h4>
                <table className="table table-borderless table-hover">
                  <tbody>
                    <tr style={{cursor:'pointer'}}>
                      <th scope="row" className="font-weight-bold">مدل</th>
                      <td>{product.model}</td>
                    </tr>
                    <tr style={{cursor:'pointer'}}>
                      <th scope="row" className="font-weight-bold">فروشنده</th>
                      <td>{product.seller}</td>
                    </tr>
                    <tr style={{cursor:'pointer'}}>
                      <th scope="row" className="font-weight-bold">با شروع قیمت از</th>
                      <td>{product.price} تومان</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        {/* Product Image */}
        <div className="col-lg-6 d-flex justify-content-center align-items-center">
          <img
            src={product.photo3}
            alt={product.name}
            className="img-fluid rounded shadow-lg"
            style={{ maxWidth: "80%", height: "auto", border: "3px solid #f1f1f1" }}
          />
        </div>
      </div>

      {/* Features and Benefits Section */}
      <div className="row mb-5">
        <div className="col-md-6">
          <h4 className="mb-3 font-weight-bold text-success">ویژگی‌های کلیدی</h4>
          <ul className="list-group list-group-flush border-light rounded shadow-sm">
            {[
              "دارای کیفیت بالای ساخت با مواد مقاوم و بادوام",
              "طراحی منحصر به فرد و شیک که جلوه‌ای خاص به محیط می‌بخشد",
              "مناسب برای استفاده در هر موقعیت و فضا، از خانه گرفته تا محیط کاری",
              "آسان برای استفاده و نگهداری",
            ].map((feature, index) => (
              <li className="list-group-item border-0" key={index}>
                <i className="bi bi-check-circle text-success me-2"></i>
                {feature}
              </li>
            ))}
          </ul>
        </div>
        <div className="col-md-6">
          <h4 className="mb-3 font-weight-bold text-info">مزایای استفاده</h4>
          <ul className="list-group list-group-flush border-light rounded shadow-sm">
            {[
              "کاهش زمان و تلاش در انجام وظایف روزانه",
              "افزایش بهره‌وری و راحتی در استفاده طولانی‌مدت",
              "مناسب برای همه گروه‌های سنی و حرفه‌ای",
              "طراحی ارگونومیک برای راحتی بیشتر",
            ].map((benefit, index) => (
              <li className="list-group-item border-0" key={index}>
                <i className="bi bi-check-circle text-info me-2"></i>
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Call to Action */}
      <div className="d-flex justify-content-center mb-4">
        <a
          href="#"
          className="btn btn-lg btn-primary shadow-lg rounded-pill px-5 py-3"
          role="button"
        >
          خرید این محصول
        </a>
      </div>

      {/* Conclusion Section */}
      <div className="mt-5">
        <p className="text-muted">
          با خرید این محصول، شما نه تنها یک کالای با کیفیت به دست خواهید آورد، بلکه به تجربه‌ای جدید و راحت دست خواهید یافت که با هر استفاده از آن، شما را بیشتر راضی خواهد کرد. این محصول برای کسانی که به دنبال بهترین‌ها هستند، ایده‌آل است.
        </p>
      </div>
    </div>
  </div>
);

export default DescriptionTab;
