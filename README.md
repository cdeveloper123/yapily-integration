# Yapily Integration

## Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone https://github.com/cdeveloper123/yapily-integration.git
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Set up environment variables**:
   - Copy the `.env.example` file to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Update the `.env` file with your environment-specific values (e.g., API keys, client secrets, etc.).
4. **Start the application**:

   ```bash
   npm run start
   ```

5. **Run the test cases**:
   ```bash
   npm run test
   ```

## Steps to Connect to Yapily Sandbox

1. **Log in to your Yapily Developer Account**:

   - Go to [Yapily Developer Console](https://console.yapily.com) and log in to your account.

2. **Create an Application**:

   - In the Yapily Console, create a new application. Once created, it will return an **App UUID** and **App Secret**. Store them securely as you'll need them later for authentication.

3. **Add Institutions**:

   - Navigate to your application within the Yapily Console.
   - Under the **Connected Institutions** tab, click on **Add Institutions**.
   - Search for `modelo-sandbox`, select it, and add it to your application.

4. **Register for Preconfigured Credentials**:

   - After adding `modelo-sandbox`, click on **Register** and select **Yes, preconfigured credentials** to proceed with sandbox configuration.

5. **Add Test Account to Sandbox**:
   - To add a test account in the sandbox, use the following API endpoint:
     ```http
     POST /accounts/initiate-auth
     ```
   - This request will return a **Consent Token**, which will be required for making subsequent API calls.

---

## Endpoints

### 1. **POST /accounts/initiate-auth**

- **Description**: Initiates an authentication request for account access.
- **Response**: Returns an **Authorization URL**.
- **How it works**:

  - Visit the URL, where you will be redirected to the `modelo-sandbox` page.
  - Log in using the test credentials: `mits/mits`.
  - After accepting, you will receive a **Consent Token**.
  - This token is necessary for accessing other Yapily endpoints.

  **Headers**: None required initially.

### 2. **POST /accounts/fetch**

- **Description**: Fetches all accounts associated with the consent token and stores them locally in MongoDB.
- **How it works**:

  - Send the **Consent Token** received from the `/accounts/initiate-auth` request in the headers.

  **Headers**:

  ```json
  {
    "consent-token": "<Consent_Token>"
  }
  ```

### 3. **GET /accounts**

- **Description**: Lists all the accounts stored locally in MongoDB.

  **Response**: Returns a list of accounts fetched from Yapily API.

### 4. **POST /transactions/fetch**

- **Description**: Fetches all the transactions for a specific account ID from Yapily and stores them locally in MongoDB.
- **How it works**:

  - Send the **Consent Token** received earlier in the headers to authenticate the request.

  **Headers**:

  ```json
  {
    "consent-token": "<Consent_Token>"
  }
  ```

### 5. **GET /transactions/:id**

- **Description**: Retrieves the list of transactions from the local MongoDB database for a specific account, identified by its account ID.

  **Parameters**:

  - `id`: The account ID for which to fetch transactions.

  **Response**: A list of transactions for the given account ID.

---

## Notes

- Ensure that your MongoDB instance is properly set up and connected to store account and transaction data.
- The **Consent Token** is critical for authentication, and it must be passed in the `consent-token` header for each endpoint that requires it.
- Make sure to store your **App UUID** and **App Secret** securely. These are required for making API calls to Yapily's sandbox environment.


---


# API Curl 

## 1. **Initiate Authorization for a User to Use Institution Sandbox**

This request initiates the authorization process for a user to access the institution sandbox environment.

### Endpoint:
`POST /accounts/initiate-auth`

### Request:
```bash
curl --location 'http://localhost:5000/accounts/initiate-auth' \
--header 'Content-Type: application/json' \
--data '{
  "applicationUserId": "test-user-1",
  "institutionId": "modelo-sandbox"
}'
```

### Parameters:
- `applicationUserId`: The ID of the user making the request.
- `institutionId`: The ID of the institution sandbox the user is accessing (e.g., "modelo-sandbox").

---

## 2. **Fetch All Accounts from Yapily and Store in Local DB**

This request fetches all the user accounts from Yapily and stores them into your local database.

### Endpoint:
`POST /accounts/fetch`

### Request:
```bash
curl --location --request POST 'http://localhost:5000/accounts/fetch' \
--header 'Content-Type: application/json' \
--header 'consent-token: <Consent_Token>'
```

### Parameters:
- `consent-token`: A token obtained from the authorization process that grants access to the user's accounts.

---

## 3. **Fetch All Accounts from Local Database**

This request fetches all accounts stored in your local database.

### Endpoint:
`GET /accounts`

### Request:
```bash
curl --location 'http://localhost:5000/accounts'
```

### Response:
Returns a list of all accounts stored in the local database.

---

## 4. **Fetch All Transactions of a User from Yapily and Store in Local DB**

This request fetches all transactions associated with a user’s specific account from Yapily and stores them into your local database.

### Endpoint:
`POST /transactions/fetch`

### Request:
```bash
curl --location 'http://localhost:5000/transactions/fetch' \
--header 'Content-Type: application/json' \
--header 'consent-token: <Consent_Token>' \
--data '{
  "accountId": "<accountId>"
}'
```

### Parameters:
- `consent-token`: A token obtained from the authorization process.
- `accountId`: The ID of the account whose transactions you want to fetch.

---

## 5. **Fetch All Transactions of a User from Local Database**

This request fetches all transactions stored in your local database for a specific account.

### Endpoint:
`GET /transactions/{accountId}`

### Request:
```bash
curl --location 'http://localhost:5000/transactions/{accountId}'
```

### Parameters:
- `{accountId}`: Replace with the actual account ID for which you want to retrieve transactions.

---

## Additional Notes:

- **Local Database Endpoints** (`/accounts` and `/transactions/{accountId}`) are meant to be used after successfully fetching the data from Yapily and storing it in your local database.
- Replace `<Consent_Token>` and `<accountId>` with actual values when making requests.
- Ensure your local server is running and accessible for these endpoints (running on `localhost:5000`).

---

### Example Workflow:
1. **Authorize User** → Initiate the sandbox authorization.
2. **Fetch Accounts** → Fetch all user accounts from Yapily and store in the local database.
3. **Fetch Transactions** → Fetch all user transactions from Yapily and store in the local database.
4. **Retrieve Accounts** → Fetch stored accounts from the local database.
5. **Retrieve Transactions** → Fetch transactions of a specific account from the local database.


