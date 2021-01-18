import React, { Component, Fragment, useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import './search.css';


class Product extends React.PureComponent {
    render() {
        return (
            <tr className={this.props.cursorRef? "cursor" : null} ref={this.props.cursorRef}>
                <td>
                    <div className="pic100">
                        <img
                            src={'https://localhost:44339/api/Pictures?productId=' + this.props.product.id + '&minTimeoutMs=100&maxTimeoutMs=3000'}
                            alt="szöveg"
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
        this.state = {
            products: [],
            searchfilter: '',
            cursor: 0,
        };
        this.cursorRef = React.createRef();
        this.gridref = React.createRef();

    }

    componentDidMount() {
        this.refilter(this.state.searchfilter);
    }

    refilter(searchfilter) {
        //axios.get('https://localhost:44339/api/Sales?productId=3fa85f64-5717-4562-b3fc-2c963f66afa6&minTimeoutMs=0&maxTimeoutMs=0')

        this.setState({ searchfilter: searchfilter });

        if (searchfilter) {
            axios.get('https://localhost:44339/api/Products?keyword=' + searchfilter + '&take=10&minTimeoutMs=200&maxTimeoutMs=1000')
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
        //console.log(cursorRef);
        return this.state.products.map(function (currentProduct, i) {
            return <Product product={currentProduct} key={currentProduct.id} cursorRef={cur === i?cursorRef:null}/>;
        })
    }

    handleChange = (event) => {


        this.refilter(event.target.value);
    }

    ScrollToCursor(nextcursor){
        if (this.cursorRef.current){
            this.cursorRef.current.scrollIntoView({behavior: "smooth", block: "center"});
            /*// saját scrollozási algoritmus:
            var pos = 0;
            if (this.state.products.length > 1)
                pos = nextcursor / (this.state.products.length-1);

            var maxscrolltop = this.gridref.current.scrollHeight - this.gridref.current.clientHeight;  
            var newscrolltop = maxscrolltop * pos;
            if (Math.abs(newscrolltop - maxscrolltop) > 5)
                this.gridref.current.scrollTop = maxscrolltop * pos;*/
            //console.log("scrollpos:" + pos + " " + this.state.products.length + " maxscrolltop" + maxscrolltop  );
        }
    }

    handleKeyDown = (event) => {
        //console.log(event.key);
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
        if (nextcursor >= this.state.products.length)
            nextcursor = this.state.products.length - 1;
        if (nextcursor <= 0)
            nextcursor = 0;

        if (this.state.cursor !== nextcursor)
            this.setState({ cursor: nextcursor });
        this.ScrollToCursor(nextcursor);
        
    }
    onScroll = () => {
        const scrollY = window.scrollY //Don't get confused by what's scrolling - It's not the window
        const scrollTop = this.gridref.current.scrollTop;
        const scrollHeight = this.gridref.current.scrollHeight;
        //console.log(`onScroll, window.scrollY: ${scrollY} cursorRef.scrollTop: ${scrollTop} scrollHeight: ${scrollHeight} clientHeight: ${this.gridref.current.clientHeight}`)
        this.setState({
          scrollTop: scrollTop
        })
    }
    render() {
        //<input className="search" maxLength="15" placeholder="Keresés" value={this.state.searchfilter} onChange={this.handleChange} />
        //<SearchFilter searchfilter={this.state.searchfilter} onChange={this.handleChange} onKeyPress={this.handleKeyPress}/>
        const divStyle = {
            overflowY: 'scroll',
            border: '1px solid lightgrey',
            width: '1000px',
            float: 'left',
            height: '800px',
            position: 'relative'
        };
        //<div style={divStyle} ref={this.gridref} onScroll={this.onScroll}>
        return (
            <div className="ac_results">
                <input className="search" placeholder="Keresés" value={this.state.searchfilter} onChange={this.handleChange} onKeyDown={this.handleKeyDown} />
                <div className="tbodyscroll" ref={this.gridref} onScroll={this.onScroll}>
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