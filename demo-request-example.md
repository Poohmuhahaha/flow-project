# Demo API Request Example

To call the demo API endpoint successfully, include the authorization header:

```bash
curl -X GET \
  http://localhost:3000/api/demo \
  -H "Authorization: Bearer gis_your_api_key_here" \
  -H "Content-Type: application/json"
```

Or for POST requests:

```bash
curl -X POST \
  http://localhost:3000/api/demo \
  -H "Authorization: Bearer gis_your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

The API key must:
- Start with "gis_" prefix
- Be provided in the Authorization header with "Bearer " prefix
- Be a valid API key that exists in your database