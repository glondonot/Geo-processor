from fastapi import APIRouter, Depends
from app.models.geo_schemes import Point, PointsResponse
from app.services.geo_service import process_points
from app.validators.request_validator import validate_points_request

router = APIRouter()

@router.post("/process", response_model=PointsResponse)
def process_geo_points(points: list[Point] = Depends(validate_points_request)):
    centroid, bounds = process_points(points)
    return PointsResponse(centroid=centroid, bounds=bounds)