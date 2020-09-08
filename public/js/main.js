const topicsTable = document.querySelector("#topicsTable")
const form = document.querySelector('#add-topic-form');
var date = new Date();

//Create elements and render topics
function renederTopics(doc){
  let tr = document.createElement('tr');
  let title = document.createElement('td');
  let description = document.createElement('td');
  let action = document.createElement('td');
  let del = document.createElement('div');
  let edit = document.createElement('div')


  action.setAttribute('data-id', doc.id);
  tr.setAttribute("data-id", doc.id);
  title.textContent = doc.data().title;
  description.textContent = doc.data().description;
  del.textContent = ('Delete ')
  edit.textContent = ('Edit')
  del.style.cursor = 'pointer'
  edit.style.cursor = 'pointer'

  

  action.appendChild(del);
  action.appendChild(edit)

  tr.appendChild(title);
  tr.appendChild(description)
  tr.appendChild(action)

  topicsTable.appendChild(tr)


  //deleting data from topics collection
  del.addEventListener('click', (event) => {
    event.stopPropagation();
    let id = event.target.parentElement.getAttribute('data-id')
    db.collection('topics').doc(id).delete();
  })
}


if(document.body.contains(form)){
  //saving Data to the database
  form.addEventListener("submit", (e) => {
    e.preventDefault();
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
  });
}
db.collection("topics").orderBy('dateAdded').onSnapshot(snapshot => {
  let changes = snapshot.docChanges();
  changes.forEach(item => {
    if(item.type == "added"){
      if(document.body.contains(topicsTable)){
        renederTopics(item.doc);
      }
    }else if(item.type == "removed"){
      let tr = topicsTable.querySelector('[data-id='+item.doc.id+']');
      topicsTable.removeChild(tr);
    }
  })
})