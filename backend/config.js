module.exports = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
  
  // AI Service Configuration (for future integration)
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY || '',
  
  // Database Configuration (for future integration)
  DATABASE_URL: process.env.DATABASE_URL || '',
  MONGODB_URI: process.env.MONGODB_URI || ''
}
