import React from 'react';
import axios from 'axios';
import './search.css';

class Product extends React.PureComponent {
    render() {
        return (
            <tr className={this.props.cursorRef ? "cursor" : null} ref={this.props.cursorRef}>
                <td>
                    <div className="pic100">
                        <img
                            src={'https://localhost:44339/api/Pictures?productId=' + this.props.product.id + '&minTimeoutMs=100&maxTimeoutMs=3000'}
                            alt={this.props.product.name}
                        />
                    </div>
                </td>
                <td>{this.props.product.name}</td>
                <td>{this.props.product.price}</td>
                <td>{this.props.product.stock}</td>
                <td>{this.props.product.description}</td>
            </tr>
        )
    }
}



export default class ProductsList extends React.Component {

    constructor(props) {
        super(props);
        var params = new URLSearchParams(this.props.location.search);

        this.state = {
            products: [],
            searchfilter: params.get("searchfilter"),
            cursor: 0,
        };
        this.cursorRef = React.createRef();
        this.gridref = React.createRef();
        
        //const queryString = require('query-string');
        //var x = this.props.location.search.parse()
        //console.log(this.props);
    }

    componentDidMount() {
        this.refilter(this.state.searchfilter);
    }

    refilter(searchfilter) {
        this.setState({ searchfilter: searchfilter });

        if (searchfilter) {
            axios.get('https://localhost:44339/api/Products?keyword=' + searchfilter + '&take=30&minTimeoutMs=200&maxTimeoutMs=1000')
                .then(response => {
                    if (response.data.keyword === this.state.searchfilter) {
                        this.setState({ products: response.data.data });
                    }
                    this.setState({ cursor: -1 });
                    this.gridref.current.scrollTop = 0;
                })
                .catch(function (error) {
                    console.log(error);
                });
        } else {
            this.setState({ products: [] });
        }
    }


    productList(cursorRef) {
        let cur = this.state.cursor;

        return this.state.products.map(function (currentProduct, i) {
            return <Product product={currentProduct} key={currentProduct.id} cursorRef={cur === i ? cursorRef : null} />;
        })
    }

    onChange = (event) => {
        this.refilter(event.target.value);
    }

    handleKeyDown = (event) => {
        let nextcursor = this.state.cursor;
        switch (event.key) {
            case "ArrowUp":
                nextcursor -= 1;
                event.preventDefault();
                break;
            case "ArrowDown":
                nextcursor += 1;
                event.preventDefault();
                break;
            default: break;
        }
        nextcursor = Math.max(Math.min(nextcursor, this.state.products.length - 1), 0)

        if (this.state.cursor !== nextcursor)
            this.setState({ cursor: nextcursor });

        if (this.cursorRef.current) {
            this.cursorRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        }

    }

    render() {
        return (
            <div className="ac_results">
                <input className="search" placeholder="Keresés" value={this.state.searchfilter} onChange={this.onChange} onKeyDown={this.handleKeyDown} />
                <div className="tbodyscroll" ref={this.gridref}>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Kép</th>
                                <th>Név</th>
                                <th>Ár</th>
                                <th>Készlet</th>
                                <th>Leírás</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.productList(this.cursorRef)}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}