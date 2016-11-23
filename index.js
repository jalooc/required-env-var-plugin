const webpack = require('webpack')

function RequiredEnvVarPlugin(...envVarsNames) {
  if (
    !envVarsNames.length ||
    (Array.isArray(envVarsNames[0]) && !envVarsNames[0].length) ||
    !envVarsNames[0]
  ) return

  const envVarsMap = (Array.isArray(envVarsNames[0]) ? envVarsNames[0] : [...envVarsNames]).reduce((memo, varName) => {
    const processEnv = process.env[varName]
    if (!processEnv) throw new Error(`The following required environmental variable was not specified: ${varName}`)

    memo[varName] = JSON.stringify(processEnv)

    return memo
  }, {});

  webpack.DefinePlugin.call(this, {
    'process.env': envVarsMap,
  });
}

RequiredEnvVarPlugin.prototype = new webpack.DefinePlugin()

module.exports = RequiredEnvVarPlugin