from pydantic import BaseModel, Field
from typing import List

class Point(BaseModel):
    lat: float = Field(..., ge=-90, le=90)
    lng: float = Field(..., ge=-180, le=180)

class Centroid(BaseModel):
    lat: float
    lng: float

class Bounds(BaseModel):
    north: float
    south: float
    east: float
    west: float

class PointsRequest(BaseModel):
    points: List[Point]

class PointsResponse(BaseModel):
    centroid: Centroid
    bounds: Bounds