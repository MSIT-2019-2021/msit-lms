import React, { Component } from 'react';
import { Link, withRouter } from "react-router-dom";
import Repositories from '../Repositories/Repositories';
import NavBar from '../NavBar/NavBar';
import './profile.css';

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null
        };
    }
    getUser() {
        var urlencoded = new URLSearchParams();
        urlencoded.append("token", localStorage.getItem('token'));
        var requestOptions = {
            method: 'GET',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            redirect: 'follow'
        };
        fetch(process.env.REACT_APP_APIBASE_URL + "/api/user/details/?id=" + localStorage.getItem('id') + "&token=" + localStorage.getItem('token'), requestOptions)
            .then(response => response.text())
            .then(result => {
                var json = JSON.parse(result);
                // json = json[0]['enrollments'];
                // console.log('user data');
                // console.log(json);
                this.setState({ user: json }, () => {
                    // console.log('user state updated');
                    // console.log(this.state.user);
                });
            }).catch(error => console.log('error', error));
    }
    componentDidMount() {
      var loc = this.props.location.search
      console.log("location = ",loc);

        if(loc.search('=') !== -1){
          var code = loc.split("=")[1]
          console.log("code =",code);
          this.authorize(code);
        }
        this.getUser();

    }

    updateToken(token){
      var user = localStorage.getItem('id');
      fetch(process.env.REACT_APP_API_URL2+"/github/"+user+"/"+token)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
        this.props.history.push({
      pathname: '/Profile'
      })

    }

    authorize(code){
        const client_id = process.env.REACT_APP_GITHUB_CLIENT
        const client_secret = process.env.REACT_APP_GITHUB_CLIENT_SECRET
        var myHeaders = new Headers();

        myHeaders.append("Accept", "application/json");

        var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow'
        };

        fetch("https://github.com/login/oauth/access_token?code="+code+"&client_id="+client_id+"&client_secret="+client_secret, requestOptions)
        .then(response => response.text())
        .then(result => {
            result = JSON.parse(result);
            this.updateToken(result["access_token"])
            console.log(result)})
        .catch(error => console.log('error', error));
    }

    render() {

        var user = localStorage.getItem("token");
        user ??
        this.props.history.push({
            pathname: "/",
        });

        var name = 'Null';
        var firstName = 'Null';
        var lastName = 'Null';
        var email = 'Null';
        var mobile = '0000000000';
        var dateOfBirth = '01 - 01 - 1900';
        var gender = 'Null';
        var role = 'Null';
        var img1 = 'Null';
        if (this.state.user != null) {
            img1 = "https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"
            name = this.state.user['firstName'] + ' ' + this.state.user['lastName'];
            firstName = this.state.user['firstName'];
            lastName = this.state.user['lastName'];
            email = this.state.user['email'];
            mobile = this.state.user['phoneNo'];
            dateOfBirth = this.state.user['dateOfBirth'];
            gender = this.state.user['gender'];
            role = this.state.user['role'];
        }

        var doc = (
            <div className="container">
            <NavBar></NavBar>
                <div className="row">
                    <div className="col-4 style1">
                        <div className="m-b-25">
                            <img className="img-radius" src={img1} alt={name} />
                        </div>
                        <h6 className="f-w-600 fonts">{name}</h6>
                    </div>
                    <div className="col-8 style2">
                        <div className="card-block">
                            <h6 className="m-b-20 p-b-5 f-w-600 fs-3 text-style fonts">Information</h6>
                            <div className="row">
                                <div className="col-sm-6">
                                    <p className="m-b-10 f-w-600 fs-6 text-start fonts">First Name</p>
                                    <h6 className="text-muted f-w-400 fs-6 text-start fonts">{firstName}</h6>
                                </div>
                                <div className="col-sm-6">
                                    <p className="m-b-10 f-w-600 text-start fonts">Last Name</p>
                                    <h6 className="text-muted f-w-400 text-start fonts">{lastName}</h6>
                                </div>
                                <div className="col-sm-6">
                                    <p className="m-b-10 f-w-600 text-start fonts">Email</p>
                                    <h6 className="text-muted f-w-400 text-start fonts">{email}</h6>
                                </div>
                                <div className="col-sm-6">
                                    <p className="m-b-10 f-w-600 text-start fonts">Phone</p>
                                    <h6 className="text-muted f-w-400 text-start fonts">{mobile}</h6>
                                </div>
                                <div className="col-sm-6">
                                    <p className="m-b-10 f-w-600 text-start fonts">Date of Birth</p>
                                    <h6 className="text-muted f-w-400 text-start fonts">{dateOfBirth}</h6>
                                </div>
                                <div className="col-sm-6">
                                    <p className="m-b-10 f-w-600 text-start fonts">Gender</p>
                                    <h6 className="text-muted f-w-400 text-start fonts">{gender}</h6>
                                </div>
                                <div className="col-sm-6">
                                    <p className="m-b-10 f-w-600 text-start fonts">Role</p>
                                    <h6 className="text-muted f-w-400 text-start fonts">{role}</h6>
                                </div>
                            </div>
                            <h6 class="m-b-20 p-b-5 f-w-600 fs-3 text-style fonts">GitHub Repositories</h6>
                            <Repositories></Repositories>
                        </div>
                    </div>
                </div>
            </div>


        );

        return doc
    }
}

export default withRouter(Profile);
