import json
import requests
import re

# bulk api
es_url = "http://localhost:9200/_bulk"
headers = {"Content-Type": "application/x-ndjson"}
data_file = "books.json"

def upload_index_mapping(url, index_name, mappings):
    response = requests.put(f"{url}/{index_name}", headers={"Content-Type": "application/json"}, data=json.dumps(mappings))
    if response.status_code in [200, 201]:
        print(f"Index {index_name} created successfully.")
    else:
        print(f"Failed to create index {index_name}. Response: {response.text}")
        
es_index_url = "http://localhost:9200/books"
index_mappings = {
    "mappings": {
        "properties": {
            "name": {"type": "text"},
            "author": {"type": "text"},
            "category": {"type": "keyword"},
            "price": {"type": "float"},
            "img_paths": {"type": "keyword"}
        }
    }
}

upload_index_mapping(es_index_url, "books", index_mappings)

            
# clean price data
def clean_price(price):
    cleaned_price = re.sub(r"[^\d.]", "", price)
    try:
        return float(cleaned_price)
    except ValueError:
        print(f"Error converting price: {price}")
        return 0.0

def generate_bulk_payload(documents):
    payload = ""
    for doc_id, doc in documents:
        payload += json.dumps({"index": {"_index": "books", "_id": doc_id}}) + "\n"
        payload += json.dumps(doc) + "\n"
    return payload


batch_size = 500 
documents = []

with open(data_file, 'r') as file:
    for line in file:
        data = json.loads(line)
        doc_id = data["_id"]["$oid"]
        document = {
            "name": data["name"],
            "author": data["author"],
            "category": data["category"],
            "price": clean_price(data["price"]),
            "img_paths": data["img_paths"]
        }
        documents.append((doc_id, document))

        if len(documents) >= batch_size:
            payload = generate_bulk_payload(documents)
            response = requests.post(es_url, headers=headers, data=payload)
            if response.status_code == 200:
                print("Batch indexed successfully")
            documents = []  
            
    if documents:
        payload = generate_bulk_payload(documents)
        response = requests.post(es_url, headers=headers, data=payload)
        if response.status_code == 200:
            print("Last batch indexed successfully")
            