import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Mail, MapPin, ArrowRight } from 'lucide-react';

const PostalCodeValidator = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<any>(null);
  const [steps, setSteps] = useState<any[]>([]);
  const [districtRanges, setDistrictRanges] = useState<any>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch district ranges from backend
    fetch('http://localhost:5000/districts')
      .then(res => res.json())
      .then(data => setDistrictRanges(data))
      .catch(err => console.error('Error fetching districts:', err));
  }, []);

  const validatePostalCode = async (code: string) => {
    setLoading(true);
    setSteps([]);
    setResult(null);

    try {
      const response = await fetch('http://localhost:5000/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();
      
      setResult(data);
      setSteps(data.execution_log || []);
      
    } catch (error) {
      console.error('Error validating postal code:', error);
      setResult({ accepted: false, message: 'Error connecting to validation server' });
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = () => {
    if (input.trim()) {
      validatePostalCode(input.trim());
    }
  };

  const testCases = [
    { code: '10100', desc: 'Colombo Fort' },
    { code: '11000', desc: 'Negombo' },
    { code: '20000', desc: 'Kandy' },
    { code: '80000', desc: 'Galle' },
    { code: '40000', desc: 'Jaffna' },
    { code: '99999', desc: 'Invalid' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Mail className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-800">
              Sri Lankan Postal Code Validator
            </h1>
          </div>
          <p className="text-gray-600">
            Pushdown Automaton (PDA) based validator for Sri Lankan postal codes by district
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Input Postal Code</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter 5-digit Postal Code
              </label>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleValidate()}
                placeholder="e.g., 10100"
                maxLength={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={handleValidate}
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50"
            >
              {loading ? 'Validating...' : 'Validate Postal Code'}
            </button>

            {/* Result Display */}
            {result && (
              <div className={`mt-6 p-4 rounded-lg ${result.accepted ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'}`}>
                <div className="flex items-center gap-2 mb-2">
                  {result.accepted ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-600" />
                  )}
                  <span className={`font-bold ${result.accepted ? 'text-green-800' : 'text-red-800'}`}>
                    {result.accepted ? 'ACCEPTED' : 'REJECTED'}
                  </span>
                </div>
                
                {result.accepted ? (
                  <div className="text-sm text-gray-700">
                    <p><strong>District:</strong> {result.district}</p>
                    <p><strong>Province:</strong> {result.province}</p>
                  </div>
                ) : (
                  <p className="text-sm text-red-700">{result.message}</p>
                )}
              </div>
            )}

            {/* Test Cases */}
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Quick Test Cases:</h3>
              <div className="grid grid-cols-2 gap-2">
                {testCases.map((test) => (
                  <button
                    key={test.code}
                    onClick={() => {
                      setInput(test.code);
                      validatePostalCode(test.code);
                    }}
                    className="text-left px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm transition-colors"
                  >
                    <div className="font-medium text-gray-800">{test.code}</div>
                    <div className="text-xs text-gray-600">{test.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* PDA Execution Steps */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">PDA Execution Steps</h2>
            
            {steps.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {steps.map((step, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border-2 ${
                      step.state === 'q_accept' ? 'bg-green-50 border-green-300' :
                      step.state === 'q_reject' ? 'bg-red-50 border-red-300' :
                      'bg-blue-50 border-blue-300'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <ArrowRight className={`w-5 h-5 mt-0.5 ${
                        step.state === 'q_accept' ? 'text-green-600' :
                        step.state === 'q_reject' ? 'text-red-600' :
                        'text-blue-600'
                      }`} />
                      <div className="flex-1">
                        <div className="font-mono text-sm font-semibold text-gray-800">
                          State: {step.state}
                        </div>
                        <div className="text-sm text-gray-700 mt-1">
                          {step.action}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          Stack: [{step.stack.join(', ')}]
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <Mail className="w-16 h-16 mx-auto mb-3 opacity-50" />
                <p>Enter a postal code to see PDA execution steps</p>
              </div>
            )}
          </div>
        </div>

        {/* District Reference Table */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">District Postal Code Reference</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(districtRanges).map(([district, info]: [string, any]) => (
              <div key={district} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="w-4 h-4 text-indigo-600" />
                  <span className="font-semibold text-gray-800">{district}</span>
                </div>
                <div className="text-sm text-gray-600">
                  <div>Prefix: {info.prefix}xxx</div>
                  <div>Range: {info.range.map(([min, max]: [number, number]) => `${min}-${max}`).join(', ')}</div>
                  <div className="text-xs text-gray-500 mt-1">{info.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Formal Definition */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">PDA Formal Definition</h2>
          <div className="space-y-3 text-sm font-mono">
            <p><strong>Alphabet (Σ):</strong> {'{0, 1, 2, 3, 4, 5, 6, 7, 8, 9}'}</p>
            <p><strong>Stack Alphabet (Γ):</strong> {'{0-9, Z₀}'}</p>
            <p><strong>States (Q):</strong> {'{q₀, q₁, q₂, q₃, q₄, q_accept, q_reject}'}</p>
            <p><strong>Start State (q₀):</strong> Initial validation state</p>
            <p><strong>Accepting States (F):</strong> {'{q_accept}'}</p>
            <p><strong>Transition Function (δ):</strong></p>
            <ul className="ml-6 mt-2 space-y-1 text-xs">
              <li>δ(q₀, ε, Z₀) → (q₁, Z₀) - Start validation</li>
              <li>δ(q₁, digit, Z₀) → (q₂, digit·Z₀) - Push digits to stack</li>
              <li>δ(q₂, digit, top) → (q₂, digit·top) - Continue pushing</li>
              <li>δ(q₂, ε, stack) → (q₃, stack) - Validate district prefix</li>
              <li>δ(q₃, ε, digit) → (q₄, ε) - Pop and verify range</li>
              <li>δ(q₄, ε, Z₀) → (q_accept, ε) - Accept if valid</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostalCodeValidator;
