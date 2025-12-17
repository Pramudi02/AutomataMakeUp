import sys
import os

# Add the backend directory to the system path so we can import the PDA logic
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from nic_pda_logic import NICPDA

def main():
    pda = NICPDA()
    
    print("="*50)
    print("Sri Lankan NIC Validator (Terminal Mode)")
    print("="*50)
    print("Type 'exit' or 'quit' to stop.")
    print("-" * 50)

    while True:
        try:
            user_input = input("\nEnter NIC Number: ").strip()
            
            if user_input.lower() in ['exit', 'quit']:
                print("Exiting...")
                break
            
            result = pda.validate(user_input)
            
            print(f"\nResult: {'ACCEPTED' if result['accepted'] else 'REJECTED'}")
            print(f"Message: {result['message']}")
            
            if result['accepted']:
                print(f"Type: {result['type']}")
            
            print("\nExecution Log:")
            for step in result['execution_log']:
                stack_str = "[" + ", ".join(step['stack']) + "]"
                print(f"  State: {step['state']:<10} | Stack: {stack_str:<20} | Action: {step['action']}")
                
        except KeyboardInterrupt:
            print("\nExiting...")
            break
        except Exception as e:
            print(f"An error occurred: {e}")

if __name__ == "__main__":
    main()
