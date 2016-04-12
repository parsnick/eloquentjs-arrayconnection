import babel from 'rollup-plugin-babel';

export default {
    entry: 'src/ArrayConnection.js',
    format: 'umd',
    moduleName: 'EloquentArrayConnection',
    plugins: [
        babel({
            presets: ['es2015-rollup'],
            babelrc: false
        })
    ]
};
