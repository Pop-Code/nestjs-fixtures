module.exports = {
    mode: 'modules',
    out: 'doc/code',
    exclude: [
        '**/test/**',
        '**/src/bundles/app/fixtures/**',
        '**/src/bundles/order/**'
    ],
    theme: 'default',
    name: 'Nestjs-fixtures module Documentation',
    ignoreCompilerErrors: false,
    excludeExternals: true,
    excludePrivate: false,
    excludeNotExported: false,
    target: 'ES6',
    moduleResolution: 'node',
    preserveConstEnums: true,
    stripInternal: false,
    suppressExcessPropertyErrors: true,
    suppressImplicitAnyIndexErrors: true,
    module: 'commonjs',
    hideGenerator: true
};
