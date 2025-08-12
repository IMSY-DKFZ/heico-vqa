// Leaderboard data management
let leaderboardData = [];
let filteredData = [];
let currentSort = { field: 'Overall', direction: 'desc' };

// Load CSV data
async function loadLeaderboardData() {
  try {
    const response = await fetch('./static/data/results.csv');
    const csvText = await response.text();
    leaderboardData = parseCSV(csvText);
    filteredData = [...leaderboardData];
    displayLeaderboard();
    return leaderboardData;
  } catch (error) {
    console.error('Error loading leaderboard data:', error);
    return [];
  }
}

// Parse CSV data
function parseCSV(csvText) {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',');
  
  return lines.slice(1).map(line => {
    const values = line.split(',');
    const result = {};
    
    headers.forEach((header, index) => {
      const value = values[index];
      if (['Overall', 'Spatial', 'Depth', 'Condition', 'Detection', 'Interaction', 'Color', 'Puzzle'].includes(header)) {
        result[header] = parseFloat(value) || 0;
      } else if (header === 'price_per_2k_images') {
        result[header] = value ? parseFloat(value) : null;
      } else {
        result[header] = value || '';
      }
    });
    
    return result;
  });
}

// Sort data
function sortData(field) {
  if (currentSort.field === field) {
    currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
  } else {
    currentSort.field = field;
    currentSort.direction = 'desc';
  }
  
  filteredData.sort((a, b) => {
    let aVal = a[field];
    let bVal = b[field];
    
    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }
    
    if (aVal === null || aVal === undefined) aVal = -Infinity;
    if (bVal === null || bVal === undefined) bVal = -Infinity;
    
    if (currentSort.direction === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });
  
  displayLeaderboard();
}

