import React, { Component } from "react";
import ReactDOM from "react-dom";
import dompurify from "dompurify";
import './Quiz.css';

var questions = "";
var size = 0;
let qsize = 0;
var submit = true;
var contents;

class Quiz extends Component {
  constructor(props){
    super(props);
    this.state = {
      loading: true
    };
    // this.child = React.createRef();
    this.submission = this.submission.bind(this);
  }

  componentDidMount(){
    contents = JSON.parse(this.props.children);
    contents = contents[0];
    qsize = contents['questions'].length;
    var correct,reached,result;
    contents['questions'] = contents['questions'].map((con,ind,arr) => {
      [correct,reached,result] = this.getSubmitted(con['question_id'],ind+1);
      con['result'] = result;
      console.log('content after mapping =',con);
      return con;
    });

    if(reached === true){
      this.setState({loading: false});
    }

  }

  getSubmitted(qid,item){
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    var correct,json;
    var reached = false;
    fetch(`${process.env.REACT_APP_APIBASE_URL}/api/activityresponse/latest/${localStorage.getItem('id')}/${this.props.pid}/${this.props.cid}/${this.props.cin}/${this.props.mid}/${this.props.aid}/${qid}?token=${localStorage.getItem('token')}`, requestOptions)
      .then(response => response.text())
      .then(result =>{
        console.log('result fetched in quiz api =',result);
        result = JSON.parse(result);
        if(result['error'] !== undefined & result['error'] === 'not found'){
          correct = result['error'];
        }
        else if(result['result']!==null & result['result']!==undefined){
          correct = result['result'];
        }
        else{
          correct = result['error'];
        }
        json = result;

        if(item === qsize){
          reached = true;
        }

      })
      .catch(error => console.log('error', error));

    console.log('correct in submitted =',correct);

    return [correct,reached,json];
  }

  setQuiz(){
    size = 0;

    console.log('in quiz app contents = ')
    console.log(contents)
        var correct,reached,json;
        var content = contents['questions'].map(con =>{
          size = size + 1;
          let question = `${size}) `;
          con['questionText'].forEach((item,ind) => {
            (item['text'] === null | item['text'] === undefined)? 
            question = question + '<img src="'+`${item['image']['imageSRC']}`+'"></img>'
            :question = question + item['text']
          });
          var op = 0;
          console.log('question id = ',con['question_id'])
          
          let options = con['options'].map(opt => {
                op = op+1;
                let ouniq = `OPT${size}${op}`;
                correct = con['result']['result'];
                console.log(`correct = ${correct}`)
                if(correct === true | correct === false){
                  console.log(`opt correct ${opt['correct']}`)
                  if(opt['correct'] === true){
                    return (<div key={ouniq} class="form-check">
                        <input className="form-check-input" type="checkbox" defaultChecked={true} QID={con['question_id']} data={opt['option']} value={opt['correct']} disabled></input>
                        <label className="form-check-label" for="flexCheckDefault">
                          {opt['option']}
                        </label>
                      </div>);
                  }
                  return (<div key={ouniq} class="form-check">
                        <input className="form-check-input" type="checkbox" QID={con['question_id']} data={opt['option']} value={opt['correct']} disabled></input>
                        <label className="form-check-label" for="flexCheckDefault">
                          {opt['option']}
                        </label>
                      </div>);
                }
                return (<div key={ouniq} class="form-check">
                <input className="form-check-input" type="checkbox" QID={con['question_id']} data={opt['option']} value={opt['correct']}></input>
                <label className="form-check-label" for="flexCheckDefault">
                  {opt['option']}
                </label>
              </div>);
          });

          let uniq = `QZ${size}`;


          if(correct === true){
                return (<div key={uniq} className="card border-primary mb-3 custom-card">
              <div
              className='card-header bg-transparent border-success'
              dangerouslySetInnerHTML={{
                __html: dompurify.sanitize(question),
              }}
            />
              <div className="card-body" id={"Q"+size.toString()}>
                {options}
              </div>
              <div className="card-footer bg-transparent border-success" id={"Sub"+size.toString()}><p className="text-start">
              Score: {json['awardedMarks']}</p><p className="text-success text-center">Correct</p>
              <p className="text-end">submitted on {json['timestamp']}</p></div>
              </div>);
          }else if(correct === false){
            return (<div key={uniq} className="card border-primary mb-3 custom-card">
          <div
          className='card-header bg-transparent border-success'
          dangerouslySetInnerHTML={{
            __html: dompurify.sanitize(question),
          }}
        />
          <div className="card-body" id={"Q"+size.toString()}>
            {options}
          </div>
          <div className="card-footer bg-transparent border-success" id={"Sub"+size.toString()}><p className="text-start">
          Score: {json['awardedMarks']}</p><p className="text-success text-danger">Incorrect</p>
          <p className="text-end">submitted on {json['timestamp']}</p></div>
          </div>);
      }

          return (<div key={uniq} className="card border-primary mb-3 custom-card">
          <div
          className='card-header bg-transparent border-success'
          dangerouslySetInnerHTML={{
            __html: dompurify.sanitize(question),
          }}
        />
          <div className="card-body" id={"Q"+size.toString()}>
            {options}
          <button className="btn-primary custom-btn" id={`Btn${size}`} type="button" onClick={() => {this.submission(size.toString())}}>Submit</button>
          </div>
          <div className="card-footer bg-transparent border-success" id={"Sub"+size.toString()}></div>
          </div>);

        });

        questions = (<div class="col">
          {content}
        </div>);

        console.log('reached = ',reached)



  }

