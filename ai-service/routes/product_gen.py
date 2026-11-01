from fastapi import APIRouter, HTTPException
from services.product_gen import CatalogInput, generate_catalog

router = APIRouter()


@router.post("/catalog/generate")
async def catalog_generate(request: CatalogInput):
    try:
        return await generate_catalog(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Existing compatibility endpoint
@router.post("/generate-description")
async def generate_description(request: CatalogInput):
    try:
        result = await generate_catalog(request)

        if result["source"] == "gemini" and result.get("catalog"):
            catalog = result["catalog"]
            return {
                "title": catalog.get("title", request.product_name),
                "description": catalog.get("description", ""),
                "seo_tags": catalog.get("seoTags", [])
            }

        return {
            "title": request.product_name,
            "description": "",
            "seo_tags": []
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
