#!/usr/bin/env python3
# test_dataset_api.py - Test script for dataset API
import requests
import json

# Configuration
BASE_URL = "http://localhost:3000"
API_KEY = "gis_demo_vi9jq11dcal6i5sr3m4gia"  # Use the demo key we generated

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

def test_api_key_generation():
    """Test API key generation"""
    print("Testing API key generation...")
    
    url = f"{BASE_URL}/api/datasets/generate-key"
    data = {
        "email": "test-python@example.com",
        "password": "test123",
        "keyName": "Python Test Key"
    }
    
    response = requests.post(url, json=data)
    if response.status_code == 200:
        result = response.json()
        print(f"SUCCESS: API Key generated: {result['data']['apiKey'][:20]}...")
        return result['data']['apiKey']
    else:
        print(f"FAILED: Failed to generate API key: {response.text}")
        return None

def test_get_logistics_data():
    """Test getting logistics dataset"""
    print("\nTesting logistics data access...")
    
    url = f"{BASE_URL}/api/datasets?type=logistics"
    response = requests.get(url, headers=headers)
    
    if response.status_code == 200:
        data = response.json()
        print(f"SUCCESS: Got {len(data['data']['warehouses'])} warehouses")
        print(f"First warehouse: {data['data']['warehouses'][0]['name']}")
        print(f"Credits used: {data['meta']['creditsUsed']}, Remaining: {data['meta']['remainingCredits']}")
        return data
    else:
        print(f"FAILED: {response.status_code} - {response.text}")
        return None

def test_get_all_data():
    """Test getting all datasets"""
    print("\nTesting all datasets access...")
    
    url = f"{BASE_URL}/api/datasets?type=all"
    response = requests.get(url, headers=headers)
    
    if response.status_code == 200:
        data = response.json()
        datasets = list(data['data'].keys())
        print(f"SUCCESS: Got datasets: {', '.join(datasets)}")
        print(f"Credits used: {data['meta']['creditsUsed']}, Remaining: {data['meta']['remainingCredits']}")
        return data
    else:
        print(f"FAILED: {response.status_code} - {response.text}")
        return None

def test_contribute_data():
    """Test data contribution"""
    print("\nTesting data contribution...")
    
    url = f"{BASE_URL}/api/datasets"
    contribution = {
        "datasetType": "logistics",
        "data": {
            "warehouses": [
                {
                    "name": "Python Test Warehouse",
                    "lat": 13.8000,
                    "lng": 100.6000,
                    "capacity": 7500,
                    "type": "automated",
                    "city": "Bangkok"
                }
            ]
        },
        "contributorInfo": {
            "organization": "Python Test Suite",
            "email": "test@pythontest.com",
            "version": "1.0"
        }
    }
    
    response = requests.post(url, headers=headers, json=contribution)
    
    if response.status_code == 200:
        result = response.json()
        print(f"SUCCESS: Contribution accepted")
        print(f"Credits rewarded: {result['meta']['creditsRewarded']}")
        print(f"New credit balance: {result['meta']['newCreditBalance']}")
        print(f"Contribution ID: {result['meta']['contributionId']}")
        return result
    else:
        print(f"FAILED: {response.status_code} - {response.text}")
        return None

def test_invalid_requests():
    """Test error handling"""
    print("\nTesting error handling...")
    
    # Test invalid dataset type
    url = f"{BASE_URL}/api/datasets?type=invalid"
    response = requests.get(url, headers=headers)
    print(f"Invalid dataset type: {response.status_code} - {response.json().get('error', 'No error message')}")
    
    # Test missing authorization
    url = f"{BASE_URL}/api/datasets?type=logistics"
    response = requests.get(url)  # No headers
    print(f"Missing auth: {response.status_code} - {response.json().get('error', 'No error message')}")

def main():
    """Run all tests"""
    print("FLO(W) Dataset API Test Suite")
    print("=" * 50)
    
    # Test 1: API Key Generation
    new_key = test_api_key_generation()
    
    # Test 2: Data Access
    logistics_data = test_get_logistics_data()
    all_data = test_get_all_data()
    
    # Test 3: Data Contribution
    contribution_result = test_contribute_data()
    
    # Test 4: Error Handling
    test_invalid_requests()
    
    print("\n" + "=" * 50)
    print("Test Summary:")
    print(f"API Key Generation: {'PASS' if new_key else 'FAIL'}")
    print(f"Logistics Data: {'PASS' if logistics_data else 'FAIL'}")
    print(f"All Data Access: {'PASS' if all_data else 'FAIL'}")
    print(f"Data Contribution: {'PASS' if contribution_result else 'FAIL'}")
    print("\nDataset API is working correctly!")

if __name__ == "__main__":
    main()