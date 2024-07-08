<p align="center">
    <h1>RAG Chatbot<h1>
<p>
<p align="center">
<a href="https://github.com/ollama/ollama" target="_blank" rel="noreferrer">
    <img alt="ollama" height="40px" src="https://github.com/ollama/ollama/assets/3325447/0d0b44e2-8f4a-4e99-9b52-a5c1c741c8f7"></a>
    <a href="https://github.com/chroma-core/chroma" target="_blank" rel="noreferrer"> 
    <img alt="ChromaDB" height="40px" src="https://docs.trychroma.com/img/chroma.svg"> </a>
    <a href="https://github.com/langchain-ai/langchain" target="_blank" rel="noreferrer">
    <img
    alt="🦜🔗 LangChain"
    src="https://raw.githubusercontent.com/langchain-ai/.github/main/profile/logo-light.svg#gh-dark-mode-only"
    height="40"
    />
    </a>
    <a href="https://github.com/pallets/flask" target="_blank" rel="noreferrer">
    <img
    alt="Flask"
    src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Flask_logo.svg/920px-Flask_logo.svg.png"
    height="40"
    />
    </a>
<p>

## Overview
The RAG Chatbot is a conversational AI application that utilizes LLM to provide users with relevant information and responses.

## Components

- `query.py`: Contains the Python script responsible for querying the RAG model and generating responses.

- `populate_db.py`: A Python script used to populate the database with relevant data and sources.

- `web.py`: The Flask web framework code that handles HTTP requests and serves as the backend for the chatbot's interface.

- `index.html`: The HTML template for the chatbot's user interface.

- `index.js`: A JavaScript file that contains the client-side logic.

## Features

- The chatbot responds with relevant information and sources, which are displayed below the input field.

- Users can view detailed information about each source by hovering over the source card.

- The chatbot also supports uploading files through web interface.

## Screenshots

![Asking the question](docs/imgs/1.png)
![Мiew source information](docs/imgs/2.png)

## Getting Started

1. Clone this repository using `git clone https://github.com/AaLexUser/Rag-chatbot.git`

2. Install dependencies by running pip `install -r requirements.txt` in the project root directory.

3. Run the Flask application using `python web.py` to start the chatbot's backend.

4. Open a web browser and navigate to `http://localhost:5000/` to access the chatbot's interface.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
