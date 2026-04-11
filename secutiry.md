# rate limiting
With rate limiting — the fix:
After 10 failed attempts from the same IP in 15 minutes, the server responds with 429 Too Many Requests and blocks them until the window resets. A bot can't try 10,000 passwords if it gets blocked after 10.

In your case specifically, it matters because:
Your admin login is at a known URL /api/auth/login
Your admin email is admin@drivex.com — easy to guess
Without it, anyone can try unlimited passwords

# robots.txt
robots.txt — simple example:

When Google searches the web, it sends a "bot" to visit every page of your site. Without robots.txt, it will try to visit and index /admin, /login, /my-bookings — meaning someone could literally Google "Sihabi Cars admin" and find your admin page URL. robots.txt just tells Google "don't go there".

robots.txt — blocks /admin, /my-bookings, /profile, /login, /forgot-password, /reset-password from Google while allowing all public pages.