/** @jsxRuntime classic */
import React, { useState } from 'react';
import { CheckCircle, XCircle, CreditCard, ArrowRight } from 'lucide-react';

const NICValidator = () => {
  type Step = { state: string; action: string; stack: string[] };

  const [input, setInput] = useState<string>('');
  const [result, setResult] = useState<Record<string, any> | null>(null);
  const [steps, setSteps] = useState<Step[]>([]);
  const [loading, setLoading] = useState(false);

  const validateNIC = async (nic: string) => {
    setLoading(true);
    setSteps([]);
    setResult(null);

    try {
      const response = await fetch('http://localhost:5001/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nic }),
      });

      const data = await response.json();
      
      setResult(data);
      setSteps(data.execution_log || []);
      
    } catch (error) {
      console.error('Error validating NIC:', error);
      setResult({ accepted: false, message: 'Error connecting to validation server' });
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = () => {
    if (input.trim()) {
      validateNIC(input.trim());
    }
  };

  const testCases = [
    { code: '951234567V', desc: 'Old Format (Valid)' },
    { code: '199512345678', desc: 'New Format (Valid)' },
    { code: '123456789', desc: 'Missing Suffix' },
    { code: '1234567890123', desc: 'Too Long' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <CreditCard className="w-8 h-8 text-teal-600" />
            <h1 className="text-3xl font-bold text-gray-800">
              Sri Lankan NIC Validator
            </h1>
          </div>
          <p className="text-gray-600">
            Pushdown Automaton (PDA) based validator for Sri Lankan National Identity Cards (Old & New Formats)
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Input NIC Number</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter NIC Number
              </label>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleValidate()}
                placeholder="e.g., 951234567V or 199512345678"
                maxLength={12}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={handleValidate}
              disabled={loading}
              className="w-full bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors font-medium disabled:opacity-50"
            >
              {loading ? 'Validating...' : 'Validate NIC'}
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
                    <p><strong>Type:</strong> {result.type}</p>
                    <p><strong>Message:</strong> {result.message}</p>
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
                      validateNIC(test.code);
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
                {steps.map((step: Step, index: number) => (
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
                <CreditCard className="w-16 h-16 mx-auto mb-3 opacity-50" />
                <p>Enter an NIC number to see PDA execution steps</p>
              </div>
            )}
          </div>
        </div>

        {/* Formal Definition */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">PDA Formal Definition</h2>
          <div className="space-y-3 text-sm font-mono">
            <p><strong>Alphabet (Σ):</strong> {'{0-9, V, X}'}</p>
            <p><strong>Stack Alphabet (Γ):</strong> {'{D, Z₀}'}</p>
            <p><strong>States (Q):</strong> {'{q₀, q₁, q₂, q_accept, q_reject}'}</p>
            <p><strong>Start State (q₀):</strong> Initial state</p>
            <p><strong>Accepting States (F):</strong> {'{q_accept}'}</p>
            <p><strong>Transition Function (δ):</strong></p>
            <ul className="ml-6 mt-2 space-y-1 text-xs">
              <li>δ(q₀, ε, Z₀) → (q₁, Z₀) - Start</li>
              <li>δ(q₁, digit, Z₀) → (q₁, D·Z₀) - Push digit</li>
              <li>δ(q₁, digit, D) → (q₁, D·D) - Push digit</li>
              <li>δ(q₁, V/X, D) → (q₂, D) - Check Old Format (Stack=10)</li>
              <li>δ(q₁, ε, D) → (q_accept, ε) - Check New Format (Stack=13)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NICValidator;
