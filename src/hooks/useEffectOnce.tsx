import { useEffect, useRef } from "react";

const useEffectOnce = (callback) => {
  const isMounted = useRef(false);

  useEffect(() => {
    if (!isMounted.current) {
      callback();
      isMounted.current = true;
    }
  }, [callback, isMounted]);
};

export default useEffectOnce;
