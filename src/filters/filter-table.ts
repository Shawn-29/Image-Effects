import Filters from './filter-keys';

const filterTable = {
    [Filters.BLUR](amt: number): string {
        return `blur(${amt}px)`;
    },
    [Filters.BRIGHTEN](amt: number): string {
        return `brightness(${amt})`;
    },
    [Filters.CONTRAST](amt: number): string {
        return `contrast(${amt})`;
    },
    [Filters.GRAYSCALE](amt: number): string {
        return `grayscale(${amt})`;
    },
    [Filters.HUE_ROTATE](amt: number): string {
        return `hue-rotate(${amt}deg)`;
    },
    [Filters.INVERT](amt: number): string {
        return `invert(${amt})`;
    },
    [Filters.OPACITY](amt: number): string {
        return `opacity(${amt})`;
    },
    [Filters.SATURATE](amt: number): string {
        return `saturate(${amt})`;
    },
    [Filters.SEPIA](amt: number): string {
        return `sepia(${amt})`;
    }
};

export default filterTable;