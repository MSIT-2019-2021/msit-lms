import React, { Component } from "react";
import ReactDOM from 'react-dom';
import NavBar from "../NavBar/NavBar";
import './forgotPassword.css';

var valid = false;
class ForgotPassword extends Component {

  validate(){
    var pattern = new RegExp(
      /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
    );
    var mail = document.getElementById('email');
    if (!pattern.test(mail.value)) {
      document.getElementById('warn').textContent = "*Enter valid email-ID.";
    }else{
      document.getElementById('warn').textContent = "";
      valid = true;
    }
  }

  handleClick(){
    if(valid === false){
      alert('Enter a valid email to proceed')
      return
    }
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "email": document.getElementById('email').value
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("http://localhost:8000/api/auth/forgot-password", requestOptions)
      .then(response => response.text())
      .then(result => {
        console.log(result)
        var dialog = document.getElementById('dialog');
        if(result==="true"){
          let message = (<p class="fs-2 text-success"><i class="bi bi-check2-circle"></i> Check your mail to reset password</p>);
          ReactDOM.render(message,dialog);
        }else{
          let message = (<p class="fs-2 text-success">Unknown error</p>);
          ReactDOM.render(message,dialog);
        }
      })
      .catch(error => console.log('error', error));
  }

  render() {
      return (<div className="container">
                <NavBar></NavBar>
                <div className="container forgot-content">
                <div className="row">
                <div className="col">
                <div id="dialog" className="input-group mb-3">
                  <input id="email" type="text" onChange={this.validate} className="form-control" placeholder="Enter email" aria-label="Enter email" aria-describedby="forgot">
                  </input>
                  <button className="btn p-button" type="button" id="forgot" onClick={this.handleClick}>Submit</button>
                </div>
                </div>
                </div>
                <div className="row">
                <p id="warn" className="text-start text-danger fw-bold"></p>
                </div>
                </div>
          </div>);
  }
}

export default ForgotPassword;
