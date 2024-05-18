from flask import Flask, request, jsonify
from pymongo import MongoClient
from bson.objectid import ObjectId

app = Flask(__name__)

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['chat_flowchart']
chatbots_collection = db['chatbots']

# Route to get all chats
@app.route('/chats', methods=['GET'])
def get_chats():
  chats = list(chatbots_collection.find({}, {'_id': False}))
  return jsonify(chats)

# Route to get a chat by id
@app.route('/chats/<string:chat_id>', methods=['GET'])
def get_chat(chat_id):
  chat = chatbots_collection.find_one({"_id": ObjectId(chat_id)}, {'_id': False})
  if chat:
    return jsonify(chat)
  else:
    return jsonify({'error': 'Chat not found'}), 404

# Route to create a new chat
@app.route('/chats', methods=['POST'])
def create_chat():
  new_chat = request.get_json()
  if not new_chat:
    return jsonify({'error': 'Invalid data'}), 400
  
  result = chatbots_collection.insert_one(new_chat)
  new_chat['_id'] = str(result.inserted_id)
  return jsonify(new_chat), 201


# PUT endpoint to update a chat by ID
@app.route('/chats/<string:chat_id>', methods=['PUT'])
def update_chat(chat_id):
  updated_data = request.get_json()
  if not updated_data:
    return jsonify({'error': 'Invalid data'}), 400
  
  result = chatbots_collection.update_one({"_id": ObjectId(chat_id)}, {"$set": updated_data})
  if result.matched_count:
    updated_data['_id'] = chat_id
    return jsonify(updated_data)
  else:
    return jsonify({'error': 'Chat not found'}), 404

# DELETE endpoint to delete a chat by ID
@app.route('/chats/<string:chat_id>', methods=['DELETE'])
def delete_chat(chat_id):
  result = chatbots_collection.delete_one({"_id": ObjectId(chat_id)})
  if result.deleted_count:
    return jsonify({'message': 'Chat deleted'}), 200
  else:
    return jsonify({'error': 'Chat not found'}), 404


if __name__ == '__main__':
    app.run(debug=True)
