module.exports = {
    "env": {
        "node": true,
        "es6": true,
        "mocha": true
    },
    "parserOptions": {
        "ecmaVersion": 2017,
        "sourceType": "module",
        "ecmaFeatures": {
            "jsx": true
        }
    },
    "extends": "eslint:recommended",
    "rules": {
        "no-console": 0,
        "indent": [
            "error",
            2
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ]
    }
};