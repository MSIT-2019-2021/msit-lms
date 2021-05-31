import React, { Component } from "react";
import NavBar from '../NavBar/NavBar';
import ReactDOM from 'react-dom';
import './CourseStatus.css'

var pid = "";
var cid = "";
var ptitle = "Select Program";
var ctitle = "Select Course";
var loading = true;
var load = (<div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
                </div>);
class CourseStatus extends Component {

  constructor(props) {
    super(props);
    this.state = {
      plist: [],
      clist:[],
      cselect:""
    };
  }

  componentWillMount(){
    this.chartAuthorize()
    // setInterval(this.chartAuthorize, 100000);
  }

  componentWillUnmount(){
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    
    fetch(`${process.env.REACT_APP_API_URL2}/deauth`, requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
  }

  async chartAuthorize(){


      var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };

      fetch(process.env.REACT_APP_API_URL2+`/auth/${localStorage.getItem('id')}/${localStorage.getItem("token")}`, requestOptions)
        .then(response => response.text())
        .then(result => {
          result = JSON.parse(result);
          console.log(result);
          if(result['state'] === "Invalid" ){
              throw "Invalid credentials";
          }
          this.getPrograms();
        })
        .catch(error => {console.log('error', error)});

  }


  getPrograms() {
    var token = localStorage.getItem("token");
    var userID = localStorage.getItem("id");
    console.log(process.env.REACT_APP_APIBASE_URL);
    fetch(
      process.env.REACT_APP_APIBASE_URL +
        "/api/program/get/enrolled_programs/" +
        userID +
        "/?token=" +
        token
    )
      .then((response) => response.text())
      .then((result) => {
        var json = JSON.parse(result);
        // json = json[0]['enrollments'];
        console.log("get programs api fetched");
        console.log(json[0]["enrollments"])
        // console.log(json);
        if (json[0]["enrollments"][0]["programID"] !== null) {
          // console.log(json[0]["enrollments"]);
          // this.setCourse(json[0]['enrollments'])
          loading = false;
          this.setState({ plist: json[0]["enrollments"]});
        }
      })
      .catch((error) => {
        console.log("error", error);
        loading = false ;
      });
  }

  // setCourse(progs){

  // }

  getCourses() {

      ReactDOM.render(load,document.getElementById("Images"));
      ReactDOM.render(load,document.getElementById("Tables"));
      // program = document.getElementById("programs");
      // var programID = program.options[program.selectedIndex].value;
      var token = localStorage.getItem("token");
      var userID = localStorage.getItem("id");
      var program = document.getElementById("program");

      pid = program.options[program.selectedIndex].value;
      ptitle = program.options[program.selectedIndex].text;
    
    if(ptitle === "Select Program" | ptitle === "No programs to display"){
      alert('selected program is not a valid program');
      return;
    }
    
      // programID = localStorage.getItem("program");
      // programID = this.props.match.params.programId
      console.log("pid =",pid,"ptitle =",ptitle);
      console.log(
        `course fetch api = ${process.env.REACT_APP_APIBASE_URL}/api/course/get/courseinfo/${userID}/${pid}/?token=${token}`
      );
      fetch(
        process.env.REACT_APP_APIBASE_URL +
          "/api/course/get/courseinfo/" +
          userID +
          "/" +
          pid +
          "/?token=" +
          token
      ).then((response) => response.text())
      .then((result) => {
          console.log(`course result =`);
          console.log(result);
          var json = JSON.parse(result);
          // json = json[0]['enrollments'];
          console.log("course data");
          console.log(json);

          if (json["courses"].length !== 0) {
              
            json['courses'] = json['courses'].map(course => {

              course['courseInstances'] = course['courseInstances'].filter((obj) => {
                return obj["isLive"] === true;
              });

              // console.log('mapped course =');
              // console.log(course)
              return course;
            });

            json['courses'] = json['courses'].filter((obj) => {
              // console.log('filtering courses =');
              // console.log(obj)
              // console.log('course instance details =');
              // console.log(obj['courseInstances']);
              return obj['courseInstances'].length !== 0;
            });

              loading = false;
              ReactDOM.render("",document.getElementById("Images"));
              ReactDOM.render("",document.getElementById("Tables"));
              this.setState({clist:json['courses'],cselect:pid})
          }
          else{

            loading = false;
            var info = [{_id:"1" ,courseInstances:"No active courses in this program", courseID: {courseName:"No active courses in this program"}}]
            ReactDOM.render("",document.getElementById("Images"));
            ReactDOM.render("",document.getElementById("Tables"));
            this.setState({clist:info,cselect:pid})
          }
        })
        .catch((error) => {
          console.log("error", error)
      });
  }

