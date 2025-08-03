from fastapi import FastAPI, Form, status, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from langchain_ollama import ChatOllama
import json

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

llm = ChatOllama(model="llama3.2",temperature=0.7)

@app.post("/generate",status_code=status.HTTP_200_OK)
async def generate(difficulty:str = Form(...)):
    prompt = f"""You are an expert coding challenge generator.

    Your task is to create one multiple-choice coding question suitable for a {difficulty}-level computer science interview.

    Guidelines based on difficulty:
    - Easy: Focus on basic syntax, simple operations, or common programming concepts.
    - Medium: Include intermediate topics like data structures, algorithms, or core language features.
    - Hard: Cover advanced topics such as optimization, design patterns, or complex algorithmic problems.

    VERY IMPORTANT:
    You must respond with a **valid JSON object** only — do NOT include code snippets, markdown, explanations, or any extra text.

    The response must strictly follow this format:
    {{
    "title": "Your question goes here",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct_answer_id": 0, 
    "explanation": "A clear explanation why the selected option is correct"
    }}

    Rules:
    - The options must be **realistic, distinct and plausible**, with only **one correct answer**.
    - `correct_answer_id` must be the index (0 to 3) of the correct option.
    - The explanation must be accurate, concise, and aligned with the correct answer.
    - DO NOT wrap the JSON in triple backticks, functions, or any formatting.
    - DO NOT prepend or append any text. Output only the raw JSON structure.
    - Ensure the correct answer is **logically accurate**.
    - Do not return incorrect or irrelevant options as correct.
    - All options must be realistic, code-based answers to the question.
    - Do NOT reference options (like "Option A") inside the options themselves.
    - Do NOT use meta-descriptions or commentary.
    - Each option must be a possible solution, algorithm, or approach.
    - Double-check that the correct option solves the problem as described in the "title".
    """

    result = llm.invoke(prompt)
    print(result)
    try:
            return json.loads(result.content)
    except json.JSONDecodeError as e:
            raise HTTPException(status_code=500,detail=f"Invalid JSON from model: {e}")