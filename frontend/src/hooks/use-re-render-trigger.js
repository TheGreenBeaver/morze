import { useCallback, useEffect, useRef, useState } from 'react';
import { throttle } from 'lodash';

function useReRenderTrigger(events, { eventEmitter = window, auto = false, wait = 300 } = {}) {
  const [, setTrigger] = useState(0);

  const throttledSetTrigger = useRef(
    throttle((_setTrigger) => _setTrigger((curr) => curr + 1), wait),
  );

  const onEvent = useCallback(() => {
    throttledSetTrigger.current.cancel();
    throttledSetTrigger.current(setTrigger);
  }, []);

  useEffect(() => {
    if (auto && eventEmitter) {
      turnOn();
    }
    return () => {
      if (eventEmitter) {
        turnOff();
      }
    };
  }, [eventEmitter]);

  function turnOn() {
    events.forEach((ev) => eventEmitter.addEventListener(ev, onEvent));
  }

  function turnOff() {
    events.forEach((ev) => eventEmitter.removeEventListener(ev, onEvent));
  }

  return { turnOn, turnOff };
}

export default useReRenderTrigger;