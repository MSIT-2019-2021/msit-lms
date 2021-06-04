import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "./LargeCard.css";

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
      // localStorage.setItem('program',ID);
      this.props.history.push({
        pathname: "/courses-catalog/" + ID,
        state: { view: "courses", layout: layoutStyle },
      });
    }
    // else {
    //   window.location = "/modulesCatalog/" + this.props.programId + ID;
    // }
  }

  render() {
    console.log('program title =',this.props.title,'id =',this.props.id);
    return (
      <div class='card large_card mb-3 pad'>
        <div class='row g-0'>
          <div class='col'>
            <div class='card-body position-relative largeCard'>
              <h5 class='card-title'>{this.props.title}</h5>

              {/* <p class='card-text text-prop'>{this.props.description}</p> */}
              <a
                onClick={() => {
                  this.handleClick(this.props.id);
                }}
                type='button'
                class='stretched-link'></a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(LargeCard);
