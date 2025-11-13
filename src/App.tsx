import React, { useState, useEffect } from "react";

interface CountdownTimerProps {
  targetDate: string | Date;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate }) => {
  // Calculate time remaining
  const calculateTimeLeft = (): TimeLeft | null => {
    const target = new Date(targetDate).getTime();
    const now = new Date().getTime();
    const difference = target - now;

    if (difference <= 0) return null;

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(calculateTimeLeft());

  // Update countdown every second
  useEffect(() => {
    if (!timeLeft) return;

    const timer = setInterval(() => {
      const updated = calculateTimeLeft();
      if (updated) {
        setTimeLeft(updated);
      } else {
        setTimeLeft(null);
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  // Render components
  const timerComponents = timeLeft
    ? Object.entries(timeLeft).map(([unit, value]) => (
        <div
          key={unit}
          className="text-center mx-2 p-4 bg-white/10 rounded-xl shadow-2xl backdrop-blur-sm transition-all duration-300 hover:bg-white/20"
        >
          <div className="text-4xl md:text-7xl font-extrabold text-white">
            {String(value).padStart(2, "0")}
          </div>
          <div className="text-sm uppercase font-medium text-gray-300 mt-1 tracking-widest">
            {unit}
          </div>
        </div>
      ))
    : null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
      <h1 className="text-5xl md:text-7xl font-black mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
        🚀 Launch Imminent 🚀
      </h1>

      <div className="flex flex-wrap justify-center space-x-2 sm:space-x-4">
        {timerComponents ? (
          timerComponents
        ) : (
          <div className="text-4xl font-bold text-yellow-400 p-6 rounded-lg bg-gray-800 shadow-xl">
            🎉 We are LIVE! 🎉
          </div>
        )}
      </div>

      <div className="mt-12 text-center">
        <p className="text-lg text-gray-400 mb-4">Stay tuned for the big reveal.</p>
        <button className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-8 rounded-full transition duration-300 shadow-lg transform hover:scale-105">
          Get Notified
        </button>
      </div>
    </div>
  );
};



const App: React.FC = () => {
  // Example countdown to New Year 2026
  const targetDate = "2025-12-31T23:59:59";

  return <CountdownTimer targetDate={targetDate} />;
};

export default App;

