import React from 'react';
import axios from 'axios';

import './search.css';


export default class SalesList2 extends React.PureComponent {
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

        var needrefresh = (this.props.prodid !== this.state.prodid)
        console.log("SalesList2.render: " + this.props.prodid + " / " + this.state.prodid + " needrefresh: " + needrefresh);
        if (this.props.prodid && (this.props.prodid !== this.state.prodid))
        {

            /*console.log("fetch request : https://localhost:44339/api/Sales?productid="+this.props.prodid+"&minTimeMs=1000&maxTimeMs=1000");
            fetch("https://localhost:44339/api/Sales?productid="+this.props.prodid+"&minTimeMs=1000&maxTimeMs=1000",
                {
                    method: "GET",
                    mode: "cors",
                    headers: {
                        "Content-Type": "application/json"
                    },
                }
            )
            .then(res => res.json())
            .then(
              (response) => {
                console.log("fetch response x: " + JSON.stringify(response));

              },
              // Note: it's important to handle errors here
              // instead of a catch() block so that we don't swallow
              // exceptions from actual bugs in components.
              (error) => {
                this.setState({
                  isLoaded: true,
                  error
                });
              }
            )/**/

            


//            axios.get("http://localhost:57065/api/Sales", { params: {
            //axios.defaults.baseURL ="https://localhost:44339";
            console.log("axios.get: https://localhost:44339/api/Sales : "  + this.props.prodid);
            axios.get("https://localhost:44339/api/Sales", { params: {
                productid: this.props.prodid,
                minTimeMs: 1000,
                maxTimeMs: 1000
                },
                headers: {
                    //"Cache-Control": "no-cache",
                    "content-type": "text/plain",
                } 
            },{timeout: 10000}
            )
            
            .then(response => 
                {
                    //ha nem változott sem a szűrési feltétel (nem írtuk át közben az ablakban, amíg a válasz ideért)
                    console.log("axios response x: " + JSON.stringify(response));
                    console.log("sales changed to: " + JSON.stringify(response.data));
                    if (response.config.params.productid === this.props.prodid) {
                        //getData();
                        //setSalesRun(response.data);
                        
                        var notchanged = JSON.stringify(this.state.sales) === JSON.stringify(response.data);
                        //var notchanged = this.state.sales !== response.data;
                        if (!notchanged) {
                            this.setState({ sales: response.data, prodid: this.props.prodid });
                        }
                    }
                })
                .catch(function (error) {
                    console.log("axios error: " + error);
                });/**/
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
