// @flow
import React, { Component } from 'react'
import 'core.scss'

type Props = {
    children: React$Element<*>
}

export default class Base extends Component {
    props: Props

    constructor() {
        super()
    }

    render(): * {
        return <div className="container">{this.props.children}</div>
    }
}
