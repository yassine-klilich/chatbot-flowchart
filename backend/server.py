from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson.objectid import ObjectId
from openai import OpenAI
import json
import os

app = Flask(__name__)

# CORS configuration with specific options
cors = CORS(app, resources={
  r"/api/*": {
    "origins": ["http://localhost:4200"],
    "methods": ["GET", "POST", "PUT", "DELETE"],
    "allow_headers": ["Content-Type", "Authorization"]
  },
  r"/openai/*": {
    "origins": ["http://localhost:4200"],
    "methods": ["POST"],
    "allow_headers": ["Content-Type", "Authorization"]
  },
})

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['chat_flowchart']
chatbots_collection = db['chatbots']

# Route to get all chats
@app.route('/api', methods=['GET'])
def get_chats():
    chatbotDocuments = chatbots_collection.find({}, {'operators': 0})
    document_list = [{**doc, '_id': str(doc['_id'])} for doc in chatbotDocuments]
    return jsonify(document_list)

# Route to get a chat by id
@app.route('/api/<string:_id>', methods=['GET'])
def get_chat(_id):
  chat = chatbots_collection.find_one({"_id": ObjectId(_id)}, {'_id': False})
  if chat:
    return jsonify(chat)
  else:
    return jsonify({'error': 'Chat not found'}), 404

# Route to create a new chat
@app.route('/api', methods=['POST'])
def create_chat():
  new_chat = request.get_json()
  if not new_chat:
    return jsonify({'error': 'Invalid data'}), 400
  
  result = chatbots_collection.insert_one(new_chat)
  new_chat['_id'] = str(result.inserted_id)
  return jsonify(new_chat), 201


# PUT endpoint to update a chat by ID
@app.route('/api/<string:_id>', methods=['PUT'])
def update_chat(_id):
  updated_data = request.get_json()
  if not updated_data:
    return jsonify({'error': 'Invalid data'}), 400
  
  result = chatbots_collection.update_one({"_id": ObjectId(_id)}, {"$set": updated_data})
  if result.matched_count:
    updated_data['_id'] = _id
    return jsonify(updated_data)
  else:
    return jsonify({'error': 'Chat not found'}), 404


# PUT endpoint to update chat's name by ID
@app.route('/api/name/<string:_id>', methods=['PUT'])
def update_name(id):
  data = request.get_json()
  new_name = data.get('name')
  
  if not new_name:
    return jsonify({"error": "Name is required"}), 400
  
  # Update the document with the new name
  result = chatbots_collection.update_one(
    {"_id": ObjectId(id)},
    {"$set": {"name": new_name}}
  )
  
  if result.matched_count == 0:
    return jsonify({"error": "Document not found"}), 404
  
  return jsonify({"message": "Name updated successfully"}), 200

# DELETE endpoint to delete a chat by ID
@app.route('/api/<string:_id>', methods=['DELETE'])
def delete_chat(_id):
  result = chatbots_collection.delete_one({"_id": ObjectId(_id)})
  if result.deleted_count:
    return jsonify({'message': 'Chat deleted'}), 200
  else:
    return jsonify({'error': 'Chat not found'}), 404

  
# Connect to OpenAI API.
@app.route('/openai', methods=['POST'])
def openai():
  data = request.get_json()
  if not data:
    return jsonify({'error': 'Invalid data'}), 400
  
  client = OpenAI(
    api_key=os.getenv('openai_token'),
  )
  response = client.chat.completions.create(
    # model = "gpt-3.5-turbo-0125",
    model = "gpt-4-turbo",
    messages = data.get('messages')
  )
  return response.choices[0].message.content
  

if __name__ == '__main__':
    app.run(debug=True)
