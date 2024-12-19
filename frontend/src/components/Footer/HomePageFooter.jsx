import FooterWidget from './FooterWidget';
import FooterLinks from './FooterLinks';
import FooterCallToAction from './FooterCallToAction';

import footerLogo from '../../assets/images/demos/demo-4/logo-footer.png';
import paymentMethods from '../../assets/images/payments.png';
import bgImage from '../../assets/images/demos/demo-4/bg-5.jpg';

const footerLinksData = [
  {
    title: "Useful Links",
    links: [
      { label: 'About Molla', href: 'about.html' },
      { label: 'Our Services', href: '#' },
      { label: 'How to shop on Molla', href: '#' },
      { label: 'FAQ', href: 'faq.html' },
      { label: 'Contact us', href: 'contact.html' },
    ]
  },
  {
    title: "Customer Service",
    links: [
      { label: 'Payment Methods', href: '#' },
      { label: 'Money-back guarantee!', href: '#' },
      { label: 'Returns', href: '#' },
      { label: 'Shipping', href: '#' },
      { label: 'Terms and conditions', href: '#' },
      { label: 'Privacy Policy', href: '#' },
    ]
  },
  {
    title: "My Account",
    links: [
      { label: 'Sign In', href: '#' },
      { label: 'View Cart', href: 'cart.html' },
      { label: 'My Wishlist', href: '#' },
      { label: 'Track My Order', href: '#' },
      { label: 'Help', href: '#' },
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
              title="About" 
              content={<img src={footerLogo} className="footer-logo" alt="Footer Logo" width="105" height="25" />}
              extraContent={
                <div>
                  <p>Praesent dapibus, neque id cursus ucibus, tortor neque egestas augue, eu vulputate magna eros eu erat.</p>
                  <div className="widget-call">
                    <i className="icon-phone"></i>
                    Got Question? Call us 24/7 <a href="tel:#">+0123 456 789</a>
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
          <p className="footer-copyright">Copyright © 2019 Molla Store. All Rights Reserved.</p>
          <figure className="footer-payments">
            <img src={paymentMethods} alt="Payment methods" width="272" height="20" />
          </figure>
        </div>
      </div>
    </footer>
  );
};

export default HomePageFooter;
