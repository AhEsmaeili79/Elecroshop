import FooterWidget from './FooterWidget';
import FooterLinks from './FooterLinks';

import footerLogo from '../../assets/images/logo-footer.png';
import paymentMethods from '../../assets/images/payments.png';

const footerLinksData = [
  {
    title: "لینک های مفید",
    links: [
      { label: 'درباره مولا', href: 'about.html' },
      { label: 'خدمات ما', href: '#' },
      { label: 'چگونه در مولا خرید کنیم', href: '#' },
      { label: 'پرسش‌های متداول', href: 'faq.html' },
      { label: 'تماس با ما', href: 'contact.html' },
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
      { label: 'ورود', href: '#' },
      { label: 'مشاهده سبد خرید', href: 'cart.html' },
      { label: 'لیست علاقه‌مندی‌های من', href: '#' },
      { label: 'پیگیری سفارش من', href: '#' },
      { label: 'راهنما', href: '#' },
    ]
  }
];

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-middle">
        <div className="container">
          <div className="row">
            <FooterWidget 
              title="درباره" 
              content={<img src={footerLogo} className="footer-logo" alt="لوگوی فوتر" width="105" height="25" />}
              extraContent={
                <div>
                  <p>این متن به عنوان نمونه برای فوتر قرار داده شده است. اطلاعات بیشتر را در سایت ما پیدا کنید.</p>
                  <div className="widget-call">
                    <i className="icon-phone"></i>
                    سوالی دارید؟ با ما تماس بگیرید 24/7 <a href="tel:#">+0123 456 789</a>
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
          <p className="footer-copyright">حق کپی رایت © ۲۰۱۹ فروشگاه مولا. تمامی حقوق محفوظ است.</p>
          <figure className="footer-payments">
            <img src={paymentMethods} alt="روش‌های پرداخت" width="272" height="20" />
          </figure>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
