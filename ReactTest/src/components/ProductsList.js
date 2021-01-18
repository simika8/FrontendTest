import React from 'react';
import axios from 'axios';
import './search.css';

import SalesList from './SalesList';

class Product extends React.PureComponent {
    render() {
        //console.log("Product.render");
        return (
            <tr className={this.props.cursorRef ? "cursor" : null} ref={this.props.cursorRef}>
                <td>
                    <div className="pic100">
                        <img
                            src={this.props.imgsrc}
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
            searchfilter: "",
            productsTake: parseInt(params.get("productsTake") || 0, 0),
            productsMinTimeMs: parseInt(params.get("productsMinTimeMs") || 0, 0),
            productsMaxTimeMs: parseInt(params.get("productsMaxTimeMs") || 0, 0),
            picturesMinTimeMs: parseInt(params.get("picturesMinTimeMs") || 0, 0),
            picturesMaxTimeMs: parseInt(params.get("picturesMaxTimeMs") || 0, 0),
            salesMinTimeMs: parseInt(params.get("salesMinTimeMs") || 0, 0),
            salesMaxTimeMs: parseInt(params.get("salesMaxTimeMs") || 0, 0),
            cursor: 0,
            pageCursor: "",
        };
        //console.log(this.state.productsMinTimeMs+ " " +this.state.productsMaxTimeMs);
        this.cursorRef = React.createRef();
        this.gridref = React.createRef();
        
        //const queryString = require('query-string');
        //var x = this.props.location.search.parse()
        //console.log(this.props);
    }

    componentDidMount() {
        this.refilter(this.state.searchfilter);
    }


    getprods(searchfilter, pageCursor){
        //var cur = pageCursor?"&cursor="+ pageCursor:"";
        //return axios.get("https://localhost:44339/api/Products?keyword=" + searchfilter + cur + "&take="+ this.state.productsTake+ "&minTimeMs=" + this.state.productsMinTimeMs + "&maxTimeMs=" + this.state.productsMaxTimeMs);
        //console.log("axios.get: https://localhost:44339/api/Products : "  + searchfilter);
        return axios.get("https://localhost:44339/api/Products", { params: {
                keyword: searchfilter,
                cursor: pageCursor,
                take:this.state.productsTake,
                minTimeMs: this.state.productsMinTimeMs,
                maxTimeMs: this.state.productsMaxTimeMs
            } 
        });
    }
    refilter(searchfilter) {
        this.setState({ searchfilter: searchfilter });

        if (searchfilter) {

            this.getprods(searchfilter)
                .then(response => {
                    //console.log("axios.response: https://localhost:44339/api/Products : ");
                    //ha nem változott sem a szűrési feltétel (nem írtuk át közben az ablakban, amíg a válasz ideért)
                    if (response.config.params.keyword === this.state.searchfilter) {
                        this.setState({ products: response.data.data });
                        this.setState({ cursor: -1 });
                        this.setState({ pageCursor: response.data.cursor});
                        this.gridref.current.scrollTop = 0;
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        } else {
            this.setState({ products: [] });
        }
    }
    getMoreRecords(){
        var searchfilter = this.state.searchfilter;

        if (!this.state.pageCursor)
            return;

        if (searchfilter) {
            this.getprods(searchfilter, this.state.pageCursor)
                .then(response => {
                    //ha nem változott sem a szűrési feltétel (nem írtuk át közben az ablakban, amíg a válasz ideért), sem a pagecursor (dupla lekérdezésnél az első válasz meghozza az új rekordokat, és átírja a pagecursort)
                    if (response.config.params.cursor === this.state.pageCursor && response.config.params.keyword === this.state.searchfilter) {
                        let newproducts = this.state.products.concat(response.data.data);
                        this.setState({ pageCursor: response.data.cursor});
                        this.setState({ products: newproducts});
                    }
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
        let picturesMinTimeMs = this.state.picturesMinTimeMs
        let picturesMaxTimeMs = this.state.picturesMaxTimeMs;

        return this.state.products.map(function (currentProduct, i) {
            return <Product product={currentProduct} key={currentProduct.id} number={i} cursorRef={cur === i ? cursorRef : null} imgsrc = {"https://localhost:44339/api/Pictures?productId=" + currentProduct.id + "&minTimeMs=" + picturesMinTimeMs + "&maxTimeMs=" + picturesMaxTimeMs}/>;
        });
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
        nextcursor = Math.max(Math.min(nextcursor, this.state.products.length - 1), -1)

        if (this.state.cursor !== nextcursor)
            this.setState({ cursor: nextcursor });

        if (this.cursorRef.current) {
            this.cursorRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        }

        if (nextcursor === this.state.products.length - 1)
            this.getMoreRecords();
    }

    render() {
        //console.log("ProductsList.render");
        var prodid = "";
        var cur = this.state.cursor;
        var prods = this.state.products;
        if (prods.length > 0 && cur >= 0 && cur < prods.length) {
            
            prodid = prods[cur].id;
        }

        return (
            <div className="ac_results">
                <input className="search" placeholder="Keresés" value={this.state.searchfilter} onChange={(e) => {this.refilter(e.target.value);}} onKeyDown={this.handleKeyDown} />
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
                <SalesList prodid = {prodid}/>
            </div>
        )
    }
}