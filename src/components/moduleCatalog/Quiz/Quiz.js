import React, { Component } from "react";
import ReactDOM from "react-dom";
import dompurify from "dompurify";
import "./Quiz.css";

var questions, size, qsize, submit, contents;
class Quiz extends Component {
  constructor(props){
    super(props);
    this.state = {
      loading: true
    };
    // this.child = React.createRef();
    questions = "";
    size = 0;
    qsize = 0;
    submit = true;
    contents = [];
    contents = JSON.parse(props.children);
    contents = contents[0]['questions'];
    qsize = contents.length;
    this.submission = this.submission.bind(this);
  }

  // async componentDidMount(){
  //   try{
  //   await this.setQuiz();
  //   }catch (err){
  //     // this.setState({loading: false})
  //     console.log(err)
  //   }
  // }

  async getSubmitted(){
    console.log(`selected for index ${size} question = `);
    console.log(contents[size])
    var qid = contents[size]['question_id'];
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    var correct,json;
    await fetch(`${process.env.REACT_APP_APIBASE_URL}/api/activityresponse/latest/${localStorage.getItem('id')}/${this.props.data.programId}/${this.props.data.courseId}/${this.props.data.courseInstanceId}/${this.props.data.moduleId}/${this.props.data.activityId}/${qid}?token=${localStorage.getItem('token')}`, requestOptions)
      .then(async (response) => await response.text())
      .then(async (result) =>{
        console.log('result fetched in quiz api =',result);
        result = await JSON.parse(result);
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
        (correct!==null | correct !== undefined)?correct = correct : correct = "";
        (json!==null | json !== undefined)?json = json : json = "";
        contents[size]['correct'] = correct;
        // contents[size] = Object.assign(contents[size],)
        contents[size]['result'] = json;
        if(size+1 === qsize){
          submit = false;
          this.setState({loading: false});
          
        }else{
          size = size + 1;
          this.setState({
            loading: true
          });
        }


      })
      .catch(error => console.log('error', error));

  }

  async setQuiz(){

    console.log('in quiz app contents = ')
    console.log(contents)
        var correct,json;
        var content = contents.map((con,qind,arr) =>{
          qind = qind+1;
          let question = `${qind}) `;
          con['questionText'].forEach((item,ind) => {
            (item['text'] === null | item['text'] === undefined)? 
            question = question + '<img src="'+`${item['image']['imageSRC']}`+'"></img>'
            :question = question + item['text']
          });
          var op = 0;
          console.log('question id = ',con['question_id']);
          correct = con['correct'];
          json = con['result'];
          console.log(`question id = ,${con['question_id']}, correct = ${correct}, json = ${json}`);

          let uniq = `QZ${qind}`;


          if(correct === true | correct === false){
            // console.log('options if submitted');
            // console.log(con['options']);

            con['options'] = con['options'].filter((realOPT,ind,arr) => {
              console.log("filter check = ")
              console.log(realOPT['correct'])
              return realOPT['correct'] === true;
            });

            console.log('quizz after filter');
            console.log(con['options']);

            var answers = con['options'].map((realOPT,ind,arr)=>{
              return (<li>{realOPT['option']}</li>);
            });

            let options = json['response']['choices'].map((opt) => {
              op = op+1;
              let ouniq = `OPT${qind}${op}`;
              var lclass = "form-check-label";

              // if(con['options'].includes(opt['option']) === true){
              //   lclass = lclass + " text-success";
              // }

                if(opt['selected'] === true){
                  return (<div key={ouniq} class="form-check">
                    <input className="form-check-input" type="checkbox" defaultChecked={true} QID={con['question_id']} data={opt['option']} disabled></input>
                    <label className={lclass} for="flexCheckDefault">
                      {opt['option']}
                    </label>
                  </div>);
                }

                return (<div key={ouniq} class="form-check">
                <input className="form-check-input" type="checkbox" QID={con['question_id']} data={opt['option']} disabled></input>
                <label className={lclass} for="flexCheckDefault">
                  {opt['option']}
                </label>
              </div>);

            });

            var correctText,correctClass;
            if(correct === true){
              correctText = "Correct";
              correctClass = "text-success text-center fw-bolder";
            }
            else{
              correctText = "Incorrect";
              correctClass = "text-danger text-center fw-bolder";
            }

                return (<div key={uniq} className="card border-primary mb-3 custom-card">
              <div
              className='card-header quiz_header'
              dangerouslySetInnerHTML={{
                __html: dompurify.sanitize(question),
              }}
            />
              <div className="card-body" id={"Q"+qind.toString()}>
                {options}
              </div>
              <div className="card-footer bg-transparent" id={"Sub"+qind.toString()}>
              <div class="container">
                <div class="row">
                  <div class="col">
                    <p className="text-start">
                    Score: {json['awardedMarks']}
                    </p>
                  </div>
                  <div class="col">
                  <p className={correctClass}>{correctText}</p>
                  </div>
                  <div class="col">
                  <p className="text-end">submitted on {json['timestamp']}</p>
                  </div>
                </div>
                  <div class="row"><p className="text-start text-success fw-bolder">Answers :</p>
                    {answers}
                  </div>
                </div>
              
              </div>
            </div>);
          }

          let options = con['options'].map((opt) => {
            op = op+1;
            let ouniq = `OPT${size}${op}`;
            let lid = `OPL${qind}${op}`;
            return (<div key={ouniq} class="form-check">
                <input className="form-check-input" type="checkbox" QID={con['question_id']} data={opt['option']} labelid={lid} value={opt['correct']}></input>
                <label id={lid} className="form-check-label" for="flexCheckDefault">
                  {opt['option']}
                </label>
              </div>);
          });

            return (<div key={uniq} className="card border-primary mb-3 custom-card">
            <div
            className='card-header quiz_header'
            dangerouslySetInnerHTML={{
              __html: dompurify.sanitize(question),
            }}
          />
            <div className="card-body position-relative" id={"Q"+qind.toString()}>
              {options}
            <button className="btn-primary btn list-button custom-btn position-absolute bottom-0 end-0" id={`Btn${qind}`} type="button" onClick={() => {this.submission(qind.toString())}}>Submit</button>
            </div>
            <div className="card-footer bg-transparent" id={"Sub"+qind.toString()}></div>
            </div>);

        });


        
        console.log(content)

        questions = (<div class="col">
          {content}
        </div>);

        // if(reached === true){
          // this.setState({loading: false});
        // }



  }

