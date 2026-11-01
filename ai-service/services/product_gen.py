"""
Invenza AI Catalog Generation
Multimodal text/image product understanding with explicit AI-source reporting.
"""

import os
import json
import base64
from typing import List
from pydantic import BaseModel


class CatalogInput(BaseModel):
    product_name: str = ""
    category: str = ""
    brand: str = ""
    key_specs: List[str] = []
    language: str = "English"
    raw_input: str = ""
    source_type: str = "text"
    image_base64: str = ""


def _no_ai_response(product_name: str = "") -> dict:
    return {
        "source": "unavailable",
        "requiresReview": True,
        "message": "AI generation is not configured. Provide a supported AI model/API configuration.",
        "catalog": None
    }


CATALOG_PROMPT = """You are the AI catalog-generation assistant for Invenza,
an AI-assisted multimodal product catalog and inventory platform for small
sellers, farmers, artisans, kirana stores and MSMEs.

Understand the supplied product information and, when an image is provided,
VISUALLY ANALYZE THE IMAGE to identify the product.

IMPORTANT:
- If an image is supplied, inspect the image itself.
- Read visible product names, labels, brands, quantities, model numbers and specifications when clearly visible.
- Use the image to identify the product even when the seller provides no text.
- Never invent facts not visible in the image or supplied by the seller.
- If information is unclear, put it in missingFields.
- Never invent certifications, materials, dimensions, technical features, ingredients, prices or brand claims.
- Suggested prices must remain null unless reliable pricing information is supplied.
- The result must be suitable for human review before saving.
- Return ONLY valid JSON.

Seller text:
{product_name}

Category:
{category}

Brand:
{brand}

Key specifications:
{key_specs}

Additional raw input:
{raw_input}

Source type:
{source_type}

Requested language:
{language}

Return exactly this structure:

{{
  "title": "identified or market-ready product title",
  "description": "clear marketplace-ready description based only on known facts",
  "category": "best-fit category",
  "brand": "known brand or empty string",
  "keySpecs": ["only known specifications"],
  "seoTags": ["5-8 relevant search tags"],
  "suggestedPriceRange": {{
    "min": null,
    "max": null,
    "currency": "INR"
  }},
  "missingFields": ["important information still required"]
}}
"""


async def generate_catalog(input_data: CatalogInput) -> dict:
    """Generate a structured catalog using Gemini text or image+text input."""

    api_key = (
        os.getenv("LLM_API_KEY")
        or os.getenv("GEMINI_API_KEY")
        or ""
    )

    if not api_key or "your_" in api_key.lower() or "key_here" in api_key.lower():
        return _no_ai_response(input_data.product_name)

    prompt = CATALOG_PROMPT.format(
        product_name=input_data.product_name or "Not provided",
        category=input_data.category or "General",
        brand=input_data.brand or "Not provided",
        key_specs=", ".join(input_data.key_specs)
        if input_data.key_specs else "Not provided",
        raw_input=input_data.raw_input or "Not provided",
        source_type=input_data.source_type or "text",
        language=input_data.language or "English"
    )

    try:
        from google import genai
        from google.genai import types

        client = genai.Client(api_key=api_key)

        contents = [prompt]

        if input_data.image_base64:
            try:
                image_data = input_data.image_base64

                mime_type = "image/jpeg"

                if image_data.startswith("data:"):
                    header, image_data = image_data.split(",", 1)
                    mime_type = header.split(";", 1)[0].replace("data:", "") or "image/jpeg"
                elif "," in image_data:
                    image_data = image_data.split(",", 1)[1]

                image_bytes = base64.b64decode(image_data)

                contents.append(
                    types.Part.from_bytes(
                        data=image_bytes,
                        mime_type=mime_type
                    )
                )

            except Exception as image_error:
                return {
                    "source": "unavailable",
                    "requiresReview": True,
                    "message": f"Image processing failed: {image_error}",
                    "catalog": None
                }

        # Only use the currently supported multimodal model.
        # No unavailable legacy fallback models.
        models = [
            "gemini-3.6-flash"
        ]

        last_error = None

        for model_name in models:
            try:
                response = await client.aio.models.generate_content(
                    model=model_name,
                    contents=contents,
                    config=types.GenerateContentConfig(
                        response_mime_type="application/json",
                        temperature=0.2
                    )
                )

                text = (response.text or "").strip()

                if not text:
                    raise ValueError("Gemini returned an empty response")

                catalog = json.loads(text)

                return {
                    "source": "gemini",
                    "requiresReview": True,
                    "catalog": catalog
                }

            except Exception as error:
                last_error = error
                print(
                    f"[Invenza Catalog] Gemini model "
                    f"{model_name} failed: {error}"
                )

        return {
            "source": "unavailable",
            "requiresReview": True,
            "message": f"Gemini generation failed: {last_error}",
            "catalog": None
        }

    except Exception as error:
        print(f"[Invenza Catalog] Gemini unavailable: {error}")

        return {
            "source": "unavailable",
            "requiresReview": True,
            "message": "Configured AI provider could not be reached.",
            "catalog": None
        }


async def generate_product_copy(product_name: str, category: str = "") -> dict:
    """
    Existing compatibility function.

    Kept so the existing /generate-description endpoint continues to work.
    """

    result = await generate_catalog(
        CatalogInput(
            product_name=product_name,
            category=category
        )
    )

    if result["source"] == "gemini" and result.get("catalog"):
        catalog = result["catalog"]

        return {
            "title": catalog.get("title", product_name),
            "description": catalog.get("description", ""),
            "seo_tags": catalog.get("seoTags", [])
        }

    return {
        "title": product_name,
        "description": "",
        "seo_tags": []
    }
