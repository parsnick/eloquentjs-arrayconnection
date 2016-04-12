/**
 * Remove syntactic sugar from query.
 *
 * @param  {Array[]} query
 * @return {Array}
 */
export default function desugar(query) {

    return query.map(([method, args]) => {
        switch (method) {
        case 'whereBetween':
        case 'whereNotBetween':
        case 'whereIn':
        case 'whereNotIn':
        case 'whereNull':
        case 'whereNotNull':
        case 'whereDate':
        case 'whereDay':
        case 'whereMonth':
        case 'whereYear':
            break;

        case 'latest':
            return ['orderBy', [args[0] || 'created_at', 'desc']];

        case 'oldest':
            return ['orderBy', [args[0] || 'created_at']];

        case 'skip':
            return ['offset', args];

        case 'take':
            return ['limit', args];
        }

        return [method, args];
    });

}

/***
'select', 'addSelect',
'distinct',
'where', 'orWhere',
'whereBetween', 'orWhereBetween', 'whereNotBetween', 'orWhereNotBetween',
'whereNested',
'whereExists', 'orWhereExists', 'whereNotExists', 'orWhereNotExists',
'whereIn', 'orWhereIn', 'whereNotIn', 'orWhereNotIn',
'whereNull', 'orWhereNull', 'whereNotNull', 'orWhereNotNull',
'whereDate', 'whereDay', 'whereMonth', 'whereYear',
'groupBy',
'having', 'orHaving',
'orderBy', 'latest', 'oldest',
'offset', 'skip', 'limit', 'take', 'forPage',
'with'
**/
