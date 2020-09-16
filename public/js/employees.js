let empList = document.querySelector("#empList");

renderEmployees = (doc) => {
  let tr = document.createElement("tr");
  let id = document.createElement("td");
  let fname = document.createElement("td");
  let username = document.createElement("td");
  let email = document.createElement("td");
  let dept = document.createElement("td");
  id.textContent = doc.data().empId;
  fname.textContent = doc.data().fullname;
  username.textContent = doc.data().username;
  email.textContent = doc.data().email;
  dept.textContent = doc.data().department;
  tr.append(id, fname, username, email, dept);
  empList.appendChild(tr);
};

db.collection("employees")
  .get()
  .then((snapshots) => {
    snapshots.forEach((doc) => {
      if (document.body.contains(empList)) {
        renderEmployees(doc);
      }
    });
  });
