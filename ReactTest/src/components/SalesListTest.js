import React from 'react';
import axios from 'axios';

import './search.css';


export default class SalesListTest extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            sales: [{month: "", quantity: 0}, {month: "", quantity: 0}, {month: "", quantity: 0}],
            prodid: null,
            querying: false,
        };
    }
    
    /*shouldComponentUpdate(nextProps, nextState) {
        return (this.props.prodid !== nextProps.prodid) && (JSON.stringify(this.state.sales) !== JSON.stringify(nextState.sales));
    }*/

    render() {
        if (this.state.querying){
            this.setState({ sales: [{month: "", quantity: 0}, {month: "", quantity: 0}, {month: "", quantity: 0}], querying: false, });    
        }

        console.log("Teszt2 start");
        axios.get("https://localhost:44339/api/Sales", { params: {
            productid: "d8e85e43-7dbc-ffd0-d56c-e5565a1a56f5",
            minTimeMs: 1000,
            maxTimeMs: 1000
            } 
        },{timeout: 10000})
        .then(response => 
        {
            console.log("Teszt2 response: " + JSON.stringify(response));
        })
        .catch(function (error) {
            console.log("Teszt2 error FIX: " + error);
        });
        console.log("Teszt2 end");


        var needrefresh = (this.props.prodid !== this.state.prodid)
        console.log("SalesList2.render: " + this.props.prodid + " / " + this.state.prodid + " needrefresh: " + needrefresh);
        if (this.props.prodid && (this.props.prodid !== this.state.prodid))
        {

            
            console.log("SalesList2.render afterfut: " + this.props.prodid);
            //
        }

        return (
            <div>
                <table className="table-striped">
                    <thead>
                        <tr>
                            <th>Hónap</th>
                            <th>Fogyás</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.sales.map(function (currentSale, i) {
                                return (
                                    <tr key = {i}>
                                        <td>{currentSale.month}</td>
                                        <td>{currentSale.quantity}</td>
                                    </tr>
                                );
                            })
                        }
                        <tr>
                            <td>{this.props.prodid}</td>
                            <td>asdf</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }
    

}
