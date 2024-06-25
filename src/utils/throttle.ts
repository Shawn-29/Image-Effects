import rafTimeout from './raf-timeout';

/**
 * Throttles a function, preventing it from being called for a given duration.
 * 
 * @param fn Function to throttle.
 * 
 * @param waitMS Throttle duration.
 * 
 * @returns The original function wrapped in a throttled function.
 */
const throttle = (fn: (...args: any) => void, waitMS: number = 100): (...args: any) => void => {
    
    let waiting = false;

    return (...args) => {
        if (waiting)
            return;

        waiting = true;

        rafTimeout(waitMS, () => waiting = false);

        fn(...args);
    };
};

export default throttle;