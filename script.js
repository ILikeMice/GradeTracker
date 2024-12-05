const ctx = document.getElementById('myChart');


  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Red', 'bazingaaa', 'Yellow', 'Green', 'Purple', 'Orange'],
      datasets: [{
        label: 'Subject 1',
        data: [78,95, 90, 85, 70, 65],
        borderWidth: 1,
      },{
        label: 'Subject 2',
        data: [85, 90, 80, 75, 60, 55],
        borderWidth: 1,
      }]
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
  });

  