  charts(){
    ReactDOM.render("",document.getElementById("Images"));
    ReactDOM.render("",document.getElementById("Tables"));
    
    var program = document.getElementById("program");
    pid = program.options[program.selectedIndex].value;
    ptitle = program.options[program.selectedIndex].text;
    
    if(ptitle === "Select Program" | ptitle === "No programs to display"){
      alert('selected program is not a valid program');
      return;
    }

    var PTitle = ptitle.split(' ').join('zzz');
    if(this.state.cselect === ""){

      ReactDOM.render(load,document.getElementById("Images"));
      ReactDOM.render(load,document.getElementById("Tables"));

        var requestOptions = {
          method: 'POST',
          redirect: 'follow'
        };

        // var PTitle = ptitle.replace(" ", "zzz");
        console.log("prog charts api =",`${process.env.REACT_APP_API_URL2}/program/activityscore/${PTitle}`)
        fetch(`${process.env.REACT_APP_API_URL2}/program/activityscore/${PTitle}`, requestOptions)
          .then(response => response.text())
          .then(result => {
            console.log(result)
            result = JSON.parse(result);
            var images = result[0];
            
            var img_keys = ["area","bar","scatter"];
            images = img_keys.map(img => {
              var value = images[img];
              value = `data:image/png;base64,${value}`;
              return (<div className="row img-row-adjust"><img className="image-adjust" src={value} alt={img} /></div>);
            });

            var tables = result[1];
            var tab_keys = ["coursetable","programtable","pietable","bartable","scattertable"]
            tables = tab_keys.map(tab => {
              var value = tables[tab];
              return <div className="row" dangerouslySetInnerHTML={{ __html: value}}/>
            })
            loading = false;
            ReactDOM.render(images,document.getElementById("Images"));
            ReactDOM.render(tables,document.getElementById("Tables"));
          
          })
          .catch(error => console.log('error', error));
    }else{

      var program = document.getElementById("subselect");
      if(program === null){
        alert('select a course to proceed');
        return;
      }
      var cid = program.options[program.selectedIndex].value;
      var ctitle = program.options[program.selectedIndex].text;

      if(ctitle === "Select Course" | ctitle === "No active courses in this program"){
        alert('select a valid course');
        return;
      }

      console.log("cid =",cid,"ctitle =",ctitle);

      ReactDOM.render(load,document.getElementById("Images"));
      ReactDOM.render(load,document.getElementById("Tables"));

      // document.getElementById("course").disabled = true;

      var requestOptions = {
        method: 'POST',
        redirect: 'follow'
      };
      // var PTitle = ptitle.replace(" ", "zzz");
      var CTitle = ctitle.split(' ').join('zzz');
      let token = localStorage.getItem('token');
        console.log("prog charts api =",`${process.env.REACT_APP_API_URL2}/course/activityscore/${PTitle}/${CTitle}/${cid}/${token}`)
        fetch(`${process.env.REACT_APP_API_URL2}/course/activityscore/${PTitle}/${CTitle}/${cid}/${token}`, requestOptions)
          .then(response => response.text())
          .then(result => {
            console.log(result)
            result = JSON.parse(result);
            var images = result[0];
            
            var img_keys = ["area","bar","scatter"];
            images = img_keys.map(img => {
              var value = images[img];
              value = `data:image/png;base64,${value}`;
              return (<div className="row img-row-adjust"><img className="image-adjust" src={value} alt={img} /></div>);
            });

            var tables = result[1];
            var tab_keys = ["coursetable","moduletable","pietable","bartable","scattertable"]
            tables = tab_keys.map(tab => {
              var value = tables[tab];
              return <div className="row" dangerouslySetInnerHTML={{ __html: value}}/>
            })
            loading = false;
            ReactDOM.render(images,document.getElementById("Images"));
            ReactDOM.render(tables,document.getElementById("Tables"));
          
          })
          .catch(error => console.log('error', error));

    }
  }

