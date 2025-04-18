import sys
import json

# Example function to simulate processing (e.g., generating interview questions)
def generate_interview_questions(data):
    # In a real-world application, you can use AI models or logic here to generate questions
    skills = data.get("skills", [])
    questions = []

    if "Java" in skills:
        questions.append("How do you handle multi-threading in Java?")
    if "Python" in skills:
        questions.append("What is the difference between deep copy and shallow copy in Python?")
    if "Web Development" in skills:
        questions.append("Can you explain the difference between a GET and POST request?")
    
    return questions

def main():
    try:
        # Read input data from stdin (Express sends data here)
        input_data = sys.stdin.read()
        
        # Parse the input data (expects JSON)
        data = json.loads(input_data)
        
        # Generate interview questions based on the input data
        questions = generate_interview_questions(data)
        
        # Create a response to send back to the Express server
        response = {
            "success": True,
            "questions": questions
        }
        
        # Send the response back to stdout (Express will capture this)
        print(json.dumps(response))
    
    except Exception as e:
        # In case of any error, send a failure response
        error_response = {
            "success": False,
            "message": str(e)
        }
        print(json.dumps(error_response))

if __name__ == "__main__":
    main()
