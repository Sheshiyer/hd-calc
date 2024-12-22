# Human Design Calculator Web Service

A high-performance web service for calculating Human Design profiles from birth data. Built with TypeScript, Express, and Redis for caching.

## Features

- Calculate Human Design profiles from birth data
- Fast, cached responses via Redis
- Batch calculation support
- Input validation and error handling
- TypeScript for type safety
- RESTful API design

## Prerequisites

- Node.js >= 18.0.0
- Redis server
- npm or yarn

## Installation

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd hd-calc
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

## Development

Start the development server:
```bash
npm run dev
```

Build the project:
```bash
npm run build
```

Start production server:
```bash
npm start
```

## API Documentation

### Calculate Profile

Calculate a single Human Design profile.

```http
POST /api/calculate
Content-Type: application/json

{
  "date": "1990-01-01",
  "time": "12:00:00",
  "location": {
    "lat": 40.7128,
    "lng": -74.0060,
    "timezone": "America/New_York"
  }
}
```

### Lookup Cached Profile

Retrieve a previously calculated profile.

```http
GET /api/lookup/:id
```

### Batch Calculate

Calculate multiple profiles in one request.

```http
POST /api/batch
Content-Type: application/json

{
  "profiles": [
    {
      "date": "1990-01-01",
      "time": "12:00:00",
      "location": {
        "lat": 40.7128,
        "lng": -74.0060,
        "timezone": "America/New_York"
      }
    }
  ]
}
```

## Response Format

```json
{
  "success": true,
  "profile": {
    "type": "Generator",
    "authority": "Emotional",
    "profile": [1, 3],
    "centers": {
      "Head": true,
      "Ajna": false,
      // ... other centers
    },
    "gates": [1, 2, 3, 4, 5, 6, 7, 8],
    "channels": [[1, 2], [3, 4], [5, 6]],
    "definition": "Single Definition",
    "incarnationCross": "Right Angle Cross of Planning",
    "variables": ["Left", "Right", "Left", "Right"]
  },
  "cacheHit": false
}
```

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- 400: Bad Request (invalid input)
- 404: Not Found
- 500: Internal Server Error

Error response format:
```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error 1", "Detailed error 2"]
}
```

## Deployment

This service is configured for deployment on Render.com. Push to the main branch to trigger automatic deployment:

```bash
git push render main
```

## Environment Variables

- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (development/production)
- `REDIS_URL`: Redis connection URL
- `API_KEY`: API key for authentication

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT
