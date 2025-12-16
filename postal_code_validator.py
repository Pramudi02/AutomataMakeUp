def postal_code_validator(code):
    state = 0

    for ch in code:
        if ch.isdigit():
            state += 1
            if state > 5:
                return "REJECT"
        else:
            return "REJECT"

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