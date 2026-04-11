# rate limiting
With rate limiting — the fix:
After 10 failed attempts from the same IP in 15 minutes, the server responds with 429 Too Many Requests and blocks them until the window resets. A bot can't try 10,000 passwords if it gets blocked after 10.

In your case specifically, it matters because:
Your admin login is at a known URL /api/auth/login
Your admin email is admin@drivex.com — easy to guess
Without it, anyone can try unlimited passwords

