from openai import OpenAI, BadRequestError
import openai
import os
from pydantic import BaseModel
from fastapi.responses import JSONResponse
from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware



app = FastAPI()

app.add_middleware(
    CORSMiddleware, 
    allow_credentials=True, 
    allow_origins=["*"], 
    allow_methods=["*"], 
    allow_headers=["*"]
)

class ImageRequest(BaseModel):
    prompt: str

@app.post("/dalle")
async def generateDALLE(image_request: ImageRequest):
    try:
        client = OpenAI(api_key='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')

        response = client.images.generate(
            model="dall-e-2",
            prompt=image_request.prompt,
            size="256x256",
            quality="standard",
            n=1
        )

        image_url = response.data[0].url
        return JSONResponse(content={"image_url": image_url})
    
    except BadRequestError as e:
        return JSONResponse(status_code=400, content={"detail": f"Bad request: {e}"})
    except Exception as e:
        return JSONResponse(status_code=500, content={"detail": f"Internal server error: {e}"})
