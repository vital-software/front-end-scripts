// @flow
import Input from './input-component'
import React, { Component } from 'react'
import 'core.scss'

type Props = {
    children: React$Element<*>
}

export default class Base extends Component {
    props: Props

    constructor() {
        super()

        this.handleNext = this.handleNext.bind(this)
    }

    handleNext() {
        console.log(this.props)
    }

    async testAsyncFunction(): * {
        const result: * = await fetch('thing')

        return result
    }

    render(): * {
        return (
            <div className="container">
                {this.props.children}
                <img
                    src="/images/logo.svg"
                    alt="Vital Logo"
                    className="logo"
                    width="18"
                    height="18"
                />
                <Input />
            </div>
        )
    }
}
