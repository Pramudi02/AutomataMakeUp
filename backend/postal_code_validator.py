from flask import Flask, request, jsonify
from flask_cors import CORS
from pda_logic import PostalCodePDA

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

pda = PostalCodePDA()

@app.route('/validate', methods=['POST'])
def validate_postal_code():
    data = request.get_json()
    
    if not data or 'code' not in data:
        return jsonify({'error': 'Missing postal code'}), 400
    
    postal_code = str(data['code'])
    result = pda.validate(postal_code)
    
    return jsonify(result)

@app.route('/districts', methods=['GET'])
def get_districts():
    # Transform district_ranges into a format suitable for the frontend
    districts = {}
    for district, info in pda.district_ranges.items():
        districts[district] = {
            'prefix': info['prefix'],
            'range': info['ranges'],
            'description': f"{info['province']} Province"
        }
    return jsonify(districts)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
