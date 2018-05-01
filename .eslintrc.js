module.exports = {
  "env": {
    "node": true,
    "browser": true,
    "es6": true
  },
  "parserOptions": {
    "ecmaVersion": 6
  },
  "extends": "eslint:recommended",
    "rules": {
        "indent": [
            "error",
            2
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "never"
        ]
    }
};
