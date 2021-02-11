import React, { Component } from "react"
import {Link} from "react-router-dom";
import './Login.css'
const {REACT_APP_APIBASE_URL,}=process.env
var bg;
class  Login extends Component {
  constructor(props){
    super(props)
    this.state ={
      username:'',
      password:''
    }
    bg={
      token:'',
      valid:''
    }
   this.handleLogin= this.handleLogin.bind(this)
  }
  handleInputChange=(event)=>{
   this.setState({
     [event.target.name]:event.target.value
  })
}
  
async handleLogin(event){

    var requestOptions = {
      method: 'POST',
      body: new URLSearchParams({
        "email": this.state.username,
        "password":this.state.password
      }),
      redirect: 'follow'
    };
    var data
    await fetch(`${REACT_APP_APIBASE_URL}/api/auth/login`, requestOptions)
      .then(response => response.text())
      .then(result => {
        // console.log(result)
        data=JSON.parse(result);
        localStorage.setItem('token',data.token)
          if(data.valid==='admin'){
              // window.location.href=environment.adminUrl+"/dashboard/?token="+this.bg.token;
              console.log("need admin redirect: "+localStorage.getItem('token'))
            
          }
        }
      )
      .catch(error => console.log('error', error));
      
      requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };
      
      
     fetch(`${REACT_APP_APIBASE_URL}/api/user/id/?token=${data.token}`,requestOptions)
      .then(response => response.text())
      .then(result => {
        console.log(result)
       var id=JSON.parse(result)
        localStorage.setItem('id',id.id)
      }
      ).catch(error => console.log('error', error));
      
  }
  render() {
    if(localStorage.getItem('token')===null){
var login=

            <div className  = "d-flex justify-content-center h-100" >
            <div className  = "user_card" >
            <div className  = "d-flex justify-content-center" >
            <div className  = "brand_logo_container" >
            <img src = "/image.jpg"
            width = "400"
            height = "400"
            className  = "brand_logo"
            alt = ""/>
            </div>
            </div> 
            <div className  = "d-flex justify-content-center form_container" >
            <form>
            <
            div className  = "input-group mb-3" >
            <
            div className  = "input-group-append" >
            <
            span className  = "input-group-text" > < i className  = "fas fa-user" > </i></span >
            </div>
            <input type = "text"
            name = "username"
            className  = "form-control input_user"
            value = {this.state.username}
            placeholder = "username"
            onChange={this.handleInputChange}
            />
            
            </div> 
            <div className  = "input-group mb-2" >
            < div className  = "input-group-append" >
            <span className  = "input-group-text" > < i className  = "fas fa-key" > </i> </span>
            </div> 
            <input type = "password"
            name = "password"
            className  = "form-control input_pass"
            value = {this.state.password}
            placeholder = "password"
            onChange={this.handleInputChange}
            />

            </div> 
            <div className  = "mt-4" >
            <div className  = "d-flex justify-content-center links" >
            <Link to = "#" > Forgot your password ? </Link> 
            </div> 
            </div> 
            <div className  = "d-flex justify-content-center mt-3 login_container" >
            <button type = "button"
            name = "button"
            className  = "btn login_btn"  onClick={this.handleLogin}> Login </button> 
            </div> 
            </form> 
            </div>
            </div> 
            </div> 
    }
    return (
      <div className  = "container h-100 loginFix" >
      {login}
      </div>
      );
}
}
export default Login;