  handleChange(){
    var program = document.getElementById("course");
    var subcid = program.options[program.selectedIndex].value;
    var subctitle = program.options[program.selectedIndex].text;

    if(subctitle === "Select Course" | subctitle === "No active courses in this program"){
      alert('select a valid course');
      return;
    }

    subcid = JSON.parse(subcid)
    // console.log("subcid =",subcid)
    var subcourses = subcid.map((obj,ind,arr)=>{
      console.log('obj =',obj)
      if(ind === 0){
        return <option defaultValue={obj["_id"]} value={obj["_id"]} key={obj["_id"]}>{obj["courseInstanceLabel"]}</option>
      }
      return <option value={obj["_id"]} key={obj["_id"]}>{obj["courseInstanceLabel"]}</option>
    });

    subcid = (<select id="subselect" className="form-select">{subcourses}</select>);
    ReactDOM.render(subcid,document.getElementById("subcourse"));

  }

  card(){
    console.log(`cselect print = ${this.state.cselect} card pid print = ${pid}`);
    loading = true; 
    var list = this.state.plist;
    // list = list.filter((obj) => {
    //       return obj["programID"]["_id"] !== pid
    //     });

    // console.log("list after program filter");
    // console.log(list);
    if(list.length === 0){
      list = (<option value="No programs to display">No programs to display</option>);
    }
    else{
    list = list.map((program) => {
          return <option value={program["programID"]["_id"]} key={program["programID"]["_id"]}>{program["programID"]["programName"]}</option>
        });
    }

    console.log("list after program map");
    console.log(list);

      if(this.state.cselect === ""){

        return (
        <div className="col">
        <div id="selection" class="card-body position-relative">
        <div class="row gx-5">
        <div class="col-sm">
        <select id="program" class="form-select" aria-label={ptitle}>
        <option defaultValue={pid}>{ptitle}</option>
        {list}
        </select>
        </div>
    <div class="col-sm">
    <button type="button" class="btn btn-primary" onClick={()=>{this.getCourses();}}>Select Course</button>
    </div>
    <div class="col-sm">
    <button type="button" class="btn btn-primary" onClick={() =>{this.charts()}}>Enter</button>
    </div>
  </div>
      </div>
      </div>);
      }
      else if (this.state.cselect === pid){
        var clist = this.state.clist ;
        console.log('course list  = ');
        console.log(clist)
        if(clist.length !== 0){
          clist = clist.map((program) => {
          console.log('course instances =',program["courseInstances"]);
          return <option value={JSON.stringify(program["courseInstances"])} key={program["_id"]}>{program['courseID']['courseName']}</option>
          });
        }else{
          clist = (<option>No active courses in this program</option>);
        }

        return (
          <div className="col">
          <div class="card-body position-relative">
          <div class="row gx-5">
          <div class="col-sm">
          <select id="program" class="form-select" aria-label={ptitle} disabled>
          <option defaultValue={pid}>{ptitle}</option>
          {list}
          </select>
          </div>
          <div class="col-sm">
          <select id="course" class="form-select" aria-label="Select Course" onChange={this.handleChange}>
          <option defaultValue={cid}>{ctitle}</option>
          {clist}
          </select>
          </div>
          <div id="subcourse" className="col-sm">

          </div>
      <div class="col-sm">
      <button type="button" class="btn btn-primary" onClick={() => {ReactDOM.render("",document.getElementById("subcourse"));pid="Select Program"; ptitle="Select Program";this.setState({cselect: ""}); ctitle="Select Course"; cid=ctitle; loading = false; }}>Back</button>
      </div>
      <div class="col-sm">
      <button type="button" class="btn btn-primary" onClick={() => {this.charts()}}>Enter</button>
      </div>
    </div>
        </div>
        </div>);
      }
  }

  render() {
    if(loading){
      console.log("in render loading")
      return (<div className="container">
            <NavBar></NavBar>
            <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
            </div>
            </div>);
    }
    loading = true;
    var card = this.card();
    return (<div className="container con-adjust">
            <NavBar></NavBar>
            <div className="row">
            {card}
            </div>
    <div className="row row-adjust">
    <div className="col">
      <div id="Images" className="overflow-scroll flow-adjust">
      </div>
    </div>
    <div className="col">
      <div id="Tables" className="overflow-scroll flow-adjust">
      </div>
    </div>
    </div>
  </div>);
  }
}

export default CourseStatus;
