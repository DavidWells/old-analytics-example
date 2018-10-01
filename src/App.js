import React, { Component } from 'react'
import analyticsLib from 'analytics'
import vanillaIntegration from './vanilla-integration'
import googleAnalytics from 'analytics-plugin-ga'
import customerIO from 'analytics-plugin-customerio'
import './App.css'

const visualize = store => next => action => {
  if (action.type) {
    const node = document.getElementById('log')
    if (node) {
      node.innerHTML = node.innerHTML + '\n' + `<li>${action.type} - <span class='tiny'>${JSON.stringify(action)}</span></li>`
    }
  }

  let result = next(action)

  return result
}

const logger = store => next => action => {
  if (action.type) {
    console.log(`>> dispatching ${action.type}`, JSON.stringify(action))
  }
  //console.log(chalk.blue(JSON.stringify(action, null, 3)))
  let result = next(action)
  //console.log(chalk.yellow(`next state`))
  //console.log(chalk.yellow(JSON.stringify(store.getState(), null, 3)))
  return result
}

const cancelAction = store => next => action => {
  let finalAction = action
  if (action.type === 'track_init') {
    const state = store.getState()
      if (state.user.userId === 'idxyz') {
      // cancel action
      finalAction = {
        ...action,
        ...{ abort: true },
      }
    }
  }
  return next(finalAction)
}


const analytics = analyticsLib({
  app: 'doggieDating',
  version: 100,
  plugins: [
    logger,
    visualize,
    cancelAction,
    googleAnalytics({
      trackingId: 'UA-126647663-1',// UA-121991291
      autoTrack: true,
    }),
    customerIO({
      siteId: '4dfdba9c7f1a6d60f779'
    }),
    vanillaIntegration({
      trackingId: 'lololo',
    }),
  ]
})


console.log('analytics', analytics)

class App extends Component {
  componentDidMount() {
    setTimeout(() => {
      window.vanillaLoaded = true
    }, 500)

    console.log('loaded app')
    /* listen to all actions being fired */
    // const myListener = analytics.on('*', (action, store) => {
    //   console.log('on *, generic state listener fired', action.type)
    //   console.log('action', action)
    //   console.log('store', store)
    // })

    // When all provider scripts are loaded into DOM fire ready
    analytics.ready((action, store) => {
      console.log('Analyics are loaded')
    })

    analytics.page({ extra: 'hi' }, (state) => {
      console.log('PAGE STATE', state.getState())
      // Change title for next page call
      window.document.title = 'lol'
    })

    // Handling Analytic events
    const onTrackComplete = analytics.on('track_complete', (action, store) => {
      console.log('tracking done', action)
      // alert(JSON.stringify(action))
    })
  }
  handleTrack = () => {
    analytics.track('doggieDating:user_awsome', { hi: true }).then(() => {
      console.log('doggieDating:user_awsome track promise')
    })
  }
  handleId = () => {
    analytics.identify('idxyz', {
      firstName: 'bob',
      crazy: true
    }, () => {
      console.log('run cb', analytics.getState())
    })
  }
  handleReId = () => {
    analytics.identify('lololo', {
      firstName: 'bob',
      crazy: true
    }, () => {
      console.log('run cb', analytics.getState())
    })
  }
  getData = () => {
    analytics.page()
    var u = analytics.user()
    console.log('user', u)
  }
  render() {
    return (
      <div>
        <header>
          <p>
            Analytics
          </p>
          <div>
            <button onClick={this.handleTrack}>Track</button>
            <button onClick={this.handleId}>Identify</button>
            <button onClick={this.handleReId}>Re-Identify</button>
            <button onClick={this.getData}>getData</button>
          </div>
        </header>
        <div id='log'></div>
      </div>
    );
  }
}

export default App;
