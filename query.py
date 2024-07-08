from langchain_community.llms import Ollama
from langchain_community.vectorstores.chroma import Chroma
from langchain.prompts import ChatPromptTemplate
from populate_db import get_embedding_function
import argparse
from strip_markdown import strip_markdown

DATA_PATH = "data"
CHROMA_PATH = "chroma"

PROMPT_TEMPLATE = """
Answer the question based only on the following context:

{context}

---

Answer the question based on the above context: {question}
Output format: markdown
"""


def query_rag(query_text: str):
    embedding_function = get_embedding_function()
    db = Chroma(persist_directory=CHROMA_PATH, embedding_function=embedding_function)

    results = db.similarity_search_with_score(query_text, k=5)
    context_text = "\n\n---\n\n".join([doc.page_content for doc, _score in results])
    prompt_template = ChatPromptTemplate.from_template(PROMPT_TEMPLATE)
    prompt = prompt_template.format(context=strip_markdown(context_text), question=query_text)

    model = Ollama(model="llama3")
    print(f"PROMT:\n{prompt}")
    response_text = model.invoke(prompt)

    sources = [{"id": doc.metadata.get("id", None)[5:], "content": doc.page_content} for doc, _score in results]
    formatted_response = f"Response: {response_text}\nSources: {sources}"
    print(formatted_response)
    return response_text, sources


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("query_text", type=str, help="The query text.")
    args = parser.parse_args()
    query_text = args.query_text
    query_rag(query_text)
