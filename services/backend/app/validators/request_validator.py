from fastapi import Request, HTTPException
from app.models.geo_schemes import Point
from typing import List


async def validate_points_request(request: Request) -> List[Point]:
    body = await request.json()

    if "points" not in body:
        raise HTTPException(status_code=400, detail="Missing 'points' field in request body.")

    if not isinstance(body["points"], list):
        raise HTTPException(status_code=400, detail="'points' field must be an array.")

    if len(body["points"]) == 0:
        raise HTTPException(status_code=400, detail="'points' array must not be empty.")

    points = []
    for idx, p in enumerate(body["points"]):
        if not isinstance(p, dict):
            raise HTTPException(status_code=400, detail=f"Point at index {idx} must be an object.")
        if "lat" not in p or "lng" not in p:
            raise HTTPException(status_code=400, detail=f"Point at index {idx} must include 'lat' and 'lng'.")
        try:
            lat = float(p["lat"])
            lng = float(p["lng"])
        except (ValueError, TypeError):
            raise HTTPException(status_code=400, detail=f"Point at index {idx} must have numeric 'lat' and 'lng'.")
        if not -90 <= lat <= 90:
            raise HTTPException(status_code=400, detail=f"'lat' at index {idx} must be between -90 and 90.")
        if not -180 <= lng <= 180:
            raise HTTPException(status_code=400, detail=f"'lng' at index {idx} must be between -180 and 180.")

        points.append(Point(lat=lat, lng=lng))

    return points