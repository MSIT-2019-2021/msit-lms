import React, {Component} from 'react';
import {Link,withRouter} from "react-router-dom";
import NavBar from '../NavBar/NavBar';
import Cards from '../Cards/Cards'
import './credits.css';



class Credits extends Component{
    constructor(){
        super();
        this.state = {
            developers : [
                {Name: "Kalluru Rohit", Contact: "rohithkalluru@gmail.com", Image: "https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg" },
                {Name: "Mallika Bhargavi", Contact: "dsmbhargavi@gmail.com", Image: "https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"},
                {Name: "Radhika Patnala", Contact: "raninmy@gmail.com", Image: "https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"},
                {Name: "Tarun Kumar", Contact: "msgtotarun@gmail.com", Image: "https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"},
                {Name: "Muvvala Sravan Kumar", Contact: "muvvalasravan@gmail.com", Image: "https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"}
            ]
        }

    }

    // setRows(list){
    //
    //   <div class="row">
    //   </div>
    // }

    setCards(list){
      list = list.map((dev) => {
        return <Cards name={dev.Name} image={dev.Image} contact={dev.Contact}></Cards>

      })

      // list = this.setRows(list)
      // var rows = [];
      // var display = [];
      // var i = 0;
      // list.forEach((card,ind,arr) => {
      //   if(ind+1 %3 == 1){
      //     rows = []
      //   }
      //   else if(i+1 %3 == 0){
      //      var doc = (<div className="row gx-5">{rows}</div>);
      //     display.push(doc);
      //   }
      //   rows.push(card)
      // })

      return list;
    }

    render()
    {

        var user = localStorage.getItem("token");
        user ??
        this.props.history.push({
            pathname: "/",
        });

        var list = this.setCards(this.state.developers);

        return (<div class="container">
        <NavBar></NavBar>
        <div className="row row-cols-1 row-cols-md-3 g-4 marg">
        {list}
        </div>
        </div>)
    }
}

export default withRouter(Credits);
