let select = document.querySelector("#topicIdDropDown");
let subTopicForm = document.querySelector("#add-subtopic-form");
let subTopicTable = document.querySelector("#SubTopicsTable");
let accordian = document.querySelector("#accordianId");
let btnSaveSubTopic = document.querySelector("#saveSubTopic");
var sd = new Date();


if (document.body.contains(select)) {
  db.collection("topics")
    .orderBy("dateAdded")
    .get()
    .then((snapshot) => {
      snapshot.docs.forEach((doc) => {
        let option = document.createElement("option");
        (option.textContent = doc.data().title),
          (option.value = doc.data().topicId);
        select.appendChild(option);
      });
    });
}

function renderSubTopics(doc) {
  let card = document.createElement("div");

  card.setAttribute("class", "card acc-card")
  card.setAttribute("data-id", doc.id);
  let cardHeader = document.createElement("div");
 
  cardHeader.setAttribute("class", "card-header acc-header")
  // cardHeader.setAttribute("role", "tab");
  cardHeader.setAttribute("id", "section" + doc.id + "HeaderId");

  let h2 = document.createElement("h2");
  h2.classList.add("mb-0");
  let button = document.createElement("button");
  button.setAttribute("class","btn btn-link btn-block text-left")
  button.setAttribute("type","button")
  button.setAttribute("data-toggle", "collapse");
  // button.setAttribute("data-parent", "#accordianId");
  button.setAttribute("data-target", "#section" + doc.id + "ContentId");
  button.setAttribute("aria-expanded", "true");
  button.setAttribute("aria-controls", "section" + doc.id + "ContentId");
  button.textContent = doc.data().title;

  let CollapseIn = document.createElement("div");
  let cardBody = document.createElement("div");
  let cardFooter = document.createElement("div");
  let delButton = document.createElement("a");
  let editButton = document.createElement("a");

  CollapseIn.setAttribute("id", "section" + doc.id + "ContentId");
  CollapseIn.setAttribute("class", "collapse");
  CollapseIn.setAttribute("data-parent", "#accordianId");
  CollapseIn.setAttribute("aria-labelledby", "section" + doc.id + "HeaderId");
  cardFooter.setAttribute("class", "card-footer text-muted mt-2");

  delButton.setAttribute("class", "btn btn-danger mr-3");
  delButton.innerHTML = "Delete";
  editButton.setAttribute("class", "btn btn-info");
  editButton.innerHTML = "Edit";

  delButton.setAttribute("data-id", doc.id);
  editButton.setAttribute("data-id", doc.id);

  cardFooter.appendChild(delButton);
  cardFooter.appendChild(editButton);

  cardBody.setAttribute("class","card-body");
  let paragraph = document.createElement('p')
  paragraph.textContent= doc.data().description;
  cardBody.appendChild(paragraph)

  cardBody.appendChild(cardFooter);

  cardHeader.appendChild(h2);
  h2.appendChild(button);

  CollapseIn.appendChild(cardBody);
  card.appendChild(cardHeader);
  card.appendChild(CollapseIn);
  

  accordian.appendChild(card);

  //deleting data from topics collection
  delButton.addEventListener("click", (event) => {
    event.stopPropagation();
     swal({
       title: "Confirm Delete",
       text: "Once deleted, you will not be able to recover.",
       icon: "warning",
       buttons: true,
       dangerMode: true,
     }).then((willDelete) => {
       if (willDelete) {
         let id = event.target.getAttribute("data-id");
         db.collection("sub_topics").doc(id).delete().then((data) => {
           console.log(data);
            swal("File has been deleted!", {
              icon: "success",
            });
         })
       } else {
       }
     });
     return;
   
  });

  editButton.addEventListener("click", (e) => {
    e.stopPropagation();
    let id = e.target.getAttribute("data-id");
    db.collection("sub_topics")
      .doc(id)
      .get()
      .then(function (doc) {
        subTopicForm.title.value = doc.data().title;
        subTopicForm.description.value = doc.data().description;
        subTopicForm.topicId.value = doc.data().topicId;
        subTopicForm.subTopicId.value = doc.id;
        btnSaveSubTopic.innerHTML = "Update";
      });
  });
}

db.collection("sub_topics")
  .orderBy("dateAdded")
  .onSnapshot((snapshot) => {
    let changes = snapshot.docChanges();
    changes.forEach((item) => {
      if (item.type == "added") {
        if (document.body.contains(accordian)) {
          renderSubTopics(item.doc);
        }
      } else if (item.type == "removed") {
        let cardToRemove = accordian.querySelector(
          "[data-id=" + item.doc.id + "]"
        );
        accordian.removeChild(cardToRemove);
      } else if (item.type == "updated") {
        renderSubTopics(item.doc);
      }
    });
  });

if (document.body.contains(subTopicForm)) {
  //saving subtopic
  subTopicForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (btnSaveSubTopic.innerHTML == "Save") {
      db.collection("sub_topics")
        .add({
          title: subTopicForm.title.value.trim(),
          description: subTopicForm.description.value.trim(),
          topicId: subTopicForm.topicId.value.trim(),
          dateAdded: sd.getTime(),
        })
        .then(() => {
            swal( {
              title: "Saved Successfully!",
              text: "Document has been saved successfully",
              icon: "success",
              button: "Thank you",
            }).then(() => {
               location.reload();
               clearInput();
               
            });
         
        });
    } else {
      let id = subTopicForm.subTopicId.value.trim();
      db.collection("sub_topics")
        .doc(id)
        .update({
          title: subTopicForm.title.value.trim(),
          description: subTopicForm.description.value.trim(),
          topicId: subTopicForm.topicId.value.triupdatedm(),
        })
        .then(() => {
          swal("Write something here:", {
            title: "Updated Successfully!",
            text: "Document has been updated successfully",
            icon: "success",
            button: "Thank you",
          }).then(() => {
            location.reload();
            clearInput();
            btnSaveSubTopic.innerHTML = "Save";
          });
        });
    }
  });
}

clearInput = () => {
  subTopicForm.title.value = "";
  subTopicForm.description.value = "";
  subTopicForm.topicId.value = "";
};
