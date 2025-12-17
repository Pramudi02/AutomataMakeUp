from flask import Flask, request, jsonify
from flask_cors import CORS
from nic_pda_logic import NICPDA

app = Flask(__name__)
CORS(app)

pda = NICPDA()

@app.route('/validate', methods=['POST'])
def validate_nic():
    data = request.get_json()
    
    if not data or 'nic' not in data:
        return jsonify({'error': 'Missing NIC number'}), 400
    
    nic_number = str(data['nic'])
    result = pda.validate(nic_number)
    
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True, port=5001) # Running on port 5001 to avoid conflict
