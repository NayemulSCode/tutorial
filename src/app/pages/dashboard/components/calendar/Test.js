import React, { Component } from 'react'
import BarcodeReader from 'react-barcode-reader'
class Test extends Component {
    constructor(props) {
        super(props)
        this.state = {
            result: 'No result',
        }
        this.handleScan = this.handleScan.bind(this)
    } handleScan(data) {
        // console.log(data)
        this.props.getBarcode(data)
        this.setState({
            result: data,
        })
    }
    handleError(err) {
        console.error(err)
    }
    render() {

        return (

            <div>
                <BarcodeReader
                    onError={this.handleError}
                    onScan={this.handleScan} />
            </div>
        )
    }
}

export default Test;