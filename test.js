import test from 'ava'
import mockery from 'mockery'

const mock = setupMock()
const plugin = require('./index')

test('No parameters', noOpMacro)

test('Empty array', noOpMacro, [])

test('Empty string', noOpMacro, '')

test('Single parameter', successMacro, {
  URL: 'http://url.com'
}, 'URL')

test('Multiple, comma-separated parameters', successMacro, {
  URL: 'http://url.com',
  KEY: '123abc'
}, 'URL', 'KEY')

test('Single value in an array parameter', successMacro, {
  URL: 'http://url.com'
}, ['URL'])

test('Multiple values in an array parameter', successMacro, {
  URL: 'http://url.com',
  KEY: '123abc'
}, ['URL', 'KEY'])

test('Throws when the env var is not defined', failureMacro, {
  KEY: ''
})

test('Throws when one of multiple env vars is not defined', failureMacro, {
  URL: '',
  KEY: '123abc'
})

test('Throws when none of multiple env vars is defined', failureMacro, {
  URL: '',
  KEY: ''
})

function setupMock() {
  mockery.enable()
  mockery.registerAllowable('./index')
  const mock = { DefinePlugin: function() {} }
  mockery.registerMock('webpack', mock)

  return mock
}

const prepareMockedModule = definePluginMock => {
  mock.DefinePlugin = definePluginMock
  return plugin
}

const setEnvVars = envVarsMap => Object.keys(envVarsMap).forEach(envVar => process.env[envVar] = envVarsMap[envVar])

function noOpMacro(t, ...pluginParameters) {
  t.plan(0)
  prepareMockedModule(function() {
    t.fail()
  })(...pluginParameters)
}

function successMacro(t, envVarsMap, ...pluginParameters) {
  setEnvVars(envVarsMap)

  prepareMockedModule(function(definePluginParameter) {
    t.deepEqual(definePluginParameter, {
      'process.env': Object.keys(envVarsMap).reduce((memo, envVar) => Object.assign(memo, { [envVar]: JSON.stringify(process.env[envVar]) }), {})
    })
  })(...pluginParameters)
}

function failureMacro(t, envVarsMap) {
  setEnvVars(envVarsMap)

  const errorMessageRegExp = new RegExp(Object.keys(envVarsMap).join('|'))
  t.throws(() => prepareMockedModule(function() {})(...Object.keys(envVarsMap)), errorMessageRegExp)
  t.throws(() => prepareMockedModule(function() {})(Object.keys(envVarsMap)), errorMessageRegExp)
}