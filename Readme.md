This is a NodeJS Implementation of a simple demonstration of  microservices architecture

Make your .env file and provide MONGO_URI in it:
     `MONGO_URI=mongo_url`

Install your dependancies:

    "axios": "^1.6.7",
    "dotenv": "^16.4.5",
    "express": "^4.18.3",
    "mongoose": "^8.2.1"

You need to run every file seperately:

    - cd Book
        - node books.js
    - cd Customer
        - node customers.js
    - cd Order
        - node orders.js


For the testing of GCP cloud functions such as HTTPs Trigger you need to import the function-source.zip in inline editor of GCP cloud function and you're good to go.
