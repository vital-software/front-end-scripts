import BaseComponent from './base-component'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import React from 'react'
import { render } from 'react-dom'
import { Route } from 'react-router'

const path = '/'

render(
    <Provider store={{}}>
        <BrowserRouter>
            <Route exact={true} path={path} component={BaseComponent} />
        </BrowserRouter>
    </Provider>,
    document.getElementById('root') || document.createElement('div')
)
