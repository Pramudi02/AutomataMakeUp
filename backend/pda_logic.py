"""
Sri Lankan Postal Code Validator - PDA Implementation
Automata Theory Make-Up Assignment
Author: [Your Name]
Date: December 2025

This program implements a Pushdown Automaton (PDA) to validate
Sri Lankan postal codes by district.
"""

class PostalCodePDA:
    """
    Pushdown Automaton for Sri Lankan Postal Code Validation
    
    Formal Definition:
    - Σ (Alphabet): {0-9}
    - Γ (Stack Alphabet): {0-9, Z₀}
    - Q (States): {q0, q1, q2, q3, q4, q_accept, q_reject}
    - q₀ (Start State): q0
    - F (Accept States): {q_accept}
    """
    
    def __init__(self):
        # District postal code ranges for Sri Lanka
        self.district_ranges = {
            'Colombo': {'prefix': '00', 'ranges': [(50, 1599)], 'province': 'Western'},
            'Colombo 10': {'prefix': '10', 'ranges': [(10000, 10999)], 'province': 'Western'},
            'Gampaha': {'prefix': '11', 'ranges': [(11000, 11999)], 'province': 'Western'},
            'Kalutara': {'prefix': '12', 'ranges': [(12000, 12689)], 'province': 'Western'},
            'Kandy': {'prefix': '20', 'ranges': [(20000, 20999)], 'province': 'Central'},
            'Matale': {'prefix': '21', 'ranges': [(21000, 21599)], 'province': 'Central'},
            'Nuwara Eliya': {'prefix': '22', 'ranges': [(22000, 22299)], 'province': 'Central'},
            'Galle': {'prefix': '80', 'ranges': [(80000, 80699)], 'province': 'Southern'},
            'Matara': {'prefix': '81', 'ranges': [(81000, 81899)], 'province': 'Southern'},
            'Hambantota': {'prefix': '82', 'ranges': [(82000, 82699)], 'province': 'Southern'},
            'Jaffna': {'prefix': '40', 'ranges': [(40000, 40999)], 'province': 'Northern'},
            'Kilinochchi': {'prefix': '44', 'ranges': [(44000, 44399)], 'province': 'Northern'},
            'Mannar': {'prefix': '41', 'ranges': [(41000, 41999)], 'province': 'Northern'},
            'Vavuniya': {'prefix': '43', 'ranges': [(43000, 43999)], 'province': 'Northern'},
            'Mullaitivu': {'prefix': '42', 'ranges': [(42000, 42999)], 'province': 'Northern'},
            'Batticaloa': {'prefix': '30', 'ranges': [(30000, 30499)], 'province': 'Eastern'},
            'Ampara': {'prefix': '32', 'ranges': [(32000, 32499)], 'province': 'Eastern'},
            'Trincomalee': {'prefix': '31', 'ranges': [(31000, 31999)], 'province': 'Eastern'},
            'Kurunegala': {'prefix': '60', 'ranges': [(60000, 60999)], 'province': 'North Western'},
            'Puttalam': {'prefix': '61', 'ranges': [(61000, 61399)], 'province': 'North Western'},
            'Anuradhapura': {'prefix': '50', 'ranges': [(50000, 50499)], 'province': 'North Central'},
            'Polonnaruwa': {'prefix': '51', 'ranges': [(51000, 51999)], 'province': 'North Central'},
            'Badulla': {'prefix': '90', 'ranges': [(90000, 90699)], 'province': 'Uva'},
            'Monaragala': {'prefix': '91', 'ranges': [(91000, 91999)], 'province': 'Uva'},
            'Ratnapura': {'prefix': '70', 'ranges': [(70000, 70999)], 'province': 'Sabaragamuwa'},
            'Kegalle': {'prefix': '71', 'ranges': [(71000, 71899)], 'province': 'Sabaragamuwa'}
        }
        
        self.state = 'q0'
        self.stack = []
        self.execution_log = []
    
    def reset(self):
        """Reset PDA to initial state"""
        self.state = 'q0'
        self.stack = ['Z0']  # Bottom of stack marker
        self.execution_log = []
    
    def log_step(self, state, action, stack_state):
        """Log each step of PDA execution"""
        self.execution_log.append({
            'state': state,
            'action': action,
            'stack': stack_state.copy()
        })
    
    def validate(self, postal_code):
        """
        Main validation function implementing PDA logic
        
        Args:
            postal_code (str): Input postal code to validate
            
        Returns:
            dict: Validation result with status, district info, and execution log
        """
        self.reset()
        
        # State q0: Initial validation
        self.log_step('q0', f'Starting validation for: {postal_code}', self.stack)
        
        # State q1: Length check
        self.state = 'q1'
        if len(postal_code) != 5:
            self.log_step('q_reject', f'Invalid length: {len(postal_code)} (expected 5)', self.stack)
            return self._create_result(False, 'Postal code must be exactly 5 digits')
        
        self.log_step('q1', 'Length validation passed (5 digits)', self.stack)
        
        # State q2: Digit check
        self.state = 'q2'
        if not postal_code.isdigit():
            self.log_step('q_reject', 'Contains non-digit characters', self.stack)
            return self._create_result(False, 'Postal code must contain only digits')
        
        self.log_step('q2', 'All characters are digits', self.stack)
        
        # Push each digit onto stack (PDA characteristic)
        for i, digit in enumerate(postal_code):
            self.stack.append(digit)
            self.log_step(f'q2_push_{i}', f'Pushed digit "{digit}" onto stack', self.stack)
        
        # State q3: Extract and validate district prefix
        self.state = 'q3'
        prefix = postal_code[:2]
        postal_num = int(postal_code)
        
        self.log_step('q3', f'Extracted district prefix: {prefix}', self.stack)
        
        # State q4: District range validation
        self.state = 'q4'
        district_info = self._find_district(prefix, postal_num)
        
        if district_info:
            # Pop stack (successful validation)
            while len(self.stack) > 1:  # Keep Z0
                popped = self.stack.pop()
                self.log_step('q4_pop', f'Popped "{popped}" from stack', self.stack)
            
            self.state = 'q_accept'
            self.log_step('q_accept', f'✓ Valid postal code for {district_info["district"]}', self.stack)
            
            return self._create_result(True, 'Valid postal code', district_info)
        else:
            self.log_step('q_reject', 'Postal code not in valid district range', self.stack)
            return self._create_result(False, 'Invalid postal code or district range')
    
    def _find_district(self, prefix, postal_num):
        """Find matching district for given prefix and postal code"""
        for district, info in self.district_ranges.items():
            if info['prefix'] == prefix:
                # Check if postal code falls within valid range
                for min_code, max_code in info['ranges']:
                    if min_code <= postal_num <= max_code:
                        return {
                            'district': district,
                            'province': info['province'],
                            'range': f'{min_code}-{max_code}'
                        }
        return None
    
    def _create_result(self, accepted, message, district_info=None):
        """Create standardized result dictionary"""
        result = {
            'accepted': accepted,
            'message': message,
            'execution_log': self.execution_log,
            'final_state': self.state
        }
        
        if district_info:
            result['district'] = district_info['district']
            result['province'] = district_info['province']
            result['range'] = district_info['range']
        
        return result
