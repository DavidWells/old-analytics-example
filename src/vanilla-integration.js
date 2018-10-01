/**
 * Vanilla analytics integration
 */

/* integration namespace. Must be unique */
export const NAMESPACE = 'vanilla'

export const config = {
  assumesPageview: true
}

/* initialize Vanilla script */
export const initialize = (config) => {
  console.log('initialize vanilla')
  if (!config.trackingId) {
    throw new Error('No Setting id defined')
  }
}

/* Trigger Vanilla page view */
export const page = (pageData) => {
  console.log('Vanilla Page Track', pageData)
}

/* Track Vanilla event */
export const track = (event, payload, analytics) => {
  console.log(`Vanilla Event > [${event}] [payload: ${JSON.stringify(payload, null, 2)}]`)
}

/* Identify Vanilla user */
export const identify = (id, traits, opts, cb) => {
  console.log('Vanilla identify', id, traits, opts)
  // return Promise.resolve()
}

export const loaded = function() {
  // return simulateSlowNess
  return !!window.vanillaLoaded
}

/* export the integration */
export default function googleAnalytics(userConfig) {
  const mergedConfig = {
    // default config
    ...config,
    // user land config
    ...userConfig
  }
  return {
    NAMESPACE: NAMESPACE,
    config: mergedConfig,
    initialize: extend('initialize', initialize, mergedConfig),
    page: extend('page', page, mergedConfig),
    track: extend('track', track, mergedConfig),
    identify: extend('identify', identify, mergedConfig),
    loaded: extend('loaded', loaded, mergedConfig)
  }
}

// Allows for userland overrides of base functions
function extend(methodName, defaultFunction, config) {
  if (config[methodName] && typeof config[methodName] === 'function') {
    return config[methodName]
  }
  return defaultFunction
}
