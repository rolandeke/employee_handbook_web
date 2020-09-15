
let select = document.querySelector("#topicIdDropDown");
let subTopicForm = document.querySelector("#add-subtopic-form");
let subTopicTable = document.querySelector("#SubTopicsTable");
let accordian = document.querySelector("#accordianId");
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
  card.classList.add("card");
  card.setAttribute('data-id',doc.id)
  let cardHeader = document.createElement("div");
  cardHeader.classList.add("card-header");
  cardHeader.setAttribute("role", "tab");
  cardHeader.setAttribute("id", "section"+doc.id+"HeaderId");
  let h5 = document.createElement("h5");
  h5.classList.add("mb-0");
  let anchor = document.createElement("a");
  anchor.setAttribute("data-toggle", "collapse");
  anchor.setAttribute("data-parent", "#accordianId");
  anchor.setAttribute("href", "#section" + doc.id + "ContentId");
  anchor.setAttribute("aria-expanded", "true");
  anchor.setAttribute("aria-controls", "section"+doc.id+"ContentId");
  anchor.textContent = doc.data().title;

  let CollapseIn = document.createElement("div");
  let cardBody = document.createElement("div");
  let cardFooter = document.createElement('div');
  let delButton = document.createElement('a')
  let editButton = document.createElement('a')

  CollapseIn.setAttribute("id", "section"+doc.id+"ContentId");
  CollapseIn.classList.add("collapse");
  CollapseIn.classList.add("in");
  CollapseIn.setAttribute("role", "tabpanel");
  CollapseIn.setAttribute("aria-labelledby", "section"+doc.id+"HeaderId");
  cardFooter.setAttribute("class", "card-footer text-muted mt-2");

  delButton.setAttribute("class", "btn btn-danger mr-3");
  delButton.innerHTML = "Delete"
  editButton.setAttribute('class','btn btn-info')
  editButton.innerHTML = "Edit"

  delButton.setAttribute('data-id',doc.id)
  editButton.setAttribute('data-id',doc.id)

  cardFooter.appendChild(delButton)
  cardFooter.appendChild(editButton)

  cardBody.classList.add("card-body");
  cardBody.textContent = doc.data().description;

  cardBody.appendChild(cardFooter)

  cardHeader.appendChild(h5);
  h5.appendChild(anchor);

  CollapseIn.appendChild(cardBody);
  card.appendChild(cardHeader);
  card.appendChild(CollapseIn);


  accordian.appendChild(card);

  //deleting data from topics collection
  delButton.addEventListener("click", (event) => {
    event.stopPropagation();
    let id = event.target.getAttribute('data-id')
    db.collection("sub_topics").doc(id).delete();
  });

  editButton.addEventListener('click', (e) =>{
    e.stopPropagation();
     let id = event.target.getAttribute("data-id");
     db.collection('sub_topic').doc(id).get()
     .then(doc => {
       console.log(doc.data());
     })
  })
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
        let cardToRemove = accordian.querySelector("[data-id=" + item.doc.id + "]");
        accordian.removeChild(cardToRemove);
      }
    });
  });


if (document.body.contains(subTopicForm)) {
  //saving subtopic
  subTopicForm.addEventListener("submit", (e) => {
    e.preventDefault();
    db.collection("sub_topics").add({
      title: subTopicForm.title.value.trim(),
      description: subTopicForm.description.value.trim(),
      topicId: subTopicForm.topicId.value.trim(),
      dateAdded: sd.getTime(),
    });
    subTopicForm.title.value = "";
    subTopicForm.description.value = "";
    subTopicForm.topicId.value = "";

    alert("Saved Successfully");
  });
}
