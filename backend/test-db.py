from pymongo import MongoClient

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')

# Access database
db = client['mydatabase']

# Access collection
collection = db['books']

# Insert a document
book = {"title": "1984", "author": "George Orwell", "year": 1949}
result = collection.insert_one(book)
print(f"Inserted book with id: {result.inserted_id}")

# Insert multiple documents
books = [
    {"title": "To Kill a Mockingbird", "author": "Harper Lee", "year": 1960},
    {"title": "The Great Gatsby", "author": "F. Scott Fitzgerald", "year": 1925}
]
result = collection.insert_many(books)
print(f"Inserted books with ids: {result.inserted_ids}")

# Find a document
book = collection.find_one({"title": "1984"})
print(f"Found book: {book}")

# Find multiple documents
for book in collection.find():
    print(book)

# Update a document
result = collection.update_one({"title": "1984"}, {"$set": {"year": 1950}})
print(f"Matched {result.matched_count} documents and modified {result.modified_count} documents")

# Delete a document
result = collection.delete_one({"title": "1984"})
print(f"Deleted {result.deleted_count} document")

# Delete multiple documents
result = collection.delete_many({"author": "Harper Lee"})
print(f"Deleted {result.deleted_count} documents")
