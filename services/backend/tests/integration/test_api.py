def test_valid_request(client):
    response = client.post("/api/v1/process", json={
        "points": [
            {"lat": 40.0, "lng": -74.0},
            {"lat": 35.0, "lng": -120.0}
        ]
    })
    assert response.status_code == 200
    data = response.json()
    assert "centroid" in data
    assert "bounds" in data


def test_missing_points_field(client):
    response = client.post("/api/v1/process", json={})
    assert response.status_code == 400
    assert response.json()["detail"] == "Missing 'points' field in request body."


def test_points_not_a_list(client):
    response = client.post("/api/v1/process", json={"points": "not-a-list"})
    assert response.status_code == 400
    assert response.json()["detail"] == "'points' field must be an array."


def test_empty_points_array(client):
    response = client.post("/api/v1/process", json={"points": []})
    assert response.status_code == 400
    assert response.json()["detail"] == "'points' array must not be empty."


def test_point_not_a_dict(client):
    response = client.post("/api/v1/process", json={"points": ["not-a-dict"]})
    assert response.status_code == 400
    assert response.json()["detail"] == "Point at index 0 must be an object."


def test_point_missing_lat(client):
    response = client.post("/api/v1/process", json={"points": [{"lng": -74.0}]})
    assert response.status_code == 400
    assert response.json()["detail"] == "Point at index 0 must include 'lat' and 'lng'."


def test_point_missing_lng(client):
    response = client.post("/api/v1/process", json={"points": [{"lat": 40.0}]})
    assert response.status_code == 400
    assert response.json()["detail"] == "Point at index 0 must include 'lat' and 'lng'."


def test_point_with_non_numeric_lat(client):
    response = client.post("/api/v1/process", json={"points": [{"lat": "abc", "lng": -74.0}]})
    assert response.status_code == 400
    assert response.json()["detail"] == "Point at index 0 must have numeric 'lat' and 'lng'."


def test_point_with_non_numeric_lng(client):
    response = client.post("/api/v1/process", json={"points": [{"lat": 40.0, "lng": "abc"}]})
    assert response.status_code == 400
    assert response.json()["detail"] == "Point at index 0 must have numeric 'lat' and 'lng'."


def test_lat_out_of_bounds(client):
    response = client.post("/api/v1/process", json={"points": [{"lat": 100.0, "lng": -74.0}]})
    assert response.status_code == 400
    assert response.json()["detail"] == "'lat' at index 0 must be between -90 and 90."


def test_lng_out_of_bounds(client):
    response = client.post("/api/v1/process", json={"points": [{"lat": 40.0, "lng": -200.0}]})
    assert response.status_code == 400
    assert response.json()["detail"] == "'lng' at index 0 must be between -180 and 180."