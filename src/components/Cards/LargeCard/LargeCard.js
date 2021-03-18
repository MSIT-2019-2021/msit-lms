import React, { Component } from "react";
import {Link,withRouter} from "react-router-dom";
import './LargeCard.css'

var content = null
class LargeCard extends Component {

  constructor(props){
    super(props);
  }

  handleClick(ID){
    var layoutStyle = this.props.layout;
    console.log('ID after recieving = '+ID);
    console.log(`card view prop = ${this.props.view}`);
    if(this.props.view ==='programs')
    {
      console.log(`card id inside if ${ID}`);
        localStorage.setItem('program',ID);
          this.props.history.push({
        pathname: '/courses-catalog',
          state: { view: 'courses',layout:layoutStyle}
        })
      }else if(this.props.view ==='modules'){

      }else{

      }
  }

  render() {

    if(this.props.view === "modules"){
      // return();
    }

    return (
    <div class="card mb-3">
  <div class="row">
    <div class="col-sm-4 col-md-4 col-sm-6">
      <img src={this.props.image} alt="..." class="image-fluid"></img>
    </div>
    <div class="col-sm-8 col-md-8 col-xs-12">
      <div class="card-body">
      <div><h3 class="card-title">{this.props.title}</h3></div>
        <div>
        <p class="card-text">{this.props.description}</p>
        </div>
        </div>
        <div className="button-fix">
        <button type="button" class="btn btn-outline-primary" onClick={()=>{this.handleClick(this.props.id)}}>{this.props.button}</button>
        </div>


    </div>
  </div>
</div>
);
  }
}

export default withRouter(LargeCard);
