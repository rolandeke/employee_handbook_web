const topicsTable = document.querySelector("#topicsTable");
const form = document.querySelector("#add-topic-form");
const addTopicbtn = document.querySelector("#addTopicbtn");
var docId;
var date = new Date();

//Create elements and render topics
function renederTopics(doc) {
  let tr = document.createElement("tr");
  let title = document.createElement("td");
  let description = document.createElement("td");
  let action = document.createElement("td");
  // let del = document.createElement("div");
  // let edit = document.createElement("div");
  let delButton = document.createElement("a");
  let editButton = document.createElement("a");

  action.setAttribute("data-id", doc.id);
  tr.setAttribute("data-id", doc.id);
  title.textContent = doc.data().title;
  description.textContent = doc.data().description;

  delButton.style.cursor = "pointer";
  editButton.style.cursor = "pointer";
  delButton.setAttribute("class", "btn btn-danger m-2 btn-block");
  delButton.innerHTML = "Delete";
  editButton.setAttribute("class", "btn btn-info m-2 btn-block");
  editButton.innerHTML = "Edit";

  delButton.setAttribute("data-id", doc.id);
  editButton.setAttribute("data-id", doc.id);

  action.appendChild(delButton);
  action.appendChild(editButton);

  tr.appendChild(title);
  tr.appendChild(description);
  tr.appendChild(action);

  topicsTable.appendChild(tr);

  //deleting data from topics collection
  delButton.addEventListener("click", (event) => {
    event.stopPropagation();
    swal({
      title: "Confirm Delete",
      text:
        "Once deleted, you will not be able to recover.",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        let id = event.target.parentElement.getAttribute("data-id");
        db.collection("topics").doc(id).delete().then(() => {
           swal("File has been deleted!", {
             icon: "success",
           });
        }) 
       
      } else {
      }
    });
    return
    
  });

  //updating the data
  editButton.addEventListener("click", (e) => {
    e.stopPropagation();
    let id = e.target.getAttribute("data-id");
    db.collection("topics").doc(id).get()
    .then(function (doc){
      form.title.value = doc.data().title;
      form.description.value = doc.data().description;
      form.topicId.value = doc.id
      addTopicbtn.innerHTML = "Update Topic"
    })
  });
}


if (document.body.contains(form)) {
  //saving Data to the database
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if(addTopicbtn.innerHTML == "Add Topic"){
       db.collection("topics")
         .add({
           title: form.title.value.trim(),
           description: form.description.value.trim(),
           topicId: "topic" + date.getTime(),
           dateAdded: date.getTime(),
         })
         .then(function () {
           location.reload();
           form.title.value = "";
           form.description.value = "";
           form.title.focus();
         });
    }else{
      let id = form.topicId.value;
      db.collection("topics").doc(id).update({
        title: form.title.value.trim(),
        description: form.description.value.trim(),
      }).then(() => {
        swal({
          title: "Updated Successfully!",
          text: "Document has been updated successfully",
          icon: "success",
          button: "Thank you",
        }).then(() => {
           location.reload();
           form.title.value = "";
           form.description.value = "";
           form.title.focus();
           addTopicbtn.innerHTML = "Add Topic";
        });
        
      })
    }
  
   
  });
}
db.collection("topics")
  .orderBy("dateAdded")
  .onSnapshot((snapshot) => {
    let changes = snapshot.docChanges();
    changes.forEach((item) => {
      if (item.type == "added") {
        if (document.body.contains(topicsTable)) {
          renederTopics(item.doc);
        }
      } else if (item.type == "removed") {
        let tr = topicsTable.querySelector("[data-id=" + item.doc.id + "]");
        topicsTable.removeChild(tr);
      }else if(item.type == "updated"){
        renederTopics(item.doc)
      }
    });
  });
