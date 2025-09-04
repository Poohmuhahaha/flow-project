# FLO(W) Dataset API - External Access Guide

This guide explains how to access FLO(W) datasets from other computers using API keys.

## 🚀 Quick Start

### 1. Generate API Key

**Method 1: Using curl**
```bash
curl -X POST http://your-server.com/api/datasets/generate-key \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-email@example.com",
    "password": "your-password",
    "keyName": "My Dataset Access Key"
  }'
```

**Method 2: Using JavaScript/Node.js**
```javascript
const response = await fetch('http://your-server.com/api/datasets/generate-key', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'your-email@example.com',
    password: 'your-password',
    keyName: 'My Dataset Access Key'
  })
});
const data = await response.json();
console.log('API Key:', data.data.apiKey);
```

**Response Example:**
```json
{
  "success": true,
  "data": {
    "apiKey": "gis_abc123def456...",
    "keyName": "My Dataset Access Key",
    "usage": {
      "endpoint": "https://your-server.com/api/datasets",
      "methods": ["GET", "POST"]
    }
  },
  "instructions": {
    "header": "Authorization: Bearer YOUR_API_KEY",
    "examples": [
      "curl -H \"Authorization: Bearer gis_abc123...\" https://your-server.com/api/datasets?type=logistics"
    ]
  }
}
```

### 2. Access Datasets

Use your API key in the `Authorization` header:

```bash
# Get logistics data
curl -H "Authorization: Bearer gis_abc123def456..." \
  "http://your-server.com/api/datasets?type=logistics"

# Get walkability data
curl -H "Authorization: Bearer gis_abc123def456..." \
  "http://your-server.com/api/datasets?type=walkability"

# Get GIS boundary data
curl -H "Authorization: Bearer gis_abc123def456..." \
  "http://your-server.com/api/datasets?type=gis"

# Get all datasets
curl -H "Authorization: Bearer gis_abc123def456..." \
  "http://your-server.com/api/datasets?type=all"
```

## 📊 Available Datasets

### Logistics Dataset (`type=logistics`)
- **Warehouses**: Location, capacity, operational data
- **Routes**: Distance, time, cost between locations
- **Cost**: 1 credit per request

### Walkability Dataset (`type=walkability`)  
- **Areas**: Walkability scores, pedestrian infrastructure
- **Infrastructure**: Sidewalks, crosswalks, bridges data
- **Cost**: 1 credit per request

### GIS Dataset (`type=gis`)
- **Boundaries**: Administrative boundaries, area calculations  
- **Cost**: 1 credit per request

### All Datasets (`type=all`)
- Returns all available datasets in one response
- **Cost**: 1 credit per request

## 🔄 Contributing Data

You can contribute your own data and **earn 5 credits** per contribution:

```bash
curl -X POST "http://your-server.com/api/datasets" \
  -H "Authorization: Bearer gis_abc123def456..." \
  -H "Content-Type: application/json" \
  -d '{
    "datasetType": "logistics",
    "data": {
      "warehouses": [
        {
          "name": "My Warehouse",
          "lat": 13.7563,
          "lng": 100.5018,
          "capacity": 5000
        }
      ]
    },
    "contributorInfo": {
      "organization": "My Company",
      "email": "contributor@company.com"
    }
  }'
```

## 💻 Programming Language Examples

### Python
```python
import requests

API_KEY = "gis_abc123def456..."
BASE_URL = "http://your-server.com/api/datasets"

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

# Get logistics data
response = requests.get(f"{BASE_URL}?type=logistics", headers=headers)
data = response.json()
print(data['data']['logistics']['warehouses'])

# Contribute data
contribution = {
    "datasetType": "walkability",
    "data": {
        "areas": [
            {
                "area": "New District",
                "walkability_score": 78,
                "pedestrian_paths": 95
            }
        ]
    }
}
response = requests.post(BASE_URL, headers=headers, json=contribution)
print(f"Credits earned: {response.json()['meta']['creditsRewarded']}")
```

### JavaScript/Node.js
```javascript
const API_KEY = "gis_abc123def456...";
const BASE_URL = "http://your-server.com/api/datasets";

const headers = {
    "Authorization": `Bearer ${API_KEY}`,
    "Content-Type": "application/json"
};

// Get all datasets
async function getAllData() {
    const response = await fetch(`${BASE_URL}?type=all`, { headers });
    const data = await response.json();
    return data.data;
}

// Contribute data
async function contributeData(dataset) {
    const response = await fetch(BASE_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify({
            datasetType: "gis",
            data: dataset,
            contributorInfo: {
                organization: "My Org"
            }
        })
    });
    return await response.json();
}
```

### PHP
```php
<?php
$apiKey = "gis_abc123def456...";
$baseUrl = "http://your-server.com/api/datasets";

$headers = [
    "Authorization: Bearer " . $apiKey,
    "Content-Type: application/json"
];

// Get logistics data
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $baseUrl . "?type=logistics");
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
$data = json_decode($response, true);
curl_close($ch);

echo json_encode($data['data']['logistics']['warehouses'], JSON_PRETTY_PRINT);
?>
```

## ⚡ Response Format

All API responses follow this structure:

```json
{
  "success": true,
  "data": {
    // Your requested dataset
  },
  "meta": {
    "type": "logistics",
    "format": "json", 
    "creditsUsed": 1,
    "remainingCredits": 94,
    "processingTime": 45,
    "timestamp": "2025-01-15T10:30:00.000Z"
  }
}
```

## 💳 Credit System

- **Starting Credits**: Users typically start with 100 credits
- **GET Requests**: 1 credit per dataset request
- **POST Contributions**: Earn 5 credits per valid contribution
- **Credit Check**: API automatically checks credit balance before processing
- **Insufficient Credits**: Returns HTTP 402 with credit requirement details

## 🛡️ Error Handling

### Common Error Responses

**401 Unauthorized**
```json
{
  "error": "Invalid or missing API key"
}
```

**402 Payment Required** 
```json
{
  "error": "Insufficient credits",
  "required": 1,
  "available": 0
}
```

**400 Bad Request**
```json
{
  "error": "Invalid dataset type",
  "available_types": ["logistics", "walkability", "gis", "all"]
}
```

## 🔧 Testing Your Setup

1. **Test API Key Generation:**
```bash
curl -X POST http://localhost:3000/api/datasets/generate-key \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "test123"}'
```

2. **Test Data Access:**
```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  "http://localhost:3000/api/datasets?type=logistics"
```

3. **Test Data Contribution:**
```bash
curl -X POST http://localhost:3000/api/datasets \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"datasetType": "test", "data": {"sample": true}}'
```

## 📝 Notes

- API keys should be kept secure and not shared publicly
- Rate limiting may apply in production environments  
- Dataset schemas may evolve - check API documentation regularly
- For production use, implement proper error handling and retry logic
- Consider caching frequently accessed datasets to reduce credit usage

## 🆘 Support

If you encounter issues:
1. Check your API key is correctly formatted
2. Verify your credit balance
3. Ensure correct endpoint URLs
4. Review request format matches examples above

For additional support, contact the FLO(W) development team.