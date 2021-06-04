import React, { Component } from "react";
import NavBar from "../NavBar/NavBar";
import { withRouter } from "react-router-dom";
import ReactDOM from 'react-dom';
import Quiz from './Quiz/Quiz';
import SideBar from "./sideBar";
import dompurify from "dompurify";
import { ReactVideo, YoutubePlayer } from "reactjs-media";
import Submission from "./submission";
import "./moduleCatalog.css";

var dropDownItems = "";
var moduleDescription;
var moduleData = {
  courseInstanceId: "",
  programId: "",
  courseId: "",
  activityId: "",
  questionId: "",
  moduleId: "",
  maxMarks: "",
  activityType: "",
};

// const { Component } = React;

class moduleCatalog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: null,
      loading: true,
    };
    this.setModuleDesc = this.setModuleDesc.bind(this);
    this.setSubModuleDesciption = this.setSubModuleDesciption.bind(this);
    // this.state.submission = this.submission.bind(this);
    // this.submitNow = this.submitNow.bind(this);
  }

  componentWillMount() {
    var token = localStorage.getItem("token");
    moduleData.courseInstanceId = this.props.match.params.courseInstanceId;
    moduleData.courseId = this.props.match.params.courseId;
    moduleData.programId = this.props.match.params.programId;
    // console.log(moduleData.courseId, moduleData.programId);

    let link = `${process.env.REACT_APP_APIBASE_URL}/api/content/get/content-json/${moduleData.courseInstanceId}/?token=${token}`;
    console.log(link);
    fetch(link, {
      method: "get",
    })
      .then((response) => response.text())
      .then((result) => {
        // //console.log("result = ");
        // console.log(result);
        var json = JSON.parse(result);
        // console.log(json.contentJSON[0]);
        if (json.contentJSON !== "undefined") {
          this.setState({ list: json.contentJSON, loading: false });
        }
      })
      .catch((error) => {
        console.log("error", error);
        this.setState({ loading: false });
      });
  }

  SetSideBar(list) {
    var sid = 0;
    dropDownItems = list.map((module) => {
      ++sid;
      return (
        <SideBar
          id={module["module_id"]}
          key={module["module_id"]}
          name={module["name"]}
          module={module}
          moduleContent={module.content}
          subModuledesc={this.setSubModuleDesciption}
          desc={this.setModuleDesc}
          sid={sid}></SideBar>
      );
    });
  }

  setSubModuleDesciption(Id, descript) {
    descript = JSON.parse(descript);
    console.log("module description = ",descript);
    moduleData.moduleId = Id;
    moduleData.activityId = descript['activity_id'];
    var description = descript["activity_json"];
    moduleData.activityId = descript["activity_id"];
    //  console.log(description);

    if (description[0]["activityType"] === "quiz") {
      description = JSON.stringify(description);
      moduleDescription = (
        <Quiz key={moduleData.activityId} data={moduleData}>
          {description}
        </Quiz>
      );
    } else if (description[0]["activityType"] === "assignment") {
      var html = "<div>";
      description.forEach((desc) => {
        //   console.log(desc);
        html = "<h1>" + html + desc["title"] + "</h1><br></br>";
        if (desc["text"] !== undefined) {
          html = html + desc["text"];
        } else if (desc["questions"]?.[0]) {
          moduleData.questionId = desc["questions"][0]["question_id"];
          moduleData.activityType = desc["activityType"];
          // console.log("qsId", moduleData.questionId);
          moduleData.maxMarks = desc["questions"][0]["max_marks"];
          html =
            html +
            desc["questions"][0]["questionText"][0]["text"] +
            "</a><br><br>" +
            "Max marks: " +
            desc["questions"][0]["max_marks"];
        }
      });
      html = html + "</div>";

      moduleDescription = (
        <div className='container'>
          <div
            className='contentarea'
            dangerouslySetInnerHTML={{
              __html: dompurify.sanitize(html),
            }}
          />
          <Submission
            key={moduleData.questionId}
            data={moduleData}></Submission>
        </div>
      );
      // console.log("submod,:", moduleDescription);
    } else if (description[0]["activityType"] === "notes") {
      console.log("notes");
      moduleData.activityId = descript["activity_id"];
      html = "<div>";
      description.forEach((desc) => {
        // console.log(desc);
        html = "<h1>" + html + desc["title"] + "</h1><br></br>";
        if (desc["text"] !== undefined) {
          html = html + desc["text"];
        }
      });
      html = html + "</div>";
      moduleDescription = (
        <div className='container'>
          <div
            className='contentarea'
            dangerouslySetInnerHTML={{
              __html: dompurify.sanitize(html),
            }}
          />
        </div>
      );
    } else if (
      description[0]["activityType"] === "youtubevideo" ||
      description[0]["activityType"] === "video"
    ) {
      //  console.log("youtube vedio");
      moduleData.activityId = descript["activity_id"];
      html = "<div>";
      description.forEach((desc) => {
        //  console.log(desc);
        html = "<h1>" + html + desc["title"] + "</h1><br></br>";
      });
      html = html + "</div>";
      var vedio = "";
      description.forEach((desc) => {
        if (description[0]["activityType"] === "youtubevideo") {
          vedio = "https://youtu.be/" + desc["videoURL"];

          moduleDescription = (
            <div>
              <div
                dangerouslySetInnerHTML={{
                  __html: dompurify.sanitize(html),
                }}
              />
              <div className='player-wrapper'>
                <YoutubePlayer
                  src={vedio} // Reqiured
                  allowFullScreen='true'
                  width={850}
                  height={600}
                />
              </div>
            </div>
          );
        } else {
          vedio = desc["videoURL"];
          moduleDescription = (
            <div>
              <div
                dangerouslySetInnerHTML={{
                  __html: dompurify.sanitize(html),
                }}
              />
              <div className='player-wrapper'>
                <ReactVideo
                  src={vedio} // Reqiured
                  width={450}
                  height={600}
                  primaryColor='red'
                  type='video/mp4'
                  allowFullScreen='true'
                />
              </div>
            </div>
          );
        }
      });
    }
    this.setState({ loading: false });
  }

  setModuleDesc(mod) {
    mod = JSON.parse(mod);
    // console.log("in desc");
    moduleDescription = (
      <div className='container'>
        <div
          className='contentarea'
          dangerouslySetInnerHTML={{
            __html: dompurify.sanitize(mod["desc"]),
          }}
        />
      </div>
    );
    this.setState({ loading: false });
  }

  render() {
    // console.log("module render");

    var user = localStorage.getItem("token");
        user ??
        this.props.history.push({
            pathname: "/",
        });

    if (this.state.loading) {
      return (
        <>
          <NavBar />
          <div class='spinner-border' role='status'>
            <span class='visually-hidden'>Loading...</span>
          </div>
        </>
      );
    }
    if (this.state.list === null)
      return (
        <>
          <div className='nodata container mt-5'>
            <NavBar />
            <div class='alert alert-dark' role='alert'>
              <h4 class='alert-heading'>No Modules to display</h4>
              <p>You are not enrolled in this Program</p>
              <hr></hr>
              <p class='mb-0'>
                Kindly, contact your mentor for more Information.
              </p>
            </div>
          </div>
        </>
      );
    this.SetSideBar(this.state.list);
    // console.log(moduleData.questionId);
    return (
      <div>
        <NavBar></NavBar>
        <aside id='aside'>
          <div className='accordion ' id='accordionExample'>
            {dropDownItems}
          </div>
        </aside>
        <main id='content'>
          {moduleDescription}
          <div></div>
        </main>
      </div>
    );
  }
}

export default withRouter(moduleCatalog);
