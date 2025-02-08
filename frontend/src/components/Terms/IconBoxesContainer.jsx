import IconBox from './IconBox';

const IconBoxesContainer = () => {
  const iconBoxesData = [
    { icon: 'rocket', title: 'حمل و نقل رایگان', description: 'سفارشات بالای ۵۰۰ هزار تومان' },
    { icon: 'rotate-left', title: 'بازگشت رایگان', description: 'تا ۳۰ روز' },
    { icon: 'info-circle', title: '۲۰٪ تخفیف برای یک کالا', description: 'زمانی که ثبت نام کنید' },
    { icon: 'life-ring', title: 'ما پشتیبانی می‌کنیم', description: 'خدمات عالی ۲۴ ساعته ' },
  ];

  return (
    <div className="icon-boxes-container bg-transparent">
        <div className="container">
          <div className="row">
          {iconBoxesData.map((box, index) => (
            <IconBox
              key={index}
              icon={box.icon}
              title={box.title}
              description={box.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default IconBoxesContainer;
