data = {}
chartdata = {
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

chartdata.data.labels = ['Exam 1', 'Exam 2', 'Exam 3', 'Exam 4', 'Exam 5', 'Exam 6']
chartdata.data.datasets = [{
  label: 'Subject 1',
  data: [78,95, 90, 85, 70, 65],
  borderWidth: 1,
}]

chartdata.data.datasets.push({
  label: 'Subject 2',
  data: [90, 80, 75, 60],
  borderWidth: 1,
})

const ctx = document.getElementById('myChart');


new Chart(ctx, chartdata);

  