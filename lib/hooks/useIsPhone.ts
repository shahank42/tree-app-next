"use-client";

import { useState, useEffect } from "react";

// Custom hook to check if the screen size is for phones
const useIsPhone = (): boolean => {
  const [isPhone, setIsPhone] = useState<boolean>(false);

  useEffect(() => {
    // Function to check screen size
    const checkIfPhone = () => {
      setIsPhone(window.matchMedia("(max-width: 640px)").matches);
    };

    // Initial check
    checkIfPhone();

    // Add event listener for window resize
    window.addEventListener("resize", checkIfPhone);

    // Cleanup event listener on component unmount
    return () => window.removeEventListener("resize", checkIfPhone);
  }, []);

  return isPhone;
};

export default useIsPhone;
