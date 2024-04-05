from flask import Flask, render_template, jsonify, request
import pandas as pd

app = Flask(__name__)

# Load the dataset
df = pd.read_csv('./dataSheet/sample_electric_vehicle_data.csv')

# Convert 'Date' column to datetime type
df['Date'] = pd.to_datetime(df['Date'])

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/reports', methods=['POST'])
def get_report_data():
    req_data = request.get_json()
    report_type = req_data['report_type']
    frequency = req_data['frequency']
    start_date = req_data['start_date']
    end_date = req_data['end_date']

    # Filter data based on report type and time frame
    filtered_data = df[(df['Date'] >= start_date) & (df['Date'] <= end_date)]

    if frequency == 'Daily':
        report_data = filtered_data.groupby('Date')['Miles Driven'].sum().reset_index()
    elif frequency == 'Weekly':
        report_data = filtered_data.resample('W-Mon', on='Date')['Miles Driven'].sum().reset_index()
    elif frequency == 'Monthly':
        report_data = filtered_data.resample('M', on='Date')['Miles Driven'].sum().reset_index()
    elif frequency == 'Yearly':
        report_data = filtered_data.resample('Y', on='Date')['Miles Driven'].sum().reset_index()
    else:
        return jsonify({'error': 'Invalid frequency'})

    return jsonify(report_data.to_dict(orient='records'))

if __name__ == '__main__':
    app.run(debug=True)