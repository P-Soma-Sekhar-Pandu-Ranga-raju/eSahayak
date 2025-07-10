import os
import numpy as np
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
import requests
import faiss
from dotenv import load_dotenv

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# System prompt remains the same
system_prompt = """
You are the official virtual assistant for the Department of Justice (DoJ), Government of India. Handle the conversations well, greet people well.
Your purpose is to provide accurate, helpful information about judicial services, court processes, and DoJ initiatives. 
[... rest of the system prompt ...]
"""

def load_pdfs_from_folder(folder_path):
    """Load all PDF files from a folder and return a list of LangChain Document objects."""
    documents = []
    for file_name in os.listdir(folder_path):
        if file_name.endswith(".pdf"):
            file_path = os.path.join(folder_path, file_name)

            loader = PyPDFLoader(file_path)
            documents.extend(loader.load())
    return documents

def split_documents(documents):
    """Split documents into chunks for embedding and retrieval."""
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    return text_splitter.split_documents(documents)

def create_vector_store(documents):
    """Create a FAISS vector store from split documents using HuggingFace embeddings."""
    embedding_model = HuggingFaceEmbeddings(model_name="paraphrase-multilingual-MiniLM-L12-v2")
    vector_store = FAISS.from_documents(documents, embedding_model)
    return vector_store

def generate_response(query, relevant_documents):
    """Generate a response using Gemini LLM, given a user query and relevant documents."""
    if not GEMINI_API_KEY:
        return "GEMINI_API_ERROR: Gemini API key is missing. Please set GEMINI_API_KEY in your environment."
    context = " ".join([doc.page_content for doc in relevant_documents])
    prompt = f"You are the official virtual assistant for the Department of Justice (DoJ), Government of India. Handle the conversations well, greet people well.\nUser Query: {query}\nRelevant Information: {context}\nAnswer:"
    try:
        url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"
        headers = {
            "Content-Type": "application/json",
            "X-goog-api-key": GEMINI_API_KEY
        }
        data = {
            "contents": [
                {"parts": [
                    {"text": prompt}
                ]}
            ]
        }
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()
        result = response.json()
        # Extract the generated answer from Gemini's response
        return result["candidates"][0]["content"]["parts"][0]["text"]
    except Exception as e:
        print(f"Gemini API error: {e}")
        return "GEMINI_API_ERROR: Sorry, the AI service is temporarily unavailable due to quota limits or a technical issue. Please try again later or check your API usage."