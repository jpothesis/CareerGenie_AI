import { useEffect, useState } from "react";
import { getGreeting } from "../lib/getGreeting";

const Greeting = ({ name }: { name: string }) => {
  const [greeting, setGreeting] = useState(getGreeting());

  useEffect(() => {
    const interval = setInterval(() => {
      setGreeting(getGreeting());
    }, 60 * 1000); // update every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-2xl font-semibold text-white">
      {greeting}, {name}!
    </div>
  );
};

export default Greeting;
