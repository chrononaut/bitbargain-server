# API Endpoints

**Table of Contents** 

- [**Get Item**](#get-item)
- [**Purchase Item**](#buy-item)
- [**Sell Item**](#sell-item)
- [**Transaction Role**](#transaction-role)
- [**Transaction - Send Payment**](#transaction-send-payment)



# Get Item
----
##### Get an item using its ID

* **URL**

  /items/:id

* **Method:**
  
  `GET`
  
*  **URL Params**

   id: Integer

*  **Data Params**

    None

* **Success Response:**

  * **Code:** 200
  * **Content:** `{ id: '', title: '', ... }`
 
* **Error Response:**

  * **Code:** 404
  * **Content:** `{ error : "Item does not exist" }`

* **Sample Call:**

  ```javascript
    fetch('http://localhost:9009/items/:id', {
      method: 'GET',
      credentials: 'include'
    })
  ```
  
# Purchase Item
----
### Purchase an item

* **URL**

  /items/:id/buy

* **Method:**
  
  `POST`
  
*  **Request Headers**

    `Cookie: SESSION_ID`
  
*  **URL Params**

    id: Integer
    
* **Data Params**

  userId: String

* **Success Response:**

  * **Code:** 200
 
* **Error Response:**

  * **Code:** 500
  * **Content:** `{ error: 'Item not found' }`

* **Sample Call:**

  ```javascript
    fetch('http://localhost:9009/items/:id/buy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
      crendentials: 'include'
    })
  ```
  
# Sell Item
----
### Sell an item

* **URL**

  /items/sell

* **Method:**
  
  `POST`
  
*  **URL Params**

   id: Integer
   
*  **Request Headers**

    `Cookie: SESSION_ID` 

* **Data Params**

    * title: String
    * description: String
    * price: Integer
    * categories: JSON Array
    * images: JSON Array

* **Success Response:**

  * **Code:** 200
 
* **Error Response:**

  * **Code:** 500

* **Sample Call:**

  ```javascript
    fetch('http://localhost:9009/items/sell', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: '',
        description: '',
        price: '',
        submitted: false,
        categories: [...],
        images: [...]
      },
      credentials: 'include'
    })
  ```
  
# Transaction Role
----
### Determine user role in transaction

* **URL**

  /items/:id/:email/transaction

* **Method:**
  
  `GET`
  
* **URL Params**

   * id: Integer,
   * email: String
   
* **Request Headers**

    `Cookie: SESSION_ID` 

* **Data Params**

    None
    
* **Success Response:**

  * **Code:** 200
  * **Content:** `{ role: '...' }`
 
* **Error Response:**

  * **Code:** 500

* **Sample Call:**

  ```javascript
    fetch('http://localhost:9009/items/email/transaction', {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      },
      credentials: 'include'
    })
  ```
  
# Transaction - Send Payment
----
 ### Send a payment and complete transaction

* **URL**

  /items/transaction

* **Method:**
  
  `POST`
  
* **URL Params**

   None
   
* **Request Headers**

    `Cookie: SESSION_ID` 

* **Data Params**

    * id: String
    * price: Integer
    * email: String
    
* **Success Response:**

  * **Code:** 200
  * **Content:** `{ 'Successful Payment...' }`
 
* **Error Response:**

  * **Code:** 500

* **Sample Call:**

  ```javascript
    fetch('http://localhost:9009/items/transaction', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
  ```
