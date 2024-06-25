import filterTable from './filter-table';
import FilterKey from './filter-keys';

type FilterMap = Map<FilterKey, string>;

class FilterGroup {

    #appliedFilters: FilterMap = new Map();
    #filterStyle: string = '';

    constructor() { }

    #updateFilterStyle(): void {
        this.#filterStyle =
            [...this.#appliedFilters.values()].join(' ');
    }

    applyFilter(key: FilterKey, amt: number): boolean {

        const fn = filterTable[key];

        if (typeof fn !== 'function') return false;

        this.#appliedFilters.set(key, fn(amt));
        this.#updateFilterStyle();

        return true;
    }

    getFilterValue(key: FilterKey): string | null {
        return this.#appliedFilters.get(key) ?? null;
    }

    removeFilter(key: FilterKey): void {
        this.#appliedFilters.delete(key) && this.#updateFilterStyle();
    }

    get filterStyle() { return this.#filterStyle; }
}

export default FilterGroup;