import React, { Component } from "react";
import { withRouter } from "react-router";
let activeId = "";
class sideBar extends Component {
  getactive(active) {
    if (activeId === "") {
      activeId = this.props.name;
      this.setState({ active: this.props.name });
      this.props.desc(JSON.stringify(this.props.module));
      return "moduleButton activated";
    }
    if (active === activeId) {
      return "moduleButton activated";
    }
    return "moduleButton";
  }
  setSubModule(moduleId, contents) {
    let ModuleItem = (props) => {
      return (
        <li className='sidebar_li'>
          <button
            className={this.getactive(props.activity + this.props.id)}
            onClick={() => {
              activeId = props.activity + this.props.id;
              this.props.subModuledesc(moduleId, props.content);
            }}>
            {props.activity}
          </button>
        </li>
      );
    };
    let moduleToDisplay = contents?.map((content) => {
      return (
        <ModuleItem
          content={JSON.stringify(content)}
          id={content.activity_id}
          key={content.activity_id}
          activity={content.activity_name}></ModuleItem>
      );
    });
    return moduleToDisplay;
  }
  render() {
    console.log("sidebar render");
    let sid = this.props.sid;
    let colapse = "colapse-" + sid;
    let head = "head-" + sid;
    return (
      <>
        <div className='accordion-item'>
          <h2 className='accordion-header' id={head}>
            <button
              className={
                sid === 1 ? "accordion-button" : "accordion-button collapsed"
              }
              type='button'
              data-bs-toggle='collapse'
              data-bs-target={`#${colapse}`}
              aria-expanded='false'
              aria-controls={colapse}>
              {sid}. {this.props.name}
            </button>
          </h2>
          <div
            id={colapse}
            className={
              sid === 1
                ? "accordion-collapse collapse show"
                : "accordion-collapse collapse"
            }
            aria-labelledby={head}
            data-bs-parent='#accordionExample'>
            <div className='accordion-body' id='flow1'>
              <div>
                <li className='sidebar_li'>
                  <button
                    key={this.props.key}
                    className={this.getactive(this.props.name)}
                    onClick={() => {
                      activeId = this.props.name;
                      this.setState({ active: this.props.name });
                      this.props.desc(JSON.stringify(this.props.module));
                    }}>
                    {"OverView"}
                  </button>
                </li>
                {this.setSubModule(this.props.id, this.props.moduleContent)}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
export default withRouter(sideBar);