  postToDB(options,correct,ind){

    var qid = "";
    options = options.map((opt) => {

      qid = opt.getAttribute('qid');

      return {option: opt.getAttribute('data'),
              selected: opt.checked}
    });

    var response = {choices: options}

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    console.log("moduleID's = ", this.props.data)

    var raw = JSON.stringify({
      userId: localStorage.getItem('id'),
      programId: this.props.data.programId,
      courseInstanceId: this.props.data.courseInstanceId,
      courseId: this.props.data.courseId,
      moduleId: this.props.data.moduleId,
      activityType: "quiz",
      activityId: this.props.data.activityId,
      questionId: qid,
      response: response,
      result: correct,
      evaluationStatus: true,
      awardedMarks: 0, 
      maxMarks: 1
    });

    console.log("post data = ", raw);

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
      .then((result) => {
        console.log(result);

      // console.log("options log =",options);
      // options.forEach((opt,ind,arr)=>{
      //   var opid = opt.getAttribute('labelid');
      //   document.getElementById(opid).setAttribute('class',"text-success form-check-label")
      // })

      var info = document.getElementById("Sub"+ind);
      if(correct === true){
        ReactDOM.render((<p className="text-success text-center fw-bolder">Correct</p>),info);
      }else{
        ReactDOM.render((<p className="text-danger text-center fw-bolder">Incorrect</p>),info);
      }



      })
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
          console.log(' correct options value =');
          console.log(element.value);
          if(element.value === true | element.value === "true"){
            answers.push(ind)
          }
          element.disabled = true;
      });

      console.log('answer indicies array =');
      console.log(answers);

      var button = document.getElementById(`Btn${ind}`);
      button.outerHTML = "";
      // button.className = "btn btn-secondary";
      // button.disabled = true;

      var correct = true;
      var ans
      for(ans in answers){
          console.log('each answer index = ',ans);
          console.log('answer not checked = ',(options[ans].checked !== true));
          if(options[ans].checked !== true){
            correct =  false;
            break;
          }
      }

      console.log('correctness after checking =',correct);

      // answers = answers.filter(ans => {
      //     return (options[ans].checked === true | options[ans].checked === "true");
      // });

      

      this.postToDB(options,correct,ind);

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
      console.log('in render set quiz condition');
      this.getSubmitted();

      return (<div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>);
    }

    this.setQuiz();

    return (<div className="row position" id="questions">{questions}
    </div>);
  }
}

export default Quiz;
