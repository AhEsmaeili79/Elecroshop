import BreadCrumb from "../../components/Breadcrumb/BreadCrumb";
import aboutHeaderBg from "../../assets/images/about-header-bg.jpg";
import aboutImg1 from "../../assets/images/about/img-1.jpg";
import aboutImg2 from "../../assets/images/about/img-2.jpg";
import member1 from "../../assets/images/team/member-1.jpg";
import member2 from "../../assets/images/team/member-2.jpg";
import member3 from "../../assets/images/team/member-3.jpg";
import testimonial1 from "../../assets/images/testimonials/user-1.jpg";
import testimonial2 from "../../assets/images/testimonials/user-2.jpg";
import brand1 from "../../assets/images/brands/1.png";
import brand2 from "../../assets/images/brands/2.png";
import brand3 from "../../assets/images/brands/3.png";
import brand4 from "../../assets/images/brands/4.png";
import brand5 from "../../assets/images/brands/5.png";
import brand6 from "../../assets/images/brands/6.png";
import brand7 from "../../assets/images/brands/7.png";
import brand8 from "../../assets/images/brands/8.png";
import brand9 from "../../assets/images/brands/9.png";

const teamMembers = [
  {
    img: member1,
    name: "امیرحسین اسماعیلی",
    title: "بنیان‌گذار و مدیرعامل",
    description: "امیرحسین اسماعیلی با بیش از 10 سال تجربه در صنعت فناوری، Electroshop را با هدف ارائه بهترین تجربه خرید لوازم الکترونیکی راه‌اندازی کرده است.",
  },
  {
    img: member2,
    name: "علی شفیعی",
    title: "مدیر فروش و بازاریابی",
    description: "علی شفیعی مسئول مدیریت فروش و استراتژی‌های بازاریابی Electroshop است و همیشه در تلاش است تا تجربه خرید آنلاین بهتری را برای مشتریان فراهم کند.",
  },
  {
    img: member3,
    name: "اکبر اصغری",
    title: "مدیر محصولات",
    description: "اکبر اصغری مسئول مدیریت و نظارت بر محصولات الکترونیکی در Electroshop است. او به انتخاب و معرفی بهترین محصولات به مشتریان توجه ویژه‌ای دارد.",
  },
];

const brands = [brand1, brand2, brand3, brand4, brand5, brand6, brand7, brand8, brand9];

const testimonials = [
  {
    img: testimonial1,
    text: "خرید از Electroshop تجربه‌ای بی‌نظیر بود. لوازم با کیفیت و ارسال سریع باعث شد که من همیشه از این سایت خرید کنم.",
    name: "رضا نیازی",
    role: "مشتری",
  },
  {
    img: testimonial2,
    text: "همیشه محصولات مورد نظر را در Electroshop پیدا می‌کنم و قیمت‌ها هم خیلی مناسب است. توصیه می‌کنم خرید از این فروشگاه را امتحان کنید.",
    name: "اکبر رضایی",
    role: "مشتری",
  },
];

