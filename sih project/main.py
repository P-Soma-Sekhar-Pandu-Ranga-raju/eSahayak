from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
import os
from rag import load_pdfs_from_folder, split_documents, create_vector_store, generate_response
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

PDF_FOLDER_PATH = r"C:\Users\Pavan Maddula\Desktop\sih project (2)\sih project\pdf"

# Load and process documents at startup
print("Loading and processing PDF documents...")
documents = load_pdfs_from_folder(PDF_FOLDER_PATH)
split_docs = split_documents(documents)
vector_store = create_vector_store(split_docs)
print("RAG system initialized successfully.")

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            try:
                data = await websocket.receive_text()
            except Exception as e:
                print(f"WebSocket receive error: {e}")
                break

            print(f"Received from client: {data}")
            try:
                data_json = json.loads(data)
                user_message = data_json.get("message", "")
            except Exception as e:
                print(f"Error parsing JSON: {e}")
                user_message = data

            try:
                relevant_docs = vector_store.similarity_search(user_message, k=12)
                response = generate_response(user_message, relevant_docs)
            except Exception as e:
                print(f"RAG pipeline error: {e}")
                response = "Sorry, an internal error occurred while processing your request."
            await websocket.send_text(response)
    except Exception as e:
        print(f"WebSocket error: {e}")
    finally:
        try:
            await websocket.close()
        except Exception:
            pass

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)