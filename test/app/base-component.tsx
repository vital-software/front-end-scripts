import Input from './input-component'
import React, { Component } from 'react'
import 'core.scss'
import styles from './base-component.module.css'

interface BaseProps {
    children: React.ReactChildren;
}

export default class Base extends Component<BaseProps> {
    constructor() {
        super()

        this.handleNext = this.handleNext.bind(this)
    }

    handleNext() {
        console.log(this.props)
    }

    async testAsyncFunction() {
        const result = await fetch('thing') // eslint-disable-line

        return result
    }

    render() {
        return (
            <div className="container">
                {this.props.children}
                <img src="/images/logo.svg" alt="Vital Logo" className="logo" width="18" height="18" />
                <p className={styles.thing}>Yolo</p>
                <Input />
            </div>
        )
    }
}
