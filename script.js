let data = getdata()
let chartdata = {
  type: 'line',
  data: {
    
  },
  options: {
    
      plugins: {
          legend: {
              labels: {
                  font: {
                      size: 14,
                      family: "monospace"
                  }
              }
          }
      },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
}
let selectedsubject = ""
var chart;

if (window.innerWidth <= 600) {
  chartdata.options.maintainAspectRatio = false
}

function resetsubjname() {
  subjectnameedit = document.getElementById("subjectnameedit")
  subjectnameedit.disabled = true
  subjectnameedit.value = "Select or add a Subject!"
}

window.addEventListener("mouseup", function (event) {
  let editor = document.getElementById("editor")
  console.log(event.target.parentNode)
  if (event.target != editor && event.target.parentNode != editor && editor.contains(event.target) == false) {
    editor.style.display = "none"
  }
})

window.addEventListener("keydown", function (event) {
  console.log(event.code)
  if (event.code == "Escape") {
    document.getElementById("editor").style.display = "none"
  }
})

function showdropdown() {
  let subjecselector = document.getElementById("subjectselector")
  subjecselector.style.maxHeight = "110px"
  subjecselector.style.overflowY = "scroll"
}

function addsubject() {
  let subject = document.getElementById("subjectinput").value
  console.log(document.getElementsByName(subject))
  subject = subject.replaceAll(" ", "")
  if (document.getElementsByName(subject).length == 0 && subject != "") {
    const subjectDiv = document.createElement("div")
    subjectDiv.textContent = subject
    subjectDiv.className = "subject"
    subjectDiv.setAttribute("name", subject)
    
    const newDiv = document.createElement("div")
    newDiv.setAttribute("name", subject)
    newDiv.textContent = subject

    newDiv.onclick = () => selectsubject(newDiv.getAttribute("name"));
    subjectDiv.onclick = () => selectsubject(subjectDiv.getAttribute("name"));

    data[subject] = {}

    console.log(data)

    document.getElementById("subjectlist").insertBefore(subjectDiv, document.getElementById("subjectlist").children[1])
    document.getElementById("subjectselector").insertBefore(newDiv, document.getElementById("subjectselector").children[1])
    selectsubject(subject)
  } else {
    alert("Subject name cannot be empty!")
  }
  
}

function selectsubject(subject) {
  selectedsubject = subject
  document.getElementById("subjectnameedit").value = subject;
  document.getElementById("subjectnameedit").disabled = false;
  document.getElementById("examlist").innerHTML = "";
  
  for (const exam in data[subject]) {
    let score = data[subject][exam]
    console.log(data)

    examDiv = document.createElement("div")
    examDiv.className = "exam"
    examDiv.id = subject + "_" + exam
    
    examNameInp = document.createElement("input")
    examNameInp.className = "examname"
    examNameInp.type = "text"
    examNameInp.value = exam
    examNameInp.oninput = () => editexamname(exam, document.getElementById(`${subject}_${exam}`).querySelector(".examname").value)

    examScoreInp = document.createElement("input")
    examScoreInp.className = "examscore"
    examScoreInp.type = "number"
    examScoreInp.min = "0"
    examScoreInp.value = score
    examScoreInp.oninput = () => editexamscore(exam, document.getElementById(`${subject}_${exam}`).querySelector(".examscore").value)


    examDiv.appendChild(examNameInp)
    examDiv.appendChild(examScoreInp)

    document.getElementById("examlist").appendChild(examDiv)
  }
  console.log(selectedsubject)
  drawchart(subject, false)
}

function editsubjectname(newName) {
  newName = newName.trim();
  if (newName == "" || data.hasOwnProperty(newName)) {
    console.log(data.hasOwnProperty(newName), '"' + newName + '"')
    alert("Invalid or duplicate subject name!");
    return;
  }

  let oldName = selectedsubject;
  if (oldName === "") {
    alert("No subject selected!");
    return;
  }

  data[newName] = data[oldName];
  delete data[oldName];

  let subjectDivs = document.querySelectorAll(`[name="${oldName}"]`);
  console.log(subjectDivs);
  subjectDivs.forEach(div => {
    div.innerHTML = newName;
    div.setAttribute("name", newName);
  });

  selectedsubject = newName;
  document.getElementById("subjectnameedit").value = newName;

  console.log(data);
}


function addexam() {
  let exam = document.getElementById("addexamname").value
  let score = document.getElementById("addexamscore").value
  let subject = selectedsubject

  if (exam != "" && score != "" && subject != "") {

    let existingExams = document.querySelectorAll("#examlist .examname");
    for (let i = 0; i < existingExams.length; i++) {
      if (existingExams[i].value === exam) {
        alert("An exam with this name already exists!");
        return;
      }
    }

    data[subject][exam] = score
    console.log(data)

    examDiv = document.createElement("div")
    examDiv.className = "exam"
    examDiv.id = subject + "_" + exam
    
    examNameInp = document.createElement("input")
    examNameInp.className = "examname"
    examNameInp.type = "text"
    examNameInp.value = exam
    examNameInp.oninput = () => editexamname(exam, examNameInp.value)

    examScoreInp = document.createElement("input")
    examScoreInp.className = "examscore"
    examScoreInp.type = "number"
    examScoreInp.min = "0"
    examScoreInp.value = score
    examScoreInp.oninput = () => editexamscore(exam, examScoreInp.value)


    examDiv.appendChild(examNameInp)
    examDiv.appendChild(examScoreInp)

    document.getElementById("examlist").appendChild(examDiv)

    console.log(data)
  } else {
    alert("Please fill in all fields or select a Subject!")
  }

  drawchart(selectedsubject,false)
}

function editexamname(oldName, newName) {
  newName = newName.trim();
  if (newName == "" || data[selectedsubject].hasOwnProperty(newName)) {
    alert("Invalid or duplicate exam name!");
    document.getElementById(`${selectedsubject}_${oldName}`).querySelector(".examname").value = oldName;
    return;
  }

  console.log(oldName, newName);  
  let olddata = data[selectedsubject]
  data[selectedsubject] = {}
  console.log(olddata, data)
  for (exam in olddata) {
    console.log(exam)
    if (exam == oldName) {
      data[selectedsubject][newName] = olddata[oldName]
      delete data[selectedsubject][oldName]
    } else {
      data[selectedsubject][exam] = olddata[exam]
    }

  }
  
  let examDiv = document.getElementById(`${selectedsubject}_${oldName}`);
  if (examDiv) {
    examDiv.id = `${selectedsubject}_${newName}`;

    let examNameInput = examDiv.querySelector(".examname");
    if (examNameInput) {
      examNameInput.value = newName;
      examNameInput.setAttribute("oninput", `editexamname('${newName}', this.value)`);
    }
    let examScoreInput = examDiv.querySelector(".examscore");
    if (examScoreInput) {
      examScoreInput.setAttribute("oninput", `editexamscore('${newName}', this.value)`);
    }
  }

  drawchart(selectedsubject, false);

  console.log(data);
}

function editexamscore(exam, score) {
  console.log(selectedsubject, exam, score)
  data[selectedsubject][exam] = score
  console.log(data)
  drawchart(selectedsubject, false)
}

function drawchart(subject, all) {
  
  try {chart.destroy()} catch {}
  if (!all) {

    let label = subject
    let scores = []
    let labels = []

    for (const exam in data[subject]) {
      labels.push(exam)
      scores.push(data[subject][exam])
    }

    chartdata.data.labels = labels
    chartdata.data.datasets = [{
      label: label,
      data: scores,
      cubicInterpolationMode: 'monotone',
      borderWidth: 1
    }]
  } else {

    let datasets = []
    let labels = []
    maxcount = 0
    for (const subject in data) {
      count = 0

      let label = subject
      let scores = []

      for (const exam in data[subject]) {
        scores.push(data[subject][exam])
        count += 1
      }
      if (count>maxcount) {
        maxcount = count
      }
      datasets.push({
        label: label,
        data: scores,
        cubicInterpolationMode: 'monotone',
        borderWidth: 1
      })
    } 

    for (i = 0; i < maxcount; i++) {
      labels.push(`Exam ${i+1}`)
    }
    
    chartdata.data.labels = labels
    chartdata.data.datasets = datasets
  }

  savedata()
  const ctx = document.getElementById('myChart');
  chart = new Chart(ctx, chartdata);
  
} 

function exportdata() {
  const blob = new Blob([JSON.stringify(data, null, 4)], {"type": "application/json"})

  const link = document.createElement("a")
  link.href = URL.createObjectURL(blob)
  link.download = "GradeTrackerExport"

  document.body.appendChild(link)
  link.click()

}

function importdata(usrdata) {
  const file = usrdata.files[0]
  if (!file) {
    alert("No file selected!")
    return;
  }

  const reader = new FileReader();
  reader.onload = function(event) {
    try {
      data = {};
      const importedData = JSON.parse(event.target.result)
      data = importedData
      console.log(data)
      setSubjectList()
      drawchart("any", true)
    } catch (e) {
      alert("Error reading JSON file: " + e.message)
    }
  };

  reader.readAsText(file);
}

function setSubjectList() {
  document.getElementById("subjectlist").innerHTML = `<div class="subject"><input  id="subjectinput" type="text"   placeholder="Add new Subject..."><button type="submit" id="addsubjectbtn" onclick="addsubject()" >Add</button></div>`
  document.getElementById("subjectselector").innerHTML = `<div onclick="drawchart('any', true)">All</div>
                <div onclick="document.getElementById('editor').style.display = 'block'">Add or Edit...</div>`
  for (const subject in data) {
    const subjectDiv = document.createElement("div")
    subjectDiv.textContent = subject
    subjectDiv.className = "subject"
    subjectDiv.setAttribute("name", subject)
    
    const newDiv = document.createElement("div")
    newDiv.setAttribute("name", subject)
    newDiv.textContent = subject

    newDiv.onclick = () => selectsubject(newDiv.getAttribute("name"));
    subjectDiv.onclick = () => selectsubject(subjectDiv.getAttribute("name"));

    document.getElementById("subjectlist").insertBefore(subjectDiv, document.getElementById("subjectlist").children[1])
    document.getElementById("subjectselector").insertBefore(newDiv, document.getElementById("subjectselector").children[1])
  }
}

function randomize() {
  let subjects = ["Math", "English", "Spanish", "French", "Latin", "Physics", "Biology", "PE", "History", "Geography", "Art", "Music", "Chemistry", "IT", "Philosophy", "Religion"]
  data = {}
  
  console.log(subjects)
  for (let i=Math.floor(Math.random()*subjects.length); i < subjects.length; i++) {
    let subject = subjects[i]
    console.log("i", i)
    subjects.splice(i,1)
    data[subject] = {}
    for (let b = 1; b <= Math.floor(Math.random()*10 + 5); b++) {
      data[subject][`Exam ${b}`] = Math.floor(Math.random()*100)
      console.log("Exam", b)
    }
  }
  setSubjectList()
  drawchart("any", true)
  console.log(data)
}

function savedata() {
  document.cookie = "data="+ JSON.stringify(data) + "; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/"

}

function getdata() {
  let cookies = document.cookie.split(";")
  for (let cookie of cookies) {
    let [key, value] = cookie.trim().split("=")
    if (key == "data") {
      return JSON.parse(value)
    }
  }
}

function loaddata() {
  data = getdata()
  console.log("data", data)
  setSubjectList()
  drawchart("any", true)
}

function reset() {
  data = {}
  document.cookie = "data={}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/"
  drawchart("any", true)
}


drawchart() 

