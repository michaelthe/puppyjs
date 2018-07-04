# Configuration

Puppy was designed to work out of the box with **zero-configuration**. However, each project is different so depending on the situation it might be required to adjust the configuration to fit the project's needs.

## Config file

The entry point for configuring Puppy is the `puppy.config.js` file and must be placed in the root of your project which exports a javascript object.

### Example:

```javascript
module.exports = {
    port: 1337,
    devtools: false
}
``` 

If you now run `puppy serve` or `puppy test` the port for the API, WSocket and Static file servers will be `1337` and if you are running tests, the devtools won't be open in the browser window that opens (if you are not running headless).

Consult [config reference]() for a complete breakdown of the configuration options.

::: tip
The same options can be provided as arguments. E.g. `puppy serve --port 1337 --devtools false`. There are some exceptions which you can consult in  [config reference]()
:::