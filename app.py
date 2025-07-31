from fastapi import FastAPI, UploadFile, File, Form, status
from fastapi.middleware.cors import CORSMiddleware

from typing import Annotated
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from typing_extensions import TypedDict
from langchain_ollama import ChatOllama, OllamaEmbeddings
from langchain_core.messages import HumanMessage, AIMessage
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document
from langchain_core.prompts import ChatPromptTemplate
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.chains import create_retrieval_chain
from uuid import uuid4
# import os, shutil, pandas as pd
import time
import json

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

# class State(TypedDict):
#     messages:Annotated[list,add_messages]

# difficulty = input("Enter difficulty: ")

llm = ChatOllama(model="llama3.2",temperature=0.7)
# prompt = f"""You are an expert coding challenge creator.
#     Your task is to generate a coding question with multiple choice answers.
#     The question should be appropriate for the specified difficulty level.
#     Difficulty level: {difficulty}

#     For easy questions: Focus on basic syntax, simple operations, or common programming concepts.
#     For medium questions: Cover intermediate concepts like data structures, algorithms, or language features.
#     For hard questions: Include advanced topics, design patterns, optimization techniques, or complex algorithms.

#     Return the challenge in the following JSON structure:
#     {{
#         "title":"The coding question",
#         "options":["Option 1","Option 2","Option 3","Option 4"],
#         "correct_answer_id":0, //Index of the correct answer (0-3)
#         "explanation":"Detailed explanation of the why the correct answer is right"
#     }}

#     Make sure the options are plausible but with only one clearly correct answer.
    
#     The value of "answer" should be a complete, valid Python solution.
#     Do not define a function or print anything else before or after the dictionary.
#     Do not wrap the dictionary inside any other code or structure.
#     No explanations or additional formatting like markdown.
#     """

# result = llm.invoke(prompt)
# print(result)

@app.post("/generate",status_code=status.HTTP_200_OK)
async def generate(difficulty:str = Form(...)):
    prompt = f"""You are an expert coding challenge creator.
    Your task is to generate a coding question with multiple choice answers.
    The question should be appropriate for the specified difficulty level.
    Difficulty level: {difficulty}

    For easy questions: Focus on basic syntax, simple operations, or common programming concepts.
    For medium questions: Cover intermediate concepts like data structures, algorithms, or language features.
    For hard questions: Include advanced topics, design patterns, optimization techniques, or complex algorithms.

    Return the challenge in the following JSON structure:
    {{
        "title":"The coding question",
        "options":["Option 1","Option 2","Option 3","Option 4"],
        "correct_answer_id":0, //Index of the correct answer (0-3)
        "explanation":"Detailed explanation of the why the correct answer is right"
    }}

    Make sure the options are plausible but with only one clearly correct answer.

    The value of "answer" should be a complete, valid Python solution.
    Do not define a function or print anything else before or after the dictionary.
    Do not wrap the dictionary inside any other code or structure.
    No explanations or additional formatting like markdown.
    """
    result = llm.invoke(prompt)
    print(result)
    return json.loads(result.content)