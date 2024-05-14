from openai import OpenAI

client = OpenAI(
    # This is the default and can be omitted
    api_key="sk-proj-BhQvWruFrnz5TLeE0OCxT3BlbkFJsR8Fdt601U27l13uHDo7",
)

def get_response(message):
    response = client.chat.completions.create(
        model="gpt-3.5-turbo-0125",  # or another model version
        messages=[{"role": "system", "content": "You are a helpful assistant."},
                  {"role": "user", "content": message}],
    )
    return response.choices[0].message.content

user_input = "Hello, how can I help you today?"
print(get_response(user_input))
