// src/components/IconBoxesContainer.js
import IconBox from './IconBox';

const IconBoxesContainer = () => {
  const iconBoxesData = [
    { icon: 'rocket', title: 'Free Shipping', description: 'Orders $50 or more' },
    { icon: 'rotate-left', title: 'Free Returns', description: 'Within 30 days' },
    { icon: 'info-circle', title: 'Get 20% Off 1 Item', description: 'when you sign up' },
    { icon: 'life-ring', title: 'We Support', description: '24/7 amazing services' },
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
