
const questionList = document.querySelector("#questionList");

renderQuestions = (doc) => {
     let tr = document.createElement("tr");
     tr.setAttribute('data-id',doc.id)
     let name = document.createElement("td");
    //  let email = document.createElement("td");
     let question = document.createElement("td");
     let ans = document.createElement("td");
     let action = document.createElement("td");
     let btnAns = document.createElement('button')
     let btnDelete = document.createElement('button')
     let btnUpdate = document.createElement('button')

    
     btnUpdate.setAttribute("class","btn btn-info btn-block")
     btnDelete.setAttribute('class',"btn btn-danger btn-block")
     btnAns.setAttribute("class","btn btn-warning btn-block")
     btnUpdate.setAttribute("data-id", doc.id)
     btnDelete.setAttribute("data-id", doc.id);
     btnAns.setAttribute("data-id", doc.id);
     
     btnAns.innerHTML = "Answer"
     btnUpdate.innerHTML = "Update Answer"
     btnDelete.innerHTML = "Delete"



     name.textContent = doc.data().senderName;
     question.textContent = doc.data().question;
     ans.textContent = doc.data().answer;
   
     if(ans.textContent == ""){
         action.append(btnAns,btnDelete)
         tr.append(name, question, ans, action);
     }else{
         action.append(btnUpdate,btnDelete)
         tr.append(name, question, ans,action);
     }
    
     questionList.appendChild(tr);

     btnDelete.addEventListener('click', function (e){
         e.stopPropagation();
         let id = e.target.getAttribute("data-id")
         db.collection("questions").doc(id).delete()
     })
     btnUpdate.addEventListener('click',(e) => {
         e.stopPropagation();
         alert("Coming Soon");
     })
     btnAns.addEventListener('click',(e) => {
         e.stopPropagation()
         alert("Coming Soon");
     })
}

db.collection("questions")
  .onSnapshot((snapshot) => {
    let changes = snapshot.docChanges();
    changes.forEach((item) => {
      if (item.type == "added") {
        if (document.body.contains(questionList)) {
          renderQuestions(item.doc);
        }
      } else if (item.type == "removed") {
        let questionToRemove = questionList.querySelector(
          "[data-id=" + item.doc.id + "]"
        );
        questionList.removeChild(questionToRemove);
      } else if (item.type == "updated") {
        renderQuestions(item.doc);
      }
    });
  });