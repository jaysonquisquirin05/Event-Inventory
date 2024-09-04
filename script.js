document.getElementById('equipmentForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('equipmentName').value;
    const type = document.getElementById('equipmentType').value;
    const quantity = document.getElementById('quantity').value;
    const condition = document.getElementById('condition').value;

    addEquipmentToInventory(name, type, quantity, condition);
    updateDashboard();

    document.getElementById('equipmentForm').reset();
});

function addEquipmentToInventory(name, type, quantity, condition) {
    const tableBody = document.getElementById('inventoryBody');
    const row = document.createElement('tr');

    row.innerHTML = `
        <td>${name}</td>
        <td>${type}</td>
        <td>${quantity}</td>
        <td>${condition}</td>
        <td class="actions"><button onclick="deleteRow(this)">Delete</button></td>
    `;

    tableBody.appendChild(row);
}

function deleteRow(button) {
    const row = button.parentNode.parentNode;
    row.parentNode.removeChild(row);
    updateDashboard();
}

function updateDashboard() {
    const rows = document.getElementById('inventoryBody').getElementsByTagName('tr');
    let totalEquipment = rows.length;
    let totalQuantity = 0;
    let goodCondition = 0;
    let needsRepair = 0;

    for (let row of rows) {
        totalQuantity += parseInt(row.cells[2].innerText);
        if (row.cells[3].innerText.toLowerCase() === 'good') {
            goodCondition++;
        } else if (row.cells[3].innerText.toLowerCase() === 'needs repair') {
            needsRepair++;
        }
    }

    document.getElementById('totalEquipment').innerText = totalEquipment;
    document.getElementById('totalQuantity').innerText = totalQuantity;
    document.getElementById('goodCondition').innerText = goodCondition;
    document.getElementById('needsRepair').innerText = needsRepair;

    updateChart(goodCondition, needsRepair);
}

function updateChart(good, repair) {
    const ctx = document.getElementById('conditionChart').getContext('2d');
    if (window.conditionChart) {
        window.conditionChart.destroy();
    }

    window.conditionChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Good Condition', 'Needs Repair'],
            datasets: [{
                data: [good, repair],
                backgroundColor: ['#5cb85c', '#d9534f'],
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
        }
    });
}

// Initialize the dashboard on page load
updateDashboard();
//----------------------------------------------------------------
//javascript for calendar.html
document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        initialView: 'dayGridMonth',
        editable: true,
        selectable: true,
        events: [], // You can fetch events from an API or add them manually
        dateClick: function(info) {
            const taskTitle = prompt('Enter Task Title:');
            if (taskTitle) {
                calendar.addEvent({
                    title: taskTitle,
                    start: info.dateStr,
                    allDay: true
                });
            }
        }
    });
    calendar.render();

    // Handle form submission
    document.getElementById('task-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const title = document.getElementById('task-title').value;
        const date = document.getElementById('task-date').value;
        const time = document.getElementById('task-time').value;

        if (title && date) {
            const dateTime = `${date}T${time}`;
            calendar.addEvent({
                title: title,
                start: dateTime,
                allDay: false
            });

            // Reset form
            this.reset();
        }
    });
});
