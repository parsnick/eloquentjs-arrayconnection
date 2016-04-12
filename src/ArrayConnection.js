import Processor from './Processor';

export default class ArrayConnection
{
    /**
     * Create a new ArrayConnection.
     *
     * @param  {Object[]} data
     * @param  {Processor} processor
     */
    constructor(data, processor) {
        this.rows = data || [];
        this.processor = processor || new Processor;
    }

    /**
     * Run an INSERT query.
     *
     * @param  {Object} attributes
     * @return {Promise}
     */
    create(attributes) {
        this.rows.push(attributes);

        return this.resolvesWith(attributes);
    }

    /**
     * Run a SELECT type query.
     *
     * @param  {number} id
     * @param  {array} queryStack
     * @return {Promise}
     */
    read(id, queryStack) {
        if (id) queryStack.push(['where', ['id', '=', id]]);

        return this
            .resolvesWith(this.processor.run(this.rows, queryStack))
            .then(results => {
                return id ? results[0] : results;
            });
    }

    /**
     * Run an UPDATE query.
     *
     * @param  {number} id
     * @param  {Object} data
     * @param  {array} queryStack
     * @return {Promise}
     */
    update(id, data, queryStack) {
        if (id) queryStack.push(['where', ['id', '=', id]]);

        const results = this.processor.run(this.rows, queryStack);

        results.forEach(result => Object.assign(result, data));

        return this.resolvesWith(id ? results[0] : results);
    }

    /**
     * Run a DELETE query.
     *
     * @param  {number} id
     * @param  {array} queryStack
     * @return {Promise}
     */
    delete(id, queryStack) {
        return this.read(id, queryStack).then(results => {
            const rowsToDelete = results.map(row => row.id);
            this.rows = this.rows.filter(row => rowsToDelete.indexOf(row.id) === -1);
        });
    }

    /**
     * Create a promise that immediately resolves with the given value.
     *
     * @param  {*} value
     * @return {Promise}
     */
    resolvesWith(value) {
        return new Promise(resolve => resolve(value));
    }
}
