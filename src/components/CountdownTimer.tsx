import { useEffect, useState } from "react";

interface CountdownTimerProps {
  targetDate: string | Date;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate }) => {
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

  const timerComponents = timeLeft
    ? Object.entries(timeLeft).map(([unit, value]) => (
      <div
        key={unit}
        className="flex flex-col items-center justify-center w-20 sm:w-24 md:w-32 mx-1 sm:mx-2 md:mx-3 p-3 sm:p-4 bg-white/10 rounded-2xl shadow-xl backdrop-blur-md transition-all duration-300 hover:bg-white/20"
      >
        <div className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white">
          {String(value).padStart(2, "0")}
        </div>
        <div className="text-xs sm:text-sm uppercase font-medium text-gray-300 mt-1 tracking-widest">
          {unit}
        </div>
      </div>
    ))
    : null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white p-4">
      {/* Heading */}
      <h1 className="text-3xl sm:text-5xl md:text-7xl font-black mb-8 sm:mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
        🚀 Launch Imminent 🚀
      </h1>

      {/* Countdown Boxes */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-4 md:gap-6">
        {timerComponents ? (
          timerComponents
        ) : (
          <div className="text-2xl sm:text-4xl font-bold text-yellow-400 p-4 sm:p-6 rounded-2xl bg-gray-800 shadow-lg text-center">
            🎉 We are LIVE! 🎉
          </div>
        )}
      </div>

      {/* Footer Section */}
      <div className="mt-8 sm:mt-12 text-center max-w-sm sm:max-w-md">
        <p className="text-sm sm:text-lg text-gray-400 mb-4 px-2">
          Stay tuned for the big reveal.
        </p>
        <button className="bg-pink-600 hover:bg-pink-700 text-white font-semibold sm:font-bold py-2 sm:py-3 px-6 sm:px-8 rounded-full transition duration-300 shadow-lg transform hover:scale-105">
          Get Notified
        </button>
      </div>
    </div>
  );
};

