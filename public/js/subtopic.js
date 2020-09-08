let select = document.querySelector("#topicIdDropDown");
let subTopicForm = document.querySelector('#add-subtopic-form')
var sd = new Date();

if(document.body.contains(select)){
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

function renderSubTopics(doc) {}


db.collection("sub_topics")
  .get()
  .then((snapshot) => {
    snapshot.docs.forEach((doc) => {
      renderSubTopics(doc);
    });
  });

if(document.body.contains(subTopicForm)){
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