// Display leaderboard
function displayLeaderboard() {
  const tbody = document.querySelector('#leaderboard-table tbody');
  if (!tbody) return;
  
  tbody.innerHTML = '';
  
  // Show top 10 initially
  const displayData = filteredData.slice(0, 10);
  
  displayData.forEach((model, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="has-text-weight-bold">${index + 1}</td>
      <td>
        <div class="content">
          <p class="has-text-weight-semibold">${model.name}</p>
          <p class="is-size-7 has-text-grey">${model.organization} ${model.family}</p>
          <span class="tag ${model.access === 'Open' ? 'is-success' : 'is-info'} is-small">
            ${model.access}
          </span>
        </div>
      </td>
      <td class="has-text-weight-bold has-text-primary">${(model.Overall * 100).toFixed(1)}%</td>
      <td>${(model.Spatial * 100).toFixed(1)}%</td>
      <td>${(model.Depth * 100).toFixed(1)}%</td>
      <td>${(model.Condition * 100).toFixed(1)}%</td>
      <td>${(model.Detection * 100).toFixed(1)}%</td>
      <td>${(model.Interaction * 100).toFixed(1)}%</td>
      <td>${(model.Color * 100).toFixed(1)}%</td>
      <td>${(model.Puzzle * 100).toFixed(1)}%</td>
      <td>${model.model_size || '—'}</td>
    `;
    tbody.appendChild(row);
  });
  
  // Update sort indicators
  document.querySelectorAll('.sort-header').forEach(header => {
    header.classList.remove('is-active');
  });
  
  const activeHeader = document.querySelector(`.sort-header[data-field="${currentSort.field}"]`);
  if (activeHeader) {
    activeHeader.classList.add('is-active');
    const icon = activeHeader.querySelector('i');
    if (icon) {
      icon.className = currentSort.direction === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
    }
  }
}

// Filter by access type
function filterByAccess(accessType) {
  if (accessType === 'all') {
    filteredData = [...leaderboardData];
  } else {
    filteredData = leaderboardData.filter(model => model.access === accessType);
  }
  displayLeaderboard();
}

// Initialize charts
function initializeCharts() {
  if (typeof Chart === 'undefined') {
    setTimeout(initializeCharts, 500);
    return;
  }
  
  if (!leaderboardData || leaderboardData.length === 0) {
    return;
  }
  
  
  // Prepare data for charts
  const chartData = leaderboardData.map(model => {
    // Parse release date
    const releaseDate = new Date(model.release_date);
    
    // Parse model size to numeric value
    let sizeValue = 0;
    if (model.model_size) {
      const sizeStr = model.model_size.toLowerCase();
      if (sizeStr.includes('b')) {
        sizeValue = parseFloat(sizeStr.replace(/[^0-9.]/g, ''));
      }
    }
    
    return {
      name: model.name,
      organization: model.organization,
      date: releaseDate,
      overall: model.Overall * 100,
      sizeValue: sizeValue,
      modelSize: model.model_size || 'Unknown',
      access: model.access,
      releaseDate: model.release_date,
      priceValue: model.price_per_2k_images || 0
    };
  });
  
  // Performance Over Time Chart - Use month numbers for simplicity
  const timeData = chartData
    .filter(d => !isNaN(d.date.getTime()) && d.overall > 0)
    .sort((a, b) => a.date.getTime() - b.date.getTime());
    
  
  if (timeData.length > 0) {
    // Convert dates to month numbers since 2024-01 for x-axis
    const timeChartData = timeData.map(d => {
      const baseDate = new Date('2024-01-01');
      const monthsDiff = (d.date.getFullYear() - baseDate.getFullYear()) * 12 + (d.date.getMonth() - baseDate.getMonth());
      return {
        x: monthsDiff,
        y: d.overall,
        label: d.name,
        date: d.releaseDate
      };
    });
    
    const timeChart = new Chart(document.getElementById('timeChart'), {
      type: 'scatter',
      data: {
        datasets: [{
          label: 'Model Performance',
          data: timeChartData,
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
          borderColor: 'rgb(59, 130, 246)',
          pointRadius: 6,
          pointHoverRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              title: function(context) {
                return context[0].raw.label;
              },
              label: function(context) {
                const point = context.raw;
                return [
                  `Performance: ${point.y.toFixed(1)}%`,
                  `Release: ${point.date}`
                ];
              }
            }
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Months since Jan 2024'
            },
            ticks: {
              callback: function(value) {
                const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                const year = 2024 + Math.floor(value / 12);
                const month = value % 12;
                return months[month] + ' ' + year;
              }
            }
          },
          y: {
            title: {
              display: true,
              text: 'Overall Performance (%)'
            },
            min: 0,
            max: 100
          }
        }
      }
    });
  }
  
  // Performance vs Model Size Chart
  const sizeData = chartData.filter(d => d.sizeValue > 0 && d.overall > 0);
  
  if (sizeData.length > 0) {
    const sizeChart = new Chart(document.getElementById('sizeChart'), {
      type: 'scatter',
      data: {
        datasets: [{
          label: 'Model Performance vs Size',
          data: sizeData.map(d => ({
            x: d.sizeValue,
            y: d.overall
          })),
          backgroundColor: 'rgba(220, 38, 38, 0.8)',
          borderColor: 'rgb(220, 38, 38)',
          pointRadius: 6,
          pointHoverRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              title: function(context) {
                const index = context[0].dataIndex;
                return sizeData[index].name;
              },
              label: function(context) {
                const index = context.dataIndex;
                const point = sizeData[index];
                return [
                  `Organization: ${point.organization}`,
                  `Model Size: ${point.modelSize}`,
                  `Performance: ${point.overall.toFixed(1)}%`
                ];
              }
            }
          }
        },
        scales: {
          x: {
            type: 'logarithmic',
            title: {
              display: true,
              text: 'Model Size (B Parameters)'
            },
            ticks: {
              callback: function(value) {
                return value + 'B';
              }
            }
          },
          y: {
            title: {
              display: true,
              text: 'Overall Performance (%)'
            },
            min: 0,
            max: 100
          }
        }
      }
    });
  }
  
  // Performance vs Price Chart
  const priceData = chartData.filter(d => d.priceValue > 0 && d.overall > 0);
  
  if (priceData.length > 0) {
    const priceChart = new Chart(document.getElementById('priceChart'), {
      type: 'scatter',
      data: {
        datasets: [{
          label: 'Model Performance vs Price',
          data: priceData.map(d => ({
            x: d.priceValue,
            y: d.overall
          })),
          backgroundColor: 'rgba(34, 197, 94, 0.8)',
          borderColor: 'rgb(34, 197, 94)',
          pointRadius: 6,
          pointHoverRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              title: function(context) {
                const index = context[0].dataIndex;
                return priceData[index].name;
              },
              label: function(context) {
                const index = context.dataIndex;
                const point = priceData[index];
                return [
                  `Organization: ${point.organization}`,
                  `Price: $${point.priceValue.toFixed(3)}/2k images`,
                  `Performance: ${point.overall.toFixed(1)}%`
                ];
              }
            }
          }
        },
        scales: {
          x: {
            type: 'logarithmic',
            title: {
              display: true,
              text: 'Price ($) per 2k Images'
            },
            ticks: {
              callback: function(value) {
                return '$' + value.toFixed(3);
              }
            }
          },
          y: {
            title: {
              display: true,
              text: 'Overall Performance (%)'
            },
            min: 0,
            max: 100
          }
        }
      }
    });
  }
  
  
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  loadLeaderboardData().then(() => {
    initializeCharts();
  });
  
  // Add click handlers for sort headers
  document.querySelectorAll('.sort-header').forEach(header => {
    header.addEventListener('click', () => {
      const field = header.getAttribute('data-field');
      sortData(field);
    });
  });
  
  // Add filter handlers
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const accessType = btn.getAttribute('data-filter');
      filterByAccess(accessType);
    });
  });
});