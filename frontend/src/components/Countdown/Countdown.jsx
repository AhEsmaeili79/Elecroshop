import React, { useState, useEffect } from 'react';
import './Countdown.css';

const CountdownTimer = () => {
  const target = { days: 0, hours: 0, minutes: 30, seconds: 59 }; 

  const targetTime = new Date().getTime() + (target.days * 24 * 60 * 60 * 1000) + (target.hours * 60 * 60 * 1000) + (target.minutes * 60 * 1000);
  const [timeLeft, setTimeLeft] = useState(target);

  const updateCountdown = () => {
    const distance = targetTime - new Date().getTime();
    if (distance <= 0) {
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    } else {
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }
  };

  useEffect(() => {
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="deal-bottom">
      <div className="deal-countdown offer-countdown">
        <div className="countdown-timer">
          {timeLeft.days > 0 && renderTimeUnit(timeLeft.days, 'روز', true)}
          {(timeLeft.days > 0 || timeLeft.hours > 0) && renderTimeUnit(timeLeft.hours, 'ساعت', true)}
          {(timeLeft.days > 0 || timeLeft.hours > 0 || timeLeft.minutes > 0) && renderTimeUnit(timeLeft.minutes, 'دقیقه', true)}
          {renderTimeUnit(timeLeft.seconds, 'ثانیه', false)} 
        </div>
      </div>
    </div>
  );
};

const renderTimeUnit = (value, unit, showColon) => (
  value >= 0 && (
    <>
      <div className="time-unit">
        <div className="time-box">{value}</div>
        <div className="unit">{unit}</div>
      </div>
      {showColon && <div className="colon">:</div>}
    </>
  )
);

export default CountdownTimer;
