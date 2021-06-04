import React, { Component } from "react";
import NavBar from '../NavBar/NavBar';
import { Link, withRouter } from "react-router-dom";
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

var info = (
    <div class='alert alert-dark alert-adjust position-absolute top-50 start-50 translate-middle' role='alert'>
      <h4 class='alert-heading'>No Data available for the selection</h4>
      <hr></hr>
      <p class='mb-0'>Kindly, contact your mentor for more Information.</p>
    </div>);
    

class CourseStatus extends Component {

  constructor(props) {
    super(props);
    this.state = {
      plist: [],
      clist:[],
      cselect:""
    };
    // this.chartAuthorize();
  }

  componentDidMount(){

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

  chartAuthorize(){


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
          else{
          this.getPrograms(result['programs']);
          }
        })
        .catch(error => {console.log('error', error)});

  }


  getPrograms(programs) {

    loading = false;
    this.setState({ plist: programs});

  }

  // setCourse(progs){

  // }

  getCourses() {

    ReactDOM.render("",document.getElementById("content"));

      var program = document.getElementById("program");

      pid = program.options[program.selectedIndex].value;
      ptitle = program.options[program.selectedIndex].text;
    
    if(ptitle === "Select Program" | ptitle === "No programs to display"){
      alert('selected program is not a valid program');
      return;
    }
    
    loading = false;
    this.setState({clist:pid,cselect:pid});

  }

  charts(){

    ReactDOM.render("",document.getElementById("content"));
    var program = document.getElementById("program");
    pid = program.options[program.selectedIndex].value;
    ptitle = program.options[program.selectedIndex].text;
    
    if(ptitle === "Select Program" | ptitle === "No programs to display"){
      alert('selected program is not a valid program');
      return;
    }

    var PTitle = ptitle.split(' ').join('zzz');
    if(this.state.cselect === ""){

      ReactDOM.render(load,document.getElementById("content"));

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

            if(result['state'] !== undefined & result['state'] === "data not found"){
              ReactDOM.render(info,document.getElementById("content"));
              return;
            }

            var images = result[0];
            
            // var img_keys = ["pie","area","bar","scatter"];
            var img_keys = ["area","bar","scatter"];
            images = img_keys.map((img,ind,arr) => {
              var value = images[img];
              value = `data:image/png;base64,${value}`;

              if(ind === 0){
                return (<div class="carousel-item active"><img className='flow-adjust' src={value} alt={img} /></div>);
              }

              return (<div class="carousel-item"><img className='flow-adjust' src={value} alt={img} /></div>);
            });

            var tables = result[1];
            var tab_keys = ["coursetable","programtable","evaltable","bartable","scattertable"]
            tables = tab_keys.map(tab => {
              var value = tables[tab];
              return <div className="row" dangerouslySetInnerHTML={{ __html: value}}/>
            })
            loading = false;
            var content = (<div className="container">
                        <div id="carouselExampleFade" class="carousel slide carousel-fade carousel-adjust" data-bs-ride="carousel">
                          <div class="carousel-inner">
                            {images}
                          </div>
                          <button class="carousel-control-prev carousel-btn" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="prev">
                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Previous</span>
                          </button>
                          <button class="carousel-control-next carousel-btn" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="next">
                            <span class="carousel-control-next-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Next</span>
                          </button>
                      </div>{tables}</div>);
            ReactDOM.render(content,document.getElementById("content"));
          
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

      ReactDOM.render(load,document.getElementById("content"));

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

            if(result['state'] !== undefined & result['state'] === "data not found"){
              ReactDOM.render(info,document.getElementById("content"));
              return;
            }

            var images = result[0];
            
            // var img_keys = ["pie","area","bar","scatter"];
            var img_keys = ["area","bar","scatter"];
            images = img_keys.map((img,ind,arr) => {
              var value = images[img];
              value = `data:image/png;base64,${value}`;

              if(ind === 0){
                return (<div class="carousel-item active"><img className='flow-adjust' src={value} alt={img} /></div>);
              }

              return (<div class="carousel-item"><img className='flow-adjust' src={value} alt={img} /></div>);
            });

            var tables = result[1];
            var tab_keys = ["coursetable","moduletable","evaltable","bartable","scattertable"]
            tables = tab_keys.map(tab => {
              var value = tables[tab];
              return <div className="row" dangerouslySetInnerHTML={{ __html: value}}/>
            })

            loading = false;
            var content = (<div className="container">
                        <div id="carouselExampleFade" class="carousel slide carousel-fade carousel-adjust" data-bs-ride="carousel">
                          <div class="carousel-inner">
                            {images}
                          </div>
                          <button class="carousel-control-prev carousel-btn" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="prev">
                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Previous</span>
                          </button>
                          <button class="carousel-control-next carousel-btn" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="next">
                            <span class="carousel-control-next-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Next</span>
                          </button>
                      </div>{tables}</div>);
            ReactDOM.render(content,document.getElementById("content"));
          
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
        return <option defaultValue={obj["id"]} value={obj["id"]} key={obj["id"]}>{obj["instance"]}</option>
      }
      return <option value={obj["id"]} key={obj["id"]}>{obj["instance"]}</option>
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
    list = list.map((program,ind,arr) => {
          var courses = JSON.stringify(program['Courses']);
          var key = `P${ind}`;
          return <option value={courses} key={key}>{program["program"]}</option>
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
    <button type="button" class="btn stat-button" onClick={()=>{this.getCourses();}}>Select Course</button>
    </div>
    <div class="col-sm">
    <button type="button" class="btn stat-button" onClick={() =>{this.charts()}}>Enter</button>
    </div>
  </div>
      </div>
      </div>);
      }
      else if (this.state.cselect === pid){
        var clist = this.state.clist ;
        clist = JSON.parse(clist);
        console.log('course list  = ');
        console.log(clist)
        if(clist.length !== 0){
          clist = clist.map((program,ind,arr) => {
          var key  = `C${ind}`
          return <option value={JSON.stringify(program["instances"])} key={key}>{program['Course']}</option>
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
      <button type="button" class="btn stat-button" onClick={() => {ReactDOM.render("",document.getElementById("subcourse"));ReactDOM.render("",document.getElementById("content"));pid="Select Program"; ptitle="Select Program";this.setState({cselect: ""}); ctitle="Select Course"; cid=ctitle; loading = false; }}>Back</button>
      </div>
      <div class="col-sm">
      <button type="button" class="btn stat-button" onClick={() => {this.charts()}}>Enter</button>
      </div>
    </div>
        </div>
        </div>);
      }
  }

  render() {

    var user = localStorage.getItem("token");
        user ??
        this.props.history.push({
            pathname: "/",
        });

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
    <div id="content" className="content position-relative">
    
  </div>
  </div>);
  }
}

export default withRouter(CourseStatus);
