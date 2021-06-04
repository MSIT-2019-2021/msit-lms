import { render } from "enzyme";
import React, { Component } from "react";
import { withRouter } from "react-router";

var moduleData = "";

var time, evaluationStatus, awardedMarks;

class submission extends Component {
  constructor(props) {
    super(props);
    moduleData = props.data;
    console.log("moduleData:", moduleData);
    this.state = {
      verifySubmission: "",
      loading: true,
    };
    this.submitNow = this.submitNow.bind(this);
  }
  async verifySubmission() {
    console.log("verify submit");
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    await fetch(
      `${
        process.env.REACT_APP_APIBASE_URL
      }/api/activityresponse/latest/${localStorage.getItem("id")}/${
        moduleData.programId
      }/${moduleData.courseId}/${moduleData.courseInstanceId}/${
        moduleData.moduleId
      }/${moduleData.activityId}/${
        moduleData.questionId
      }?token=${localStorage.getItem("token")}`,
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        result = JSON.parse(result);
        //console.log("result", result);
        try {
          if (
            this.state.verifySubmission === "" ||
            this.state.verifySubmission !== result["response"]["assignment"]
          ) {
            const formatDate = (dateString) => {
              const options = {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
              };
              return new Date(dateString).toLocaleDateString("en-GB", options);
            };
            time = formatDate(result.timestamp);

            evaluationStatus = result.evaluationStatus;
            awardedMarks = evaluationStatus
              ? result.awardedMarks
              : "Yet to Evaluate Submission";
            this.setState({
              loading: false,
              verifySubmission: result["response"]["assignment"],
            });

            console.log(time);
          }
        } catch (error) {
          this.setState({
            loading: false,
          });
        }
      })
      .catch((error) => console.log("error", error));
  }

  async submitNow() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    moduleData = {
      ...moduleData,
      response: {
        assignment: document.getElementById("submitLink").value,
      },
    };
    // console.log(moduleData);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(moduleData),
      redirect: "follow",
    };

    await fetch(
      `${
        process.env.REACT_APP_APIBASE_URL
      }/api/activityresponse/insert/?token=${localStorage.getItem("token")}`,
      requestOptions
    )
      .then((response) => {
        response.text();
        //this.setState({ verifySubmission: "" });
        this.setState({ loading: true });
      })
      .catch((error) => console.log("error", error));
  }

  render() {
    if (moduleData.activityType === "assignment") {
      // console.log("load", this.state.loading);
      if (this.state.loading) {
        this.verifySubmission();
        return (
          <div class='spinner-border' role='status'>
            <span class='visually-hidden'>Loading...</span>
          </div>
        );
      }

      // console.log("verify submit: ", this.state.verifySubmission);

      if (this.state.verifySubmission === "") {
        const submitLink = (
          <div className='submission'>
            <form autoComplete='off'>
              <input
                className='submitBox'
                type='text'
                name='submitLink'
                id='submitLink'
                placeholder='paste your submission link here'
              />
              <button id='link-submit' type='button' onClick={this.submitNow}>
                submit
              </button>
            </form>
          </div>
        );
        return submitLink;
      } else {
        const submitLink = (
          <div className='submission'>
            <form autoComplete='off'>
              <input
                className='submitBox'
                type='text'
                name='submitLink'
                id='submitLink'
                value={this.state.verifySubmission}
                disabled
              />

              <div id='submitTime'>Submitted at : {time}</div>
              <div id='submitTime'>Awarded Marks : {awardedMarks}</div>

              {evaluationStatus === false && (
                <button
                  id='link-submit'
                  type='button'
                  onClick={(e) => {
                    this.setState({ verifySubmission: "" });
                  }}>
                  TryAgain
                </button>
              )}
            </form>
          </div>
        );
        return submitLink;
      }
    } else return "";
  }
}

export default withRouter(submission);
