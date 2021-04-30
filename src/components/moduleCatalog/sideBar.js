import React, { Component } from "react";
import { withRouter } from "react-router";
import Quiz from './Quiz/Quiz';
import dompurify from 'dompurify';

var descType = "";
var content = "";

let  activityId,
  questionId,
  maxMarks,
  activityType;

class sideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      desc: "",
      list: null,
      loading: true,
      submitLink: "",
    };
  }

  setSubModuleDesciption(Id, descript) {

    // ReactDOM.render("",document.getElementById('content'));
    descript = JSON.parse(descript);
    console.log(descript);
    var description = descript["activity_json"];
    console.log(description);


    console.log(`switch assignment condition ${(description[0]['activityType']=== "assignment")}`);
    if(description[0]['activityType']==="quiz"){
      description = JSON.stringify(description);
      content = (<Quiz mid={Id}>{description}</Quiz>);
      // ReactDOM.render(content,document.getElementById('content'));
    }else if(description[0]['activityType']==="assignment"){
      console.log('in assignment case');
        activityId = descript["activity_id"];
        var html = "<div>";
        description.forEach((desc) => {
          console.log(desc);
          html = "<h1>" + html + desc["title"] + "</h1><br></br>";
          if (desc["text"] !== undefined) {
            html = html + desc["text"];
            descType = "";
          } else if (desc["questions"] ?? [0] === "undefined") {
            descType = desc["questions"][0]["questionType"];
            questionId = desc["questions"][0]["question_id"];
            activityType = desc["activityType"];
            console.log("qsId", questionId);
            maxMarks = desc["questions"][0]["max_marks"];
            html =
              html +
              desc["questions"][0]["questionText"][0]["text"] +
              "</a><br><br>" +
              "Max marks: " +
              desc["questions"][0]["max_marks"];
          }
        });
        html = html + "</div>";
        content = (
          <div className="container">
          <div
          className='contentarea'
          dangerouslySetInnerHTML={{
            __html: dompurify.sanitize(html),
          }}
        />
        <div>{this.submission()}</div>
        </div>);
        // ReactDOM.render(content,document.getElementById('content'));
    }

  }

  submission() {
    // console.log("DESC", descType);
    if (descType === "filesubmission") {
      let submitLink = (
        <div className='submission'>
          <form>
            <input
              id="submit"
              className='submitBox'
              type='text'
              name='submitLink'
              placeholder='paste your submission link here'
            />
            <button id='link-submit' type='button' onClick={this.submitNow}>
              submit
            </button>
          </form>
        </div>
      );
      descType = "";
      return submitLink;
    } else return "";
  }
  submitNow() {
    console.log(" submission link =",document.getElementById('submit').value);
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      programId: this.props.pid,
      courseInstanceId: this.props.cin,
      courseId: this.props.cid,
      moduleId: this.props.mid,
      activityType: activityType,
      activityId: activityId,
      questionId: questionId,
      response: {
        assignment: document.getElementById('submit').value,
      },
      maxMarks: maxMarks,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(
      `${process.env.REACT_APP_APIBASE_URL}/api/activityresponse/insert/?token=${localStorage.getItem('token')}`,
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
  }

  
  render(){
    this.setSubModuleDesciption(this.props.mid,this.props.children);
    return (<div className="container">{content}</div>)
  }

}
export default withRouter(sideBar);
