function fetchReportData() {
    const reportType = document.getElementById('reportType').value;
    const frequency = document.getElementById('frequency').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    const requestData = {
        report_type: reportType,
        frequency: frequency,
        start_date: startDate,
        end_date: endDate
    };

    fetch('/api/reports', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
    .then(response => response.json())
    .then(data => {
        // Display report data
        console.log(data);
        // Clear previous data
        const reportDataContainer = document.getElementById('reportData');
        reportDataContainer.innerHTML = '';

        // Check if data is empty
        if (data.length === 0) {
            const noDataMessage = document.createElement('div');
            noDataMessage.textContent = 'No Data Found';
            reportDataContainer.appendChild(noDataMessage);
        } else {
            // Create a table to display the data
            const table = document.createElement('table');
            table.innerHTML = `
                <tr>
                    <th>Date</th>
                    <th>Miles Driven</th>
                </tr>
            `;

            // Add rows for each data item
            data.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.Date}</td>
                    <td>${item['Miles Driven']}</td>
                `;
                table.appendChild(row);
            });

            // Append the table to the reportDataContainer
            reportDataContainer.appendChild(table);
        }
    })
    .catch(error => {
        console.error('Error fetching report data:', error);
    });
}
