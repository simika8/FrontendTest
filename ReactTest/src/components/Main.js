
import React, { Component } from "react";
import { Link } from "react-router-dom";

//import { render } from "react-dom";
//import "./style.css";

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productsTake:"30",
      productsMinTimeMs:"200",
      productsMaxTimeMs:"1000",
      picturesMinTimeMs:"50",
      picturesMaxTimeMs:"3000",
      salesMinTimeMs:"3000",
      salesMaxTimeMs:"3000",
    };
  }
  onChange = (event) => {this.setState({searchfilter: event.target.value,})}

  render() {
    var href = "/ProductsList?productsTake="+this.state.productsTake
      + "&productsMinTimeMs="+this.state.productsMinTimeMs+"&productsMaxTimeMs="+this.state.productsMaxTimeMs 
      + "&picturesMinTimeMs="+this.state.picturesMinTimeMs+"&picturesMaxTimeMs="+this.state.picturesMaxTimeMs
      + "&salesMinTimeMs="+this.state.salesMinTimeMs+"&salesMaxTimeMs="+this.state.salesMaxTimeMs;
    return (
      <div>
        <div><label>productsTake <input onChange={(e) => {this.setState({productsTake: e.target.value,})}} value = {this.state.productsTake}/></label></div>

        <div><label>productsMinTimeMs <input onChange={(e) => {this.setState({productsMinTimeMs: e.target.value,})}} value = {this.state.productsMinTimeMs}/></label></div>
        <div><label>productsMaxTimeMs <input onChange={(e) => {this.setState({productsMaxTimeMs: e.target.value,})}} value = {this.state.productsMaxTimeMs}/></label></div>

        <div><label>picturesMinTimeMs <input onChange={(e) => {this.setState({picturesMinTimeMs: e.target.value,})}} value = {this.state.picturesMinTimeMs}/></label></div>
        <div><label>picturesMaxTimeMs <input onChange={(e) => {this.setState({picturesMaxTimeMs: e.target.value,})}} value = {this.state.picturesMaxTimeMs}/></label></div>

        <div><label>salesMinTimeMs <input onChange={(e) => {this.setState({salesMinTimeMs: e.target.value,})}} value = {this.state.salesMinTimeMs}/></label></div>
        <div><label>salesMaxTimeMs <input onChange={(e) => {this.setState({salesMaxTimeMs: e.target.value,})}} value = {this.state.salesMaxTimeMs}/></label></div>


        <div><Link to={href} className="nav-link"><button>Termékek</button></Link></div>

      </div>
      
    );
  }

}


export default Main;