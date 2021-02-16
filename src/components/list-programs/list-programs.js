import React, { Component} from 'react'
import './list-programs.css';

class ListPrograms extends Component{
  render(){
    return (
        <div className="accordion-item">
        <h2 className="accordion-header" id="headingOne">
          <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
            {this.props.title}
          </button>
        </h2>
        <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
    
          <div className="accordion-body" id="flow1">
              <div>
                  <img classNameName="flow" src={this.props.image} />
              </div>
            <div>
            <p className="flow2">{this.props.description}</p>
            </div>
              <button type="button" className="btn btn-outline-primary" style="float: right;">{this.props.button}</button>
              
          </div>
          
        </div>
      </div>
    );
}
}
export default ListPrograms;