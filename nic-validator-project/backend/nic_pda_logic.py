"""
Sri Lankan NIC Validator - PDA Implementation
Automata Theory Make-Up Assignment
"""

class NICPDA:
    """
    Pushdown Automaton for Sri Lankan NIC Validation
    
    Supports two formats:
    1. Old Format: 9 digits + 'V' or 'X' (e.g., 951234567V)
    2. New Format: 12 digits (e.g., 199512345678)
    
    Formal Definition:
    - Σ (Alphabet): {0-9, V, X, v, x}
    - Γ (Stack Alphabet): {D, Z₀} (D represents a digit)
    - Q (States): {q0, q1, q2, q_accept, q_reject}
    """
    
    def __init__(self):
        self.state = 'q0'
        self.stack = []
        self.execution_log = []
    
    def reset(self):
        self.state = 'q0'
        self.stack = ['Z0']
        self.execution_log = []
    
    def log_step(self, state, action, stack_state):
        self.execution_log.append({
            'state': state,
            'action': action,
            'stack': stack_state.copy()
        })
    
    def validate(self, nic_number):
        self.reset()
        nic_number = nic_number.strip()
        
        self.log_step('q0', f'Starting validation for: {nic_number}', self.stack)
        
        # State q1: Process characters
        self.state = 'q1'
        
        for i, char in enumerate(nic_number):
            if char.isdigit():
                self.stack.append('D')
                self.log_step('q1', f'Read digit "{char}", Pushed D', self.stack)
            elif char.upper() in ['V', 'X']:
                # Check if this is the last character
                if i == len(nic_number) - 1:
                    # Check for Old Format (9 digits before V/X)
                    # Stack should have Z0 + 9 Ds = 10 items
                    if len(self.stack) == 10: 
                        self.state = 'q2'
                        self.log_step('q2', f'Read suffix "{char}", Checking stack depth for Old Format', self.stack)
                        return self._finalize_old_format()
                    else:
                        self.log_step('q_reject', f'Invalid digit count for Old Format: {len(self.stack)-1}', self.stack)
                        return self._create_result(False, "Old NIC must have exactly 9 digits before V/X")
                else:
                    self.log_step('q_reject', f'Suffix "{char}" found in middle of string', self.stack)
                    return self._create_result(False, "V/X can only appear at the end")
            else:
                self.log_step('q_reject', f'Invalid character: "{char}"', self.stack)
                return self._create_result(False, "Contains invalid characters")

        # End of input check (for New Format)
        if self.state == 'q1':
            # Stack should have Z0 + 12 Ds = 13 items
            if len(self.stack) == 13:
                self.state = 'q_accept'
                self.log_step('q_accept', 'Stack depth 12 (New Format). Accepted.', self.stack)
                return self._create_result(True, "Valid New Format NIC", {"type": "New (12 digits)"})
            elif len(self.stack) == 10:
                 # This case is hit if input is 9 digits but missing V/X
                 self.log_step('q_reject', '9 digits but missing V/X suffix', self.stack)
                 return self._create_result(False, "Old Format NIC missing V/X suffix")
            else:
                self.log_step('q_reject', f'Invalid length: {len(self.stack)-1} digits', self.stack)
                return self._create_result(False, "Invalid length (Must be 10 chars for Old or 12 for New)")

        return self._create_result(False, "Unknown error")

    def _finalize_old_format(self):
        # Pop all 'D's to empty stack (except Z0)
        while len(self.stack) > 1:
            self.stack.pop()
            self.log_step('q2', 'Popping stack (Old Format Validation)', self.stack)
        
        self.state = 'q_accept'
        self.log_step('q_accept', 'Stack empty. Accepted.', self.stack)
        return self._create_result(True, "Valid Old Format NIC", {"type": "Old (9 digits + V/X)"})

    def _create_result(self, accepted, message, info=None):
        result = {
            'accepted': accepted,
            'message': message,
            'execution_log': self.execution_log,
            'final_state': self.state
        }
        if info:
            result.update(info)
        return result
