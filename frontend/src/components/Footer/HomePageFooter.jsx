import FooterWidget from './FooterWidget';
import FooterLinks from './FooterLinks';
import FooterCallToAction from './FooterCallToAction';

import footerLogo from '../../assets/images/logo-footer.png';
import paymentMethods from '../../assets/images/payments.png';
import bgImage from '../../assets/images/demos/demo-4/bg-5.jpg';

const footerLinksData = [
  {
    title: "لینک های مفید",
    links: [
      { label: 'درباره الکتروشاپ', href: '/about-us' },
      { label: 'خدمات ما', href: '#' },
      { label: 'چگونه در الکتروشاپ خرید کنیم', href: '#' },
      { label: 'پرسش‌های متداول', href: '/faq' },
      { label: 'تماس با ما', href: '/contact-us' },
    ]
  },
  {
    title: "خدمات مشتریان",
    links: [
      { label: 'روش‌های پرداخت', href: '#' },
      { label: 'ضمانت بازگشت پول!', href: '#' },
      { label: 'بازگشت کالا', href: '#' },
      { label: 'ارسال', href: '#' },
      { label: 'شرایط و قوانین', href: '#' },
      { label: 'سیاست حریم خصوصی', href: '#' },
    ]
  },
  {
    title: "حساب کاربری من",
    links: [
      { label: 'ورود', href: '/' },
      { label: 'مشاهده سبد خرید', href: '/cart' },
      { label: 'لیست علاقه‌مندی‌های من', href: '/wishlist' },
      { label: 'پیگیری سفارش من', href: '/orders' },
      { label: 'راهنما', href: '#' },
    ]
  }
];


const HomePageFooter = () => {
  return (
    <footer className="footer">
      <FooterCallToAction bgImage={bgImage} />
      
      <div className="footer-middle">
        <div className="container">
          <div className="row">
            <FooterWidget 
              title="درباره" 
              href='/about-us'
              content={<img src={footerLogo} className="footer-logo" alt="لوگوی فوتر" width="105" height="25" />}
              extraContent={
                <div>
                  <p>این یک متن نمونه است. پرسنت دایبوس، دوره‌ای از دوره‌های آموزشی، اینجا و در آینده بیشتر خواهد شد.</p>
                  <div className="widget-call">
                    <i className="icon-phone"></i>
                    سوالی دارید؟ ۲۴ ساعت در طول هفته تماس بگیرید <a href="tel:#">۰۹۱۹۱۲۳۴۵۶</a>
                  </div>
                </div>
              }
            />
            
            {footerLinksData.map((section, index) => (
              <FooterLinks key={index} title={section.title} links={section.links} />
            ))}
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
        <p className="footer-copyright">حق کپی رایت © {new Date().getFullYear()} الکتروشاپ. تمامی حقوق محفوظ است.</p>
          <figure className="footer-payments">
            <img src={paymentMethods} alt="روش‌های پرداخت" width="272" height="20" />
          </figure>
        </div>
      </div>
    </footer>
  );
};

export default HomePageFooter;
