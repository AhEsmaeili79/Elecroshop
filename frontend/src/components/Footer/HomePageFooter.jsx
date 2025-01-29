import FooterWidget from './FooterWidget';
import FooterLinks from './FooterLinks';
import FooterCallToAction from './FooterCallToAction';

import footerLogo from '../../assets/images/logo-footer.png';
import paymentMethods from '../../assets/images/payments.png';
import bgImage from '../../assets/images/demos/demo-4/bg-5.jpg';

const footerLinksData = [
  {
    title: "لینک‌های مفید",
    links: [
      { label: 'درباره موللا', href: 'about.html' },
      { label: 'خدمات ما', href: '#' },
      { label: 'چگونه در موللا خرید کنیم', href: '#' },
      { label: 'سوالات متداول', href: 'faq.html' },
      { label: 'تماس با ما', href: 'contact.html' },
    ]
  },
  {
    title: "خدمات مشتریان",
    links: [
      { label: 'روش‌های پرداخت', href: '#' },
      { label: 'ضمانت بازگشت وجه!', href: '#' },
      { label: 'بازگشت کالا', href: '#' },
      { label: 'حمل و نقل', href: '#' },
      { label: 'شرایط و ضوابط', href: '#' },
      { label: 'سیاست حفظ حریم خصوصی', href: '#' },
    ]
  },
  {
    title: "حساب کاربری من",
    links: [
      { label: 'ورود', href: '#' },
      { label: 'مشاهده سبد خرید', href: 'cart.html' },
      { label: 'لیست علاقه‌مندی‌ها', href: '#' },
      { label: 'پیگیری سفارش من', href: '#' },
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
              content={<img src={footerLogo} className="footer-logo" alt="لوگوی فوتر" width="105" height="25" />}
              extraContent={
                <div>
                  <p>این یک متن نمونه است. پرسنت دایبوس، دوره‌ای از دوره‌های آموزشی، اینجا و در آینده بیشتر خواهد شد.</p>
                  <div className="widget-call">
                    <i className="icon-phone"></i>
                    سوالی دارید؟ 24/7 تماس بگیرید <a href="tel:#">+0123 456 789</a>
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
          <p className="footer-copyright">حق نشر © 2019 فروشگاه موللا. کلیه حقوق محفوظ است.</p>
          <figure className="footer-payments">
            <img src={paymentMethods} alt="روش‌های پرداخت" width="272" height="20" />
          </figure>
        </div>
      </div>
    </footer>
  );
};

export default HomePageFooter;
