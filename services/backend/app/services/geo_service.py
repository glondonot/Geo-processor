from app.models.geo_schemes import Point, Centroid, Bounds

def compute_centroid(points: list[Point]) -> Centroid:
    total_lat = sum(p.lat for p in points)
    total_lng = sum(p.lng for p in points)
    return Centroid(
        lat=total_lat / len(points),
        lng=total_lng / len(points)
    )

def compute_bounds(points: list[Point]) -> Bounds:
    first = points[0]
    north = south = first.lat
    east = west = first.lng

    for p in points[1:]:
        lat, lng = p.lat, p.lng
        north = max(north, lat)
        south = min(south, lat)
        east = max(east, lng)
        west = min(west, lng)

    return Bounds(
        north=north,
        south=south,
        east=east,
        west=west
    )

def process_points(points: list[Point]) -> tuple[Centroid, Bounds]:
    centroid = compute_centroid(points)
    bounds = compute_bounds(points)
    return centroid, bounds