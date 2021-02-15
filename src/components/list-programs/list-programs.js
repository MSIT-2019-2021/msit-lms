import React, { Component} from 'react'

class ListPrograms extends Component{
  constructor(props){
    super(props);
  }  
  render(){
    return (
            <div class="accordion-item">
                <h2 class="accordion-header" id="headingOne">
                    <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                        {this.props.title}
                    </button>
                </h2>
                <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                <div class="accordion-body">
                    <div>
                        <img src={this.props.image} />
                    </div>
                        <p>{this.props.description}</p>
                </div>
                <div>
                    <button type="button" class="btn btn-outline-primary" className="button1">{this.props.button}</button>
                </div>
                </div>
            </div>
    );
}
}
export default ListPrograms;
