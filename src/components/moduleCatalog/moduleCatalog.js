import React, { Component } from "react";
import NavBar from "../NavBar/NavBar";
import { withRouter } from "react-router-dom";
import ReactDOM from 'react-dom';
import SideBar from "./sideBar";
import dompurify from "dompurify";
import "./moduleCatalog.css";
import sideBar from "./sideBar";

var dropDownItems = "";
let courseInstanceId,
  programId,
  courseId;
let activeId="";
var mcontent = "";
class moduleCatalog extends Component {

  constructor(props){
    super(props);
    this.state = {active:"",list: [],loading: true};
  }

  componentDidMount() {
    var token = localStorage.getItem("token");
    // let courseId = window.location.pathname.replace("/modules-catalog/", "");
    courseInstanceId = this.props.match.params.courseInstanceId;
    courseId = this.props.match.params.courseId;
    programId = this.props.match.params.programId;
    console.log(courseId, programId);

    let link = `${process.env.REACT_APP_APIBASE_URL}/api/content/get/content-json/${courseInstanceId}/?token=${token}`;
    console.log(link);
    fetch(link, {
      method: "get",
    })
      .then((response) => response.text())
      .then((result) => {
        // console.log("result = ");
        // console.log(result);
        var json = JSON.parse(result);
        // console.log(json.contentJSON[0]);
        if (json.contentJSON !== "undefined") {
          this.setState({ list: json.contentJSON, loading: false });
        }
      })
      .catch((error) => console.log("error", error));
  }

  getactive(active,name,module) {
    activeId = name;
    console.log('active =',active,"activeId =",activeId);
    if (activeId === "") {
      this.setState({ active: name });
      this.setModuleDesc(module);
      return "moduleButton active";
    }
    if (active === activeId) {
      return "moduleButton active";
    }
    return "moduleButton";
  }

  setModuleDesc(mod) {
    mod = JSON.parse(mod);
    // this.setState({ desc: mod["desc"] });
    mcontent = (
      <div className="container">
      <div
      className='contentarea'
      dangerouslySetInnerHTML={{
        __html: dompurify.sanitize(mod['desc']),
      }}
    />
    </div>);
    // ReactDOM.render(content,document.getElementById('content'));
    // return content
  }

  setSubModule(moduleId, contents) {
    let ModuleItem = (props) => {
      return (
        <li className='sidebar_li'>
          <button
            className={this.getactive(props.activity,props.id,props.content)}
            onClick={() => {
              activeId = props.activity;
              this.setSubModuleDesciption(moduleId, props.content);
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

  setSubModuleDesciption(moduleId,contents){
    mcontent = (<sideBar mid={moduleId} pid={programId} cin={courseInstanceId} cid={courseId}>{contents}</sideBar>);
    this.setState({loading:false})
  }

  setmodules(sid,id,name,key,module,moduleContent) {
    // let sid = this.props.sid;
    let colapse = "colapse-" + sid;
    let head = "head-" + sid;
    return (
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
            {sid}. {name}
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
                  key={key}
                  className={this.getactive(name)}
                  onClick={() => {
                    activeId = name;
                    this.setState({ active: name });
                    this.setModuleDesc(JSON.stringify(module));
                  }}>
                  {"OverView"}
                </button>
              </li>
              {this.setSubModule(id,moduleContent)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  SetSideBar(list) {
    var sid = 0;
    dropDownItems = list.map((module) => {
      ++sid;
      let mod = this.setmodules(sid,module["module_id"],module["name"],module["module_id"],module,module.content);
      return mod;
      // return (
      //   <SideBar
      //     id={module["module_id"]}
      //     key={module["module_id"]}
      //     name={module["name"]}
      //     module={module}
      //     moduleContent={module.content}
      //     subModuledesc={this.setSubModuleDesciption}
      //     desc={this.setModuleDesc}
      //     sid={sid}></SideBar>
      // );
    });
  }

  render() {
    if (this.state.loading) {
      return <NavBar></NavBar>;
    }

    this.SetSideBar(this.state.list);
    return (
      <div>
        <NavBar></NavBar>

        <aside id='aside'>
          <div className='accordion ' id='accordionExample'>
            {dropDownItems}
          </div>
        </aside>
        <main id="content">
        {mcontent}
        </main>
      </div>
    );
  }

}

export default withRouter(moduleCatalog);
