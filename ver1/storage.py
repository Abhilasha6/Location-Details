from flask import Flask, request
from openpyxl import load_workbook

app = Flask(__name__)

@app.route('/update_excel', methods=['POST'])
def update_excel():
    data = request.json
    location = data.get('location')
    latitude = data.get('latitude')
    longitude = data.get('longitude')
    elevation = data.get('elevation')

    try:
        workbook = load_workbook('location-data.xlsx')
        sheet = workbook.active
        sheet.append([location, latitude, longitude, elevation])
        workbook.save('location-data.xlsx')
        return 'Data added to Excel successfully.'
    except Exception as e:
        return f'Error: {str(e)}', 500

if __name__ == '__main__':
    app.run(debug=True)
