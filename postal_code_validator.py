def postal_code_validator(code):
    # Initial state q0
    state = 0

    for ch in code:
        # Transition: If input is a digit (0-9)
        if ch.isdigit():
            state += 1 # Move to next state (q1, q2, ... q5)
            
            # If we exceed 5 digits, we go to a dead state (REJECT)
            if state > 5:
                return "REJECT"
        else:
            # Transition: If input is not a digit, go to dead state (REJECT)
            return "REJECT"

    # Final State Check: We must be exactly in state q5 (5 digits read)
    if state == 5:
        return "ACCEPT"
    else:
        return "REJECT"


# Test cases
test_codes = [
    "00100",
    "20000",
    "81000",
    "1234A",
    "123456",
    "123"
]

for code in test_codes:
    print(code, "→", postal_code_validator(code))

# Interactive Mode
print("\n--- Interactive Mode ---")
print("Enter a Sri Lankan postal code to validate (or type 'exit' to quit).")
print("Rules: Exactly 5 digits, numbers only.")

while True:
    user_input = input("\nEnter Postal Code: ")
    if user_input.lower() == 'exit':
        print("Exiting...")
        break
    
    result = postal_code_validator(user_input)
    print(f"Result: {result}")
