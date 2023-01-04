import { useEffect } from "react";

const useOutsideClick = (ref: any, action: () => void) => {
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (ref.current && !ref.current.contains(event.target)) {
        action();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("blur", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("blur", handleClickOutside);
    };
  }, [ref, action]);
};

export default useOutsideClick;