const Body = () => {
  return (
    <main className="main">
      <BreadCrumb />

      <div className="container">
        <div className="page-header page-header-big text-center" style={{ backgroundImage: `url('${aboutHeaderBg}')` }}>
          <h1 className="page-title text-white">درباره ما<span className="text-white">ما کی هستیم</span></h1>
        </div>
      </div>

      <div className="page-content pb-0">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 mb-3 mb-lg-0">
              <h2 className="title">چشم‌انداز ما</h2>
              <p>هدف ما ارائه بهترین خدمات و محصولات الکترونیکی به مشتریان است تا زندگی روزمره راحت‌تر و هوشمندتر شود. ما به دنبال نوآوری و پیشرفت در دنیای فناوری هستیم و همیشه به دنبال بهترین‌ها برای شما هستیم.</p>
            </div>

            <div className="col-lg-6">
              <h2 className="title">ماموریت ما</h2>
              <p>ما در Electroshop می‌خواهیم برای مشتریان خود تجربه‌ای بی‌نظیر از خرید آنلاین فراهم کنیم. با ارائه جدیدترین و باکیفیت‌ترین لپ‌تاپ‌ها، موبایل‌ها و دیگر دستگاه‌های هوشمند، تلاش می‌کنیم تا نیازهای روزمره شما را با تکنولوژی‌های پیشرفته برآورده کنیم.</p>
            </div>
          </div>
        </div>

        <div className="bg-light-2 pt-6 pb-5 mb-6 mb-lg-8">
          <div className="container">
            <div className="row">
              <div className="col-lg-5 mb-3 mb-lg-0">
                <h2 className="title">ما کی هستیم</h2>
                <p className="lead text-primary mb-3">ما تیمی هستیم که با شور و اشتیاق در زمینه فناوری و فروش محصولات الکترونیکی کار می‌کنیم. هدف ما راحتی خرید و ارائه بهترین تجربه برای مشتریان است.</p>
                <p className="mb-2">ما به شما این اطمینان را می‌دهیم که از خرید محصولات با کیفیت و خدمات عالی بهره‌مند خواهید شد. Electroshop یک مقصد کامل برای خرید لوازم الکترونیکی است که نیازهای شما را در اولویت قرار می‌دهد.</p>
                <a href="blog.html" className="btn btn-sm btn-minwidth btn-outline-primary-2">
                  <span>مشاهده اخبار ما</span>
                  <i className="icon-long-arrow-right"></i>
                </a>
              </div>

              <div className="col-lg-6 offset-lg-1">
                <div className="about-images">
                  <img src={aboutImg1} alt="" className="about-img-front" />
                  <img src={aboutImg2} alt="" className="about-img-back" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row">
            <div className="col-lg-5">
              <div className="brands-text">
                <h2 className="title">برندهای طراحی برتر جهان در یک مقصد.</h2>
                <p>در Electroshop شما به مجموعه‌ای از بهترین برندهای جهان دسترسی خواهید داشت. این برندها در صنعت الکترونیک برتر شناخته شده‌اند و ما آن‌ها را برای شما جمع کرده‌ایم.</p>
              </div>
            </div>
            <div className="col-lg-7">
              <div className="brands-display">
                <div className="row justify-content-center">
                  {brands.map((brand, index) => (
                    <div key={index} className="col-6 col-sm-4">
                      <a href="#" className="brand">
                        <img src={brand} alt="Brand Name" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <hr className="mt-4 mb-6" />

          <h2 className="title text-center mb-4">آشنایی با تیم ما</h2>

          <div className="row">
            {teamMembers.map((member, index) => (
              <div key={index} className="col-md-4">
                <div className="member member-anim text-center">
                  <figure className="member-media">
                    <img src={member.img} alt="member photo" />
                    <figcaption className="member-overlay">
                      <div className="member-overlay-content">
                        <h3 className="member-title">{member.name}<span>{member.title}</span></h3>
                        <p className="text-light">{member.description}</p>
                        <div className="social-icons social-icons-simple">
                          <a href="#" className="social-icon" title="Facebook" target="_blank"><i className="icon-facebook-f"></i></a>
                          <a href="#" className="social-icon" title="Twitter" target="_blank"><i className="icon-twitter"></i></a>
                          <a href="#" className="social-icon" title="Instagram" target="_blank"><i className="icon-instagram"></i></a>
                        </div>
                      </div>
                    </figcaption>
                  </figure>
                  <div className="member-content">
                    <h3 className="member-title">{member.name}<span>{member.title}</span></h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="about-testimonials bg-light-2 pt-6 pb-6">
          <div className="container">
            <h2 className="title text-center mb-3">نظرات مشتریان در مورد ما</h2>

            <div className="owl-carousel owl-simple owl-testimonials-photo" data-toggle="owl"
              data-owl-options='{"nav": false, "dots": true, "margin": 20, "loop": false, "responsive": {"1200": {"nav": true}}}'>
              {testimonials.map((testimonial, index) => (
                <blockquote key={index} className="testimonial text-center">
                  <img src={testimonial.img} alt="user" />
                  <p>“ {testimonial.text} ”</p>
                  <cite>
                    {testimonial.name}
                    <span>{testimonial.role}</span>
                  </cite>
                </blockquote>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Body;
