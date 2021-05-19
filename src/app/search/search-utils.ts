import type { QueryAST } from './query-parser';
import { SearchConfig } from './search-config';

/**
 * Return whether the query is completely valid - syntactically, and where every term matches a known filter.
 */
export function validateQuery(query: QueryAST, searchConfig: SearchConfig): boolean {
  if (query.error) {
    return false;
  }
  switch (query.op) {
    case 'filter': {
      let filterName = query.type;
      const filterValue = query.args;

      // "is:" filters are slightly special cased
      if (filterName === 'is') {
        filterName = filterValue;
      }

      // TODO: validate that filterValue is correct
      return Boolean(searchConfig.filters[filterName]);
    }
    case 'not':
      return validateQuery(query.operand, searchConfig);
    case 'and':
    case 'or': {
      return query.operands.every((q) => validateQuery(q, searchConfig));
    }
    case 'noop':
      return true;
  }
}