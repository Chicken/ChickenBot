module.exports = {
    "env": {
        "commonjs": true,
        "es2020": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 12
    },
    "rules": {
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "double"
        ],
        "semi": [
            "error",
            "always"
        ],
        "no-var": "error",
        "no-empty": ["error", { "allowEmptyCatch": true }]
    }
};
