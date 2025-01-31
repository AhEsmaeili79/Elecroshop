import map from "../../assets/images/about/map.png";
import BreadCrumb from "../../components/Breadcrumb/BreadCrumb";
import storeImage1 from "../../assets/images/stores/img-1.jpg";
import storeImage2 from "../../assets/images/stores/img-2.jpg";
import contactHeaderBg from "../../assets/images/contact-header-bg.jpg";


const stores = [
  {
    image: storeImage1,
    title: "پاساژ ایران",
    address: "خیابان ولیعصر، تهران، ایران",
    phone: "+۹۸ ۲۱ ۹۸۷-۸۷۶-۶۵۴۳",
    hours: [
      "دوشنبه - شنبه ۱۱:۰۰ تا ۱۹:۰۰",
      "یکشنبه ۱۱:۰۰ تا ۱۸:۰۰"
    ]
  },
  {
    image: storeImage2,
    title: "ایران‌مال",
    address: "خیابان آیت‌الله سعیدی، تهران، ایران",
    phone: "+۹۸ ۲۱ ۹۸۷-۸۷۶-۶۵۴۳",
    hours: [
      "دوشنبه - جمعه ۰۹:۰۰ تا ۲۰:۰۰",
      "شنبه ۰۹:۰۰ تا ۱۴:۰۰",
      "یکشنبه تعطیل"
    ]
  }
];

const contactInfo = [
  {
    title: "دفتر",
    items: [
      { icon: "icon-map-marker", text: "تهران، خیابان ولیعصر، پلاک ۷۰، ایران" },
      { icon: "icon-phone", text: "+۹۸ ۲۱ ۴۲۳ ۵۶۷", link: "tel:#" },
      { icon: "icon-envelope", text: "info@Molla.com", link: "mailto:#" }
    ]
  },
  {
    title: "ساعات کار",
    items: [
      { icon: "icon-clock-o", text: "دوشنبه تا شنبه ۱۱:۰۰ تا ۱۹:۰۰" },
      { icon: "icon-calendar", text: "یکشنبه ۱۱:۰۰ تا ۱۸:۰۰" }
    ]
  }
];

const Body = () => {
  return (
    <main className="main">
      <BreadCrumb />
      
      <div className="container">
        <div className="page-header page-header-big text-center" style={{ backgroundImage: `url(${contactHeaderBg})` }}>
          <h1 className="page-title text-white">تماس با ما<span className="text-white">با ما در ارتباط باشید</span></h1>
        </div>
      </div>

      <div className="page-content pb-0">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 mb-2 mb-lg-0">
              <h2 className="title mb-1">اطلاعات تماس</h2>
              <p className="mb-3">لورم ایپسوم متن ساختگی است که برای پر کردن صفحه نمایش در طراحی‌های وب استفاده می‌شود.</p>
              <div className="row">
                {contactInfo.map((section, index) => (
                  <div key={index} className={`col-sm-${section.title === "دفتر" ? 7 : 5}`}>
                    <div className="contact-info">
                      <h3>{section.title}</h3>
                      <ul className="contact-list">
                        {section.items.map((item, idx) => (
                          <li key={idx}>
                            <i className={item.icon}></i>
                            {item.link ? <a href={item.link}>{item.text}</a> : item.text}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-lg-6">
              <h2 className="title mb-1">سوالی دارید؟</h2>
              <p className="mb-2">از طریق فرم زیر با تیم فروش در ارتباط باشید</p>
              <form action="#" className="contact-form mb-3">
                <div className="row">
                  <div className="col-sm-6">
                    <label htmlFor="cname" className="sr-only">نام</label>
                    <input type="text" className="form-control" id="cname" placeholder="نام *" required />
                  </div>
                  <div className="col-sm-6">
                    <label htmlFor="cemail" className="sr-only">ایمیل</label>
                    <input type="email" className="form-control" id="cemail" placeholder="ایمیل *" required />
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-6">
                    <label htmlFor="cphone" className="sr-only">تلفن</label>
                    <input type="tel" className="form-control" id="cphone" placeholder="تلفن" />
                  </div>
                  <div className="col-sm-6">
                    <label htmlFor="csubject" className="sr-only">موضوع</label>
                    <input type="text" className="form-control" id="csubject" placeholder="موضوع" />
                  </div>
                </div>
                <label htmlFor="cmessage" className="sr-only">پیام</label>
                <textarea className="form-control" cols="30" rows="4" id="cmessage" required placeholder="پیام *"></textarea>
                <button type="submit" className="btn btn-outline-primary-2 btn-minwidth-sm">
                  <span>ارسال</span>
                  <i className="icon-long-arrow-right"></i>
                </button>
              </form>
            </div>
          </div>

          <hr className="mt-4 mb-5" />

          <div className="stores mb-4 mb-lg-5">
            <h2 className="title text-center mb-3">فروشگاه‌های ما</h2>
            <div className="row">
              {stores.map((store, index) => (
                <div key={index} className="col-lg-6">
                  <div className="store">
                    <div className="row">
                      <div className="col-sm-5 col-xl-6">
                        <figure className="store-media mb-2 mb-lg-0">
                          <img src={store.image} alt="image" />
                        </figure>
                      </div>
                      <div className="col-sm-7 col-xl-6">
                        <div className="store-content">
                          <h3 className="store-title">{store.title}</h3>
                          <address>{store.address}</address>
                          <div><a href="tel:#">{store.phone}</a></div>
                          <h4 className="store-subtitle">ساعات کار:</h4>
                          {store.hours.map((hour, idx) => <div key={idx}>{hour}</div>)}
                          <a href="#" className="btn btn-link" target="_blank"><span>نمایش نقشه</span><i className="icon-long-arrow-right"></i></a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="map">
          <img src={map} alt="map"/>
        </div>
      </div>
    </main>
  );
};

export default Body;
