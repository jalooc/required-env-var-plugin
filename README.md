#required-env-var-plugin [![Build Status](https://travis-ci.org/jalooc/required-env-var-plugin.svg?branch=master)](https://travis-ci.org/jalooc/required-env-var-plugin)

>Require an environmental variable in your application or throw routhlessly.

_A zero-dependency [webpack](https://webpack.js.org/) plugin._

##Motivation

If you have ever found yourself setting up default env vars in your project just to make sure your app does get some data when a developer forgets to provide it, you run a risk of serving a hard debugging time to other contributors or even worse, ending up with wrong configuration in deployment process.

No more accidental values for environmental variables in your app. Get a hard reminder on your face that there's something to be set.

##Usage

The only requirement is a webpack package installed, but since you're checking out a webpack plugin, you're probably already there.

Just register the plugin and provide the required env var names as parameters:

```javascript
const RequiredEnvVarPlugin = require('required-env-var-plugin')
//...
module.exports = {
  //...
  plugins: [
    new RequiredEnvVarPlugin('API_URL', 'USER', 'PASS')
  ]
  //...
}
```
You can provide the variables both as a list: `REVP('API_URL', 'USER', 'PASS')` or as an array: `REVP(['API_URL', 'USER', 'PASS'])`.
 
#How does it work?

Under the hood it just uses [webpack's DefinePlugin](https://webpack.js.org/guides/production-build/#node-environment-variable) and passes it the object of shape:
```javascript
{
  'process.env': {
    API_URL: xxx,
    USER: xxx,
    PASS: xxx,
  }
}
```
where `xxx` are respective environmental variables derived from `process.env.xxx`. If it doesn't find one, throws.

##FAQ

###Why throw? Can't I just warn the user?

No. That's the whole purpose of the plugin. If developer didn't infere from the code, didn't find out from the docs or didn't deduce from the application working that the env var hadn't been set, then he surely won't notice it in a bunch of logs spitted onto the console during startup. The message has to be clear: `You forgot to do it, I won't launch!`

## License

MIT (https://opensource.org/licenses/mit-license.php)