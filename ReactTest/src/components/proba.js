
import React, { Component } from "react";
//import { render } from "react-dom";
//import "./style.css";

class Proba extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    //this.myRef.current.scrollIntoView();
  }
  executeScroll = () => this.myRef.current.scrollIntoView();

  
  

  render() {
    //return <div ref={this.myRef}>Element to scroll to</div>;
    return (
      <>
        {" "}
        {/* React.Fragment*/}
        <div style={{ height: 1600 }} /> {/* just to demonstrate scroll*/}
        <div ref={this.myRef}>I wanna be see dsadn</div>
        {/* Attach ref object to a dom element */}
        <div style={{ height: 1500 }} /> {/* just to demonstrate scroll*/}
        <button onClick={this.executeScroll}>Click to scroll </button>
        {/* Scroll on click */}
      </>
    );
  }

}


export default Proba;