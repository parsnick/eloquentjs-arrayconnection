import desugar from './desugar';

export default class Processor {

    run(rows, query) {
        this.offset = 0;
        this.limit = null;
        this.results = rows;

        desugar(query).forEach(([method, args]) => {
            if (typeof Processor.prototype[method] === 'function') {
                Processor.prototype[method].apply(this, args);
            } else {
                throw new Error(`Method [${method}] not supported by ArrayConnection`);
            }
        });

        if (this.offset) {
            this.results = this.results.slice(this.offset);
        }

        if (this.limit) {
            this.results = this.results.slice(0, this.limit);
        }

        return this.results;
    }

    where(column, operator, value) {
        if (typeof value === 'undefined') {
            value = operator;
            operator = '=';
        }

        this.results = this.results.filter(row => {
            switch (operator) {
            case '=':
                return row[column] == value;
            }

            throw new Error(`Operator [${operator}] not supported`);
        });
    }

    offset(count) {
        this.offset = count;
    }

    limit(count) {
        this.limit = count;
    }
}
