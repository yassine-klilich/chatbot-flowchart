from openai import OpenAI

# client = OpenAI(
#     # This is the default and can be omitted
#     api_key="",
# )

# def get_response(message):
#     response = client.chat.completions.create(
#         model="gpt-3.5-turbo-0125",  # or another model version
#         messages=[{"role": "system", "content": "You are a helpful assistant."},
#             {"role": "user", "content": message}],
#     )
#     return response.choices[0].message.content

# user_input = "Hello, how can I help you today?"
# print(get_response(user_input))







client = OpenAI(
    # This is the default and can be omitted
    api_key="",
)

def chat_with_openai(prompt):
    response = client.chat.completions.create(
        model="gpt-3.5-turbo-0125",
        messages=prompt
    )
    return response.choices[0].message.content

def main():
    print("Start chatting with the AI (type 'exit' to stop):")
    user_input = ""
    conversation_history = [{"role": "system", "content": "Read the 'question' property inside the JSON and check if the property 'answer' is sentimentally correct and return true or false and a description why in a JSON format."}]

    while True:
        user_input = input("You: ")
        if user_input.lower() == "exit":
            print("Conversation ended.")
            break
        
        mm = f"""


        {{
            "question": 
        }}
        """

        conversation_history.append({"role": "user", "content": user_input})
        ai_response = chat_with_openai(conversation_history)
        conversation_history.append({"role": "assistant", "content": ai_response})
        
        print(f"AI: {ai_response}")

if __name__ == "__main__":
    main()
