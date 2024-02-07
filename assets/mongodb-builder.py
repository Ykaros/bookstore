import pandas as pd
from pymongo import MongoClient

books = pd.read_csv('data.csv')
client = MongoClient('localhost', 27017)
db = client['bookstore']
collection = db['books']

books_list = books.to_dict(orient='records')
collection.insert_many(books_list)

client.close()
