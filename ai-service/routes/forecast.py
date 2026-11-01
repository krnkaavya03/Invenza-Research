from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional, Dict
from services.forecasting import forecast_demand

router = APIRouter()


class DemandPoint(BaseModel):
    score: float
    timestamp: Optional[str] = None


class SalesPoint(BaseModel):
    units: float
    timestamp: Optional[str] = None


class ProductInfo(BaseModel):
    name: Optional[str] = "Unknown Product"
    stockLevel: Optional[int] = 100
    reorderThreshold: Optional[int] = 20


class ForecastRequest(BaseModel):
    product: ProductInfo
    demandHistory: List[DemandPoint] = []
    salesHistory: List[SalesPoint] = []
    forecastDays: Optional[int] = 30


@router.post("/forecast")
async def get_forecast(request: ForecastRequest):
    if request.salesHistory:
        sales = [max(0.0, float(p.units)) for p in request.salesHistory]

        max_sales = max(sales) if sales else 1.0
        if max_sales <= 0:
            max_sales = 1.0

        demand_history = [
            {
                "score": min(1.0, units / max_sales),
                "timestamp": point.timestamp,
            }
            for units, point in zip(sales, request.salesHistory)
        ]

        result = forecast_demand(
            demand_history=demand_history,
            forecast_days=request.forecastDays,
            product_info=request.product.model_dump(),
        )

        avg_sales = sum(sales) / len(sales) if sales else 0
        result["predictedDemand"] = int(
            round(avg_sales * request.forecastDays)
        )
        result["recommendedStockIncrease"] = max(
            0,
            result["predictedDemand"]
            - int(request.product.stockLevel or 0)
            + int(request.product.reorderThreshold or 0)
        )
        result["dataSource"] = "UCI Online Retail historical sales"
        result["salesHistoryPoints"] = len(request.salesHistory)

        return result

    demand_history = [
        {"score": dp.score, "timestamp": dp.timestamp}
        for dp in request.demandHistory
    ]

    return forecast_demand(
        demand_history=demand_history,
        forecast_days=request.forecastDays,
        product_info=request.product.model_dump(),
    )
