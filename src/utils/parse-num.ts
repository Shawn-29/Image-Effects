/**
 * Attempts to parse a number from a given value. Returns a default value
 * if a number couldn't be parsed.
 * 
 * @param value
 * 
 * @param defaultValue Fallback if value couldn't be parsed.
 * 
 * @returns The parsed number or a default value if the value couldn't be
 * parsed.
 */
const parseNum = (value: any, defaultValue: number = 0): number => {

    if (typeof value === 'number')
        return value;

    if (typeof value !== 'string')
        return defaultValue;

    const num = Number(value);
    
    return Number.isFinite(num) ? num : defaultValue;
};

export default parseNum;