

const questionList = document.querySelector("#questionList");
const updateAnsForm = document.querySelector("#updateAnswer-form")

renderQuestions = (doc) => {
     let tr = document.createElement("tr");
     tr.setAttribute('data-id',doc.id)
     let name = document.createElement("td");
    //  let email = document.createElement("td");
     let question = document.createElement("td");
     let ans = document.createElement("td");
     let action = document.createElement("td");
     let btnDelete = document.createElement('button')
     let btnUpdate = document.createElement('button')
    
     
     btnUpdate.setAttribute("data-id", doc.id)
  

     btnDelete.setAttribute('class',"btn btn-danger btn-block")
     btnDelete.setAttribute("data-id", doc.id);

     btnDelete.innerHTML = "Delete"

     name.textContent = doc.data().senderName;
     question.textContent = doc.data().question;
     ans.textContent = doc.data().answer;
   
     if(ans.textContent == ""){
       btnUpdate.setAttribute("class", "btn btn-warning btn-block");
        btnUpdate.innerHTML = "Answer"
         action.append(btnUpdate,btnDelete)
         tr.append(name, question, ans, action);
     }else{
       btnUpdate.setAttribute("class", "btn btn-info btn-block");
        btnUpdate.innerHTML = "Update Answer"
         action.append(btnUpdate,btnDelete)
         tr.append(name, question, ans,action);
     }
    
     questionList.appendChild(tr);

     //delete button click event
     btnDelete.addEventListener('click', function (e){
         e.stopPropagation();
         swal({
           title: "Confirm Delete",
           text: "Once deleted, you will not be able to recover.",
           icon: "warning",
           buttons: true,
           dangerMode: true,
         }).then((willDelete) => {
           if (willDelete) {
             let id = e.target.getAttribute("data-id");
             db.collection("questions")
               .doc(id)
               .delete()
               .then((data) => {
                 swal("File has been deleted!", {
                   icon: "success"
                 });
               });
           } 
         });
     })
     
     //Update button click event
     btnUpdate.addEventListener('click',(e) => {
         e.stopPropagation();
         let id = e.target.getAttribute('data-id')
        $("#updateAnswerModal").modal('show')

        //get the current document with ID
        db.collection("questions").doc(id).get()
        .then((quest) => {
            const {senderName,senderEmail,question,answer } = quest.data()
            updateAnsForm.senderName.value = senderName;
            updateAnsForm.senderEmail.value =senderEmail;
            updateAnsForm.questionText.value = question;;
            updateAnsForm.questionAnswer.value = answer;
            updateAnsForm.questionId.value = quest.id;
        })
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

if(document.body.contains(updateAnsForm)){
  updateAnsForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let id = updateAnsForm.questionId.value;
    db.collection("questions")
      .doc(id)
      .update({
        answer: updateAnsForm.questionAnswer.value,
      })
      .then(() => {
        swal({
          title: "Success",
          text: "Question has been answered",
          icon: "success",
          button: "Thank you",
        }).then(() => {
          location.reload();
        });
      });
  });
}