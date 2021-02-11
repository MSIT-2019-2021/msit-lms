import React, { Component } from "react";
import {Link} from "react-router-dom";
import './NavBar.css'

class NavBar extends Component {
 
  render() {
    var userName=this.props.userName
   
    if(userName!==undefined || userName!=null )
      var userNav=  
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
                {/* <ul className ="navbar-nav mr-auto mb-lg-0">
                  
                </ul> */}
                
                <ul className ="nav navbar-nav ml-auto">
                    <li className ="nav-item">
                        <Link className ="nav-link" to='#'>Credits</Link>
                    </li>
                    <li className ="nav-item">
                        <Link  className ="nav-link " to="#">Course status</Link>
                    </li>
                    <li className ="nav-item">
                      <span className ="nav-link active">{'Hi! '+userName}</span>
                  </li>
                  <li className ="nav-item">
                    <Link className ="nav-link " to="#">Logout</Link>
                  </li>
                </ul>
              
          </div>
      
    
    return (
      <div className='navFix'>
      <nav className="navbar fixed-top navbar-expand-md navbar-colour navbar-dark">
      <div className ="container-fluid">
        <Link className ="navbar-brand" href="#">LMS</Link>
        <button className ="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className ="navbar-toggler-icon"></span>
        </button>
        {userNav}
      </div>
    </nav>
    </div>
  );
  }
}


export default NavBar;
