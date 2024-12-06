let data = {}
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


window.addEventListener("mouseup", function (event) {
  let editor = document.getElementById("editor")
  console.log(event.target.parentNode)
  if (event.target != editor && event.target.parentNode != editor && editor.contains(event.target) == false) {
    editor.style.display = "none"
  }
})

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
  }
}

function selectsubject(subject) {
  selectedsubject = subject
  document.getElementById("subjectnameedit").value = subject;
  document.getElementById("subjectnameedit").disabled = false;
  document.getElementById("examlist").innerHTML = "";
  
  for (const score in data[subject]) {
    document.getElementById("examlist").insertAdjacentHTML("beforeend", `
                    <div class="exam">
                        <input class="examname" type="text" value='${score}'>
                        <input class="examscore" type="number" min="0" value='${data[subject][score]}'>
                    </div>`)
  }
  console.log(selectedsubject)
  drawchart(subject, false)
}

function editsubjectname(newName) {
  newName = newName.trim();
  if (newName === "" || data.hasOwnProperty(newName)) {
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

    document.getElementById("examlist").insertAdjacentHTML("beforeend", `
                    <div class="exam">
                        <input class="examname" type="text" value='${exam}'>
                        <input class="examscore" type="number" min="0" value='${score}'>
                    </div>`)

    console.log(data)
  } else {
    alert("Please fill in all fields or select a Subject!")
  }
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
      borderWidth: 1
    }]
  } else {

    let datasets = []
    let labels = []
    maxcount = 0
    for (const subject in data) {

      if (Object.keys(subject).length > maxcount) {
        maxcount = Object.keys(subject).length
      }

      let label = subject
      let scores = []

      for (const exam in data[subject]) {
        scores.push(data[subject][exam])
      }

      datasets.push({
        label: label,
        data: scores,
        borderWidth: 1
      })
    } 

    for (i = 1; i < maxcount; i++) {
      labels.push(`Exam ${i}`)
    }
    
    chartdata.data.labels = labels
    chartdata.data.datasets = datasets
  }
  
  const ctx = document.getElementById('myChart');
  chart = new Chart(ctx, chartdata);
  
} 





 drawchart() 

