//selesct elements
let countSpan= document.querySelector(".quiz-info .count span");
let bulletsspancontainer=document.querySelector(".bullets .spans");
let questionArea=document.querySelector(".quiz-area");
let answersArea=document.querySelector(".answers-area");
let submit=document.querySelector(".submit-button");
let Bullets=document.querySelector(".bullets");
let Results=document.getElementsByClassName("results")[0];
let countdownspan=document.querySelector(".countdown");



// set options
let currentIndex = 0;
let right_Answer=0;
let countdowninterval;
function getQuestions(){
    let myRequest= new XMLHttpRequest();
    myRequest.onreadystatechange =function () {
        if(this.readyState === 4 && this.status === 200){
            let qustionob=JSON.parse(this.responseText);
            let qcount =qustionob.length;
            
            //create bullets + set questions count
            createBullets(qcount);
           //start countdown
           countdown(30,qcount);
           
             //add data
             addquestionData(qustionob[currentIndex],qcount);

            // click on submit
            submit.onclick=function(){
                // get right answer
                let therightanswer = qustionob[currentIndex].right_answer;

                // increase index
                currentIndex++;
                

                //check the answer
                checkAnswer(therightanswer,qcount);

                //remove previous question
                questionArea.innerHTML="";
                answersArea.innerHTML="";
                 //add data
            addquestionData(qustionob[currentIndex],qcount);

            //handle bullets class
            handelbullets();

            //show results
            showResults(qcount);

            clearInterval(countdowninterval);
            countdown(30,qcount);
            };
        }
    }
    myRequest.open("GET","html_questions.json",true);
    myRequest.send();
}
getQuestions();

function createBullets(num){
        countSpan.innerHTML = num;
       // create spans
        for(let i=0; i<num;i++){
        //create span
        let bullets=document.createElement("span");

        if(i===0){
            bullets .classList.add("active");
        }
        // append bullets to main bullet container
        bulletsspancontainer.append(bullets);
}

}


function addquestionData(obj,count){
    if(currentIndex < count){
//create h2 question title
let questiontitle=document.createElement("h2");

//create question text
let questionText=document.createTextNode(obj["title"]);
 //Append text to h2
questiontitle.append(questionText);
// Append the h2 to the Quiz area
questionArea.append(questiontitle);

//create answers
for(let i=1;i<=4;i++){
    //create  main  answer div
    let maindiv=document.createElement("div");
    //add class to div
    maindiv.className="answer";
    //create radio button
    let radioB=document.createElement("input");
    //create  type + name + id + Data attributes
    radioB.setAttribute("type","radio");

    
    


    maindiv.append(radioB);
     //create question text
    let mainanswer=document.createTextNode(obj[`answer_${i}`]);
     // Append the mainanswer to the maindiv


    radioB.setAttribute("name","question");

    radioB.setAttribute("id",`answer_${i}`);

    radioB.dataset.answer = obj[`answer_${i}`];

     //make one answer selected
    if(i==1){
        let check=document.createAttribute("checked");
        radioB.setAttributeNode(check);

    }
    //create label
    let the_label=document.createElement("label");
    the_label.setAttribute("for",`answer_${i}`);

    //create label text
    let thelabelText=document.createTextNode(obj[`answer_${i}`]);

    //add the text to the label

    the_label.append(thelabelText);

    //add input + label to main div
    maindiv.append(radioB);
    maindiv.append(the_label);

    //append All Divs to answer area
    answersArea.append(maindiv);
}

    }
    




}
function checkAnswer(Ranswer,count){
    
    let answers =document.getElementsByName('question');
    let theChoosenAnswer;
    for(let i=0;i<answers.length;i++){
        if(answers[i].checked){
            theChoosenAnswer=answers[i].dataset.answer;
        }
    }
    if(Ranswer === theChoosenAnswer){
        right_Answer++;
        console.log("good")
    }
}
 function handelbullets(){
    let bulletsSpans=document.querySelectorAll(".bullets .spans span");

    let arrayOfSpan = Array.from(bulletsSpans);

    arrayOfSpan.forEach(function(el,index){
        
        if(currentIndex === index){
            el.classList.add("active");
        }
    });
 }

 function showResults(count){
    let the_results;
    if(currentIndex === count){
        questionArea.remove();
        answersArea.remove();
        submit.remove();
        Bullets.remove();
        if(right_Answer >(count/2) && right_Answer <count ){
            the_results =`<span class="good">Good</span>, ${right_Answer} From ${count}`;
        }
        else if( right_Answer === count){
            the_results =`<span class="perfect">Perfect</span>, ${right_Answer} From ${count}`;
        }
        else{
            the_results =`<span class="bad">Bad</span>,${right_Answer} From ${count}`;
        }
        Results.innerHTML =the_results;
        Results.style.padding='22px';

    }
 }


 function countdown(duration,count){
    if(currentIndex < count){
        let minutes, seconds;
        countdowninterval = setInterval(function(){
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);

            minutes = minutes < 10 ?`0${minutes}`:`${minutes}`;
            seconds = seconds < 10 ?`0${seconds}`:`${seconds}`;

            
            countdownspan.innerHTML =`${minutes}:${seconds}`;
            if(--duration < 0){
                clearInterval(countdowninterval);
                submit.click();
            }
        },1000);
    }
 }