  postToDB(options,correct){

    var qid = "";
    options = options.map((opt) => {

      qid = opt.getAttribute('qid')
      return {option: opt.getAttribute('data'),
              selected: opt.checked}
    });

    var response = {choices: options}

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      programId: this.props.pid,
      courseInstanceId: this.props.cin,
      courseId: this.props.cid,
      moduleId: this.props.mid,
      activityType: "quiz",
      activityId: this.props.aid,
      questionId: qid,
      response: response,
      result: correct,
      maxMarks: 1
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

  submission(ind){
    // ind = parseInt(ind);
      console.log('index selected =',ind);
      var question = document.getElementById('Q'+ind);
      var options = [...question.getElementsByTagName("INPUT")];
      var answers = [];
      console.log(options);
      options.forEach((element,ind,arr) => {
          if(element.value === true | element.value === "true"){
            answers.push(ind)
          }
          element.disabled = true;
      });

      document.getElementById(`Btn${ind}`).disabled = true;

      var correct = true;
      var ans
      for(ans in answers){
          if(options[ans].checked !== true | options[ans].checked !== "true"){
            correct =  false;
            break;
          }
      }

      // answers = answers.filter(ans => {
      //     return (options[ans].checked === true | options[ans].checked === "true");
      // });

      var info = document.getElementById("Sub"+ind);
      if(correct === true){
        ReactDOM.render((<p className="text-success">Correct</p>),info);
      }else{
        ReactDOM.render((<p className="text-danger">Incorrect</p>),info);
      }

      this.postToDB(options,correct);

    // questions = document.getElementById('content').innerHTML;
    // console.log('question after getting inner html');
    // console.log(questions)
    // questions = (<div
    //   dangerouslySetInnerHTML={{
    //     __html: dompurify.sanitize(questions),
    //   }}
    // />);
    // console.log('question after getting html to jsx');
    // console.log(questions);
    // submit = true;
    // ReactDOM.render(questions,document.getElementById('questions'));
    // this.setState({loading: false});

  }

  render() {
    if(this.state.loading === true & submit === true){
      submit = false;
      return (<div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>);
    }

    this.setQuiz();


    return (<div className="row" id="questions">{questions}
    </div>);
  }
}

export default Quiz;
