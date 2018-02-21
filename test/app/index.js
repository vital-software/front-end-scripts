// @flow
import BaseComponent from './base-component'
import { Provider } from 'react-redux'
import React from 'react'
import { render } from 'react-dom'
import { IndexRedirect, Route, Router } from 'react-router'

const path: string = '/'

const routes: * = (
    <Route path={path} component={BaseComponent}>
        <IndexRedirect to="test" />
    </Route>
)

render(
    <Provider store={{}}>
        <Router history={history} routes={routes} />
    </Provider>,
    document.getElementById('root') || document.createElement('div')
)
