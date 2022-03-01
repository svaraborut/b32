

# TL;DR;

Basic usage

```javascript
const { encode, decode, updateDefaultOptions } = require('b32');

// Setup b32 to return strings rather than buffers
updateDefaultOptions({ encode: 'string'});

encode('foobar')
// MZXW6YTBOI======

decode('MZXW6YTBOI======')
// foobar
```

Usage with buffers and padding validation

```javascript
const { encode, decode } = require('b32');

encode('foobar').toString()
// MZXW6YTBOI======

encode('foobar', { addPadding: false }).toString()
// MZXW6YTBOI

encode('foobar', { addPadding: false, encode: 'string' })
// MZXW6YTBOI

decode('MZXW6YTBOI======').toString('utf8')
// foobar

decode('MZXW6YTBOI', { checkPadding: false }).toString('utf8')
// foobar
```
