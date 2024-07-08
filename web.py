from flask import Flask, render_template, request, redirect, url_for, jsonify
from query import query_rag
from populate_db import load_documents, split_text, add_to_chroma
import os

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'data'

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if file:
        filename = file.filename
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        docs = load_documents()
        chunks = split_text(docs)
        new_files = add_to_chroma(chunks)
        return jsonify({'message': 'File uploaded successfully', "new_files": new_files}), 200


@app.route("/")
def index():
    return render_template('index.html')


@app.route("/get", methods=["GET", "POST"])
def chat():
    msg = request.form["msg"]
    return get_chat_response(msg)


def get_chat_response(msg: str):
    response, sources = query_rag(msg)
    return {"response": response, "sources": sources}


if __name__ == '__main__':
    app.run()