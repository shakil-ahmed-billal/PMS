import { Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function CountdownTimer({ project }) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    // Ensure the deadline is properly converted into a Date object
    const deadline = new Date(project.deadline);
    
    const updateCountdown = () => {
      const now = new Date().getTime();
      const timeRemaining = deadline - now;

      if (timeRemaining <= 0) {
        setTimeLeft('Deadline has passed');
        return;
      }

      const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    };

    const interval = setInterval(updateCountdown, 1000);

    // Run the countdown immediately on mount
    updateCountdown();

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [project.deadline]);

  return (
    <div className="">
      <p className="text-sm text-gray-500 mt-1">
        Deadline: {new Date(project.deadline).toLocaleDateString()}
      </p>
      <p className="text-md text-gray-500 mt-1 font-bold bg-red-100 rounded-md py-2 px-4 flex items-center gap-3">
        <Clock/> {timeLeft}
      </p>
    </div>
  );
}
