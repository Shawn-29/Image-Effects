/**
 * Invokes a function after a given time. Uses requestAnimationFrame rather
 * than setTimeout in order to provide better precision.
 * 
 * @param waitMs Timeout duration.
 * 
 * @param onFinish Function to call when timeout expires.
 */
const rafTimeout = (waitMs: number, onFinish: () => void) => {

    const endTime = performance.now() + waitMs;

    const timer = () => {
        if (performance.now() >= endTime) {
            onFinish();
        }
        else {
            requestAnimationFrame(timer);
        }
    }
    
    requestAnimationFrame(timer);
};

export default rafTimeout;