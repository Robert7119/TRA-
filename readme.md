# Government Tax System

This project is a small full-stack web app for estimating taxes and recording tax payments. It includes a Node.js/Express backend and a browser-based frontend for entering tax details and submitting payment records.

## Overview

The app allows a taxpayer to:

- enter annual income and deductions
- choose a filing status
- calculate estimated tax due
- submit a payment record
- review recent payment history in the UI

## Features

- Tax calculation based on filing status brackets
- Express API for tax estimates and payment submission
- Responsive front-end form and payment table
- Simple local data storage in memory for payment records

## Requirements

Before running the project, make sure you have:

- Node.js
- npm
- VS Code or another code editor

## Installation

1. Open a terminal in this project folder.
2. Install the dependencies:

   npm install

## Running the Project

Start the app with:

npm start

Then open the browser at:

http://localhost:3000

## Project Structure

TRA-/
├── public/
│   ├── app.js
│   ├── index.html
│   └── style.css
├── package.json
├── readme.md
├── server.js
└── .gitignore

## API Endpoints

- GET /api/health — checks if the server is running
- POST /api/tax/estimate — calculates estimated tax based on user input
- POST /api/payments — records a payment submission
- GET /api/payments — returns all saved payment records

## Notes

- Tax records are kept in memory while the server is running.
- This app is intended as a simple demonstration project and can be expanded with a database, validation, or authentication.

## License

This project is provided for learning and personal use.
