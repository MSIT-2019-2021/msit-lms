import React, { Component } from 'react'
import './list-programs.css'

class ListPrograms extends Component{
    render() {
        return(
            <div className="accordion" id="accordionExample">
                <div className="accordion-item">
                <h2 className="accordion-header" id="headingOne">
                    <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                        {this.props.title}
                    </button>
                </h2>
                <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                    <div className="row">
                        <div className="col-sm-1">
                            <img src="{this.props.image}" />
                        </div>
                        <div className="accordion-body" className="col-sm-10">
                            {this.props.description}
                        </div>
                    </div>
                </div>
                <div>
                    <button type="button" class="btn btn-primary" className="button1">{this.props.button}</button>
                </div>
                </div>    
            </div>
        )
    }
}

export default ListPrograms;