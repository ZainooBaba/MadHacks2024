

# SplitTech Project Suite
This project was built as part of Madhacks 2024.
This repository holds three related applications for tracking and settling group expenses:

• **Backend**  
  Contains the FastAPI server, database schemas and REST endpoints

• **WebApp**  
  A React web portal with public and authenticated views  
  – view or manage expenses without logging in (public portal)  
  – sign up, sign in, invite guests, create or join groups  

• **SplitTech**  
  A React Native mobile app  
  – sign in or continue as guest  
  – create groups, invite others, add or remove transactions  
  – mark payer, participants and amount  
  – calculate who owes whom and minimal payments  

---

## Key features

• Account system with email sign up and sign in  
• Invite non-registered users to join as guest members  
• Public portal for anyone to view group expenses  
• Group roles (admin vs guest) for managing permissions  
• Create, update or delete groups and transactions  
• Automatic calculation of net balances and minimal payment set  

---

## Tech stack

• **Backend**: FastAPI, Python, PostgreSQL (or your choice of DB), Pydantic models  
• **WebApp**: React, React Router, fetch/Axios to call backend  
• **SplitTech**: React Native, Expo, Firebase Auth (optional), REST calls to FastAPI  

---

## Repository structure

/
├── backend
│ └── … FastAPI app code, migrations, README
├── WebApp
│ └── … React frontend code, public portal, README
└── SplitTech
└── … React Native app code, mobile features, README


---

## Getting started

1. Clone this repo  
2. `cd backend` → follow that README to install dependencies and run the API  
3. `cd ../WebApp` → follow that README to install and start the web portal  
4. `cd ../SplitTech` → follow that README to install and run the mobile app  

Each subdirectory has its own setup instructions, environment variables and sample data. Feel free to explore and run whichever parts you need.
