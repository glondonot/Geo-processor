from app.models.geo_schemes import Point
from app.services.geo_service import compute_bounds, compute_centroid

def test_centroid_computation():
    points = [Point(lat=40.0, lng=-70.0), Point(lat=30.0, lng=-110.0)]
    centroid = compute_centroid(points)
    assert centroid.lat == 35.0
    assert centroid.lng == -90.0

def test_bounds_computation():
    points = [Point(lat=40.0, lng=-70.0), Point(lat=30.0, lng=-110.0)]
    bounds = compute_bounds(points)
    assert bounds.north == 40.0
    assert bounds.south == 30.0
    assert bounds.east == -70.0
    assert bounds.west == -110.0

def test_single_point_bounds_and_centroid():
    points = [Point(lat=10.0, lng=20.0)]
    bounds = compute_bounds(points)
    centroid = compute_centroid(points)

    assert bounds.north == bounds.south == 10.0
    assert bounds.east == bounds.west == 20.0
    assert centroid.lat == 10.0
    assert centroid.lng == 20.0
