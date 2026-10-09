# 🛍️ ShopMATE — AI-Powered E-Commerce Platform

ShopMATE is a full-stack e-commerce web application built using the MERN stack. It combines online shopping functionality with AI-powered features to improve product discovery, customer interaction, and content creation.

The project provides a user-friendly shopping experience alongside administrative tools for managing products and AI-generated blog content.

## ✨ Key Features

- **User Authentication** — Registration, login, protected routes, and account-related functionality.
- **Product Browsing** — Explore products and view individual product details.
- **Shopping Cart** — Add products to the cart and manage shopping selections.
- **AI-Powered Chatbot** — Interact with the shopping assistant for a more engaging experience.
- **Semantic Product Search** — Explore products using meaning-based search capabilities.
- **AI Blog Generator** — Generate blog drafts from user-provided topics.
- **Blog Review and Publishing** — Review generated drafts before publishing them.
- **Admin Dashboard** — Access administrative functionality for managing the shopping experience.
- **Refund Policy Processing** — Includes a refund policy document and related policy-processing functionality.

## 🧰 Tech Stack

| Technology | Purpose |
|---|---|
| React.js | Frontend user interface |
| Node.js | Backend runtime |
| Express.js | REST API development |
| MongoDB | Database |
| JavaScript | Application logic |
| Vite | Frontend development and build tooling |
| Tailwind CSS | UI styling |
| AI and semantic search services | Intelligent shopping and blog features |

## 📁 Project Structure

```text
ShopMATE/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   ├── tests/
│   ├── server.js
│   └── package.json
├── .gitignore
└── README.md
```

## ⚙️ Getting Started

### Prerequisites

Install the following before running the project:

- Node.js and npm
- MongoDB or a MongoDB Atlas connection
- Git

### 1. Clone the repository

```bash
git clone https://github.com/renukagundumogula3-sudo/ShopMate.git
cd ShopMate
```

### 2. Install frontend dependencies

```bash
cd ShopMate_AdvGenAI_Task-main/client
npm install
```

### 3. Install backend dependencies

Open another terminal:

```bash
cd ShopMate_AdvGenAI_Task-main/server
npm install
```

### 4. Configure environment variables

Create the required `.env` file in the backend directory and configure the environment variables used by your application.

Depending on your implementation, these may include:

- MongoDB connection URI
- Server port
- JWT secret
- AI service API key
- Semantic search or vector database credentials
- Email service credentials, if enabled

Use the variable names expected by your source code. Never commit actual secrets or API keys to GitHub.

### 5. Start the backend

From the `server` directory, run the command supported by your `package.json`, for example:

```bash
npm start
```

If your project uses a development script, you can use:

```bash
npm run dev
```

### 6. Start the frontend

From the `client` directory, run:

```bash
npm run dev
```

Open the local URL printed by Vite in your terminal.

> Note: The exact commands and configuration depend on the scripts and environment variables defined in your project.

## 🔐 Security

- Keep `.env` files and credentials out of version control.
- Use strong secrets for authentication.
- Validate user input on the backend.
- Protect administrative routes with appropriate authorization.
- Never expose private API keys in frontend code.

## 🎯 Project Objective

The goal of ShopMATE is to demonstrate how a modern MERN-based e-commerce platform can be enhanced with AI-assisted shopping, semantic product discovery, and automated content generation.

## 🚀 Future Enhancements

- Online payment gateway integration
- Product recommendations based on shopping behavior
- Improved product filtering and sorting
- Analytics dashboard for administrators
- Automated testing and deployment pipelines

## 👩‍💻 Repository

**GitHub:** https://github.com/renukagundumogula3-sudo/ShopMate

---

⭐ If you find this project interesting, consider giving the repository a star.

*Built as a full-stack development project exploring e-commerce and AI integration.*