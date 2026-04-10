# Admin Revenue Analytics Dashboard

## Overview
Comprehensive analytics dashboard with interactive charts showing revenue trends, booking statistics, customer retention metrics, and most profitable cars.

## Features Implemented

### 1. Key Metrics Cards
- **Revenue Growth** - Month-over-month percentage change with trend indicator
- **Repeat Customers** - Count of customers with multiple bookings + average bookings per customer
- **Retention Revenue** - Total revenue from repeat customers
- **Top Car Revenue** - Revenue from the most profitable car

### 2. Revenue Trend Chart (Line Chart)
- Last 12 months of revenue data
- Dual-axis showing both revenue (DH) and booking count
- Interactive tooltips with detailed information
- Smooth line animation

### 3. Weekly Revenue Chart (Bar Chart)
- Last 8 weeks of revenue data
- Visual comparison of weekly performance
- Helps identify weekly patterns and trends

### 4. Bookings by Status (Pie Chart)
- Visual distribution of booking statuses
- Shows: Pending, Confirmed, Completed, Cancelled
- Color-coded segments with labels
- Revenue breakdown per status

### 5. Most Profitable Cars
- Top 5 cars ranked by total revenue
- Shows:
  - Car image thumbnail
  - Brand and model name
  - Number of bookings
  - Total revenue generated
- Ranked list with position badges

### 6. Payment Methods Distribution
- Cash vs Card payment breakdown
- Shows:
  - Number of bookings per method
  - Total revenue per method
- Visual cards with icons

### 7. Top Repeat Customers Table
- Top 10 customers with multiple bookings
- Shows:
  - Customer email
  - Number of bookings (badge)
  - Total amount spent
- Sortable by booking count

## Backend API Endpoints

### GET /api/users/analytics/charts
Returns comprehensive analytics data:

```json
{
  "revenueTrend": [
    { "month": "2024-01", "revenue": 15000, "bookings": 25 }
  ],
  "profitableCars": [
    {
      "id": 1,
      "name": "Model 3",
      "brand": "Tesla",
      "image_url": "...",
      "booking_count": 15,
      "total_revenue": 18000
    }
  ],
  "bookingsByStatus": [
    { "status": "confirmed", "count": 45, "revenue": 54000 }
  ],
  "bookingsTrend": [
    { "month": "2024-01", "count": 25 }
  ],
  "customerRetention": [
    {
      "user_id": 5,
      "customer_email": "customer@example.com",
      "booking_count": 8,
      "total_spent": 9600
    }
  ],
  "paymentMethods": [
    { "payment_method": "card", "count": 30, "revenue": 36000 }
  ],
  "weeklyRevenue": [
    { "week": "2024-W01", "revenue": 3500, "bookings": 6 }
  ]
}
```

## Database Queries

### Revenue Trend (Last 12 Months)
```sql
SELECT 
  strftime('%Y-%m', created_at) as month,
  COALESCE(SUM(total_price), 0) as revenue,
  COUNT(*) as bookings
FROM bookings
WHERE created_at >= date('now', '-12 months')
GROUP BY strftime('%Y-%m', created_at)
ORDER BY month ASC
```

### Most Profitable Cars
```sql
SELECT 
  c.id, c.name, c.brand, c.image_url,
  COUNT(b.id) as booking_count,
  COALESCE(SUM(b.total_price), 0) as total_revenue
FROM cars c
LEFT JOIN bookings b ON c.id = b.car_id
GROUP BY c.id
ORDER BY total_revenue DESC
LIMIT 10
```

### Customer Retention (Repeat Customers)
```sql
SELECT 
  user_id, customer_email,
  COUNT(*) as booking_count,
  COALESCE(SUM(total_price), 0) as total_spent
FROM bookings
WHERE user_id IS NOT NULL
GROUP BY user_id
HAVING booking_count > 1
ORDER BY booking_count DESC
LIMIT 20
```

## Technology Stack

### Frontend
- **Recharts** - React charting library
  - LineChart - Revenue trends
  - BarChart - Weekly revenue
  - PieChart - Status distribution
- **Framer Motion** - Smooth animations
- **TanStack Query** - Data fetching and caching

### Backend
- **SQLite** - Database with aggregation queries
- **Express.js** - API endpoints
- **Date functions** - strftime for time-based grouping

## UI/UX Features

### Responsive Design
- Mobile-friendly charts that adapt to screen size
- Responsive grid layouts
- Touch-friendly interactions

### Dark Theme Optimized
- Chart colors optimized for dark backgrounds
- Glass-morphism cards
- Proper contrast ratios

### Interactive Elements
- Hover tooltips on all charts
- Clickable legends
- Smooth animations on load

### Color Coding
- 🔵 Blue - Primary metrics (revenue)
- 🟢 Green - Positive trends (bookings)
- 🟡 Amber - Warnings
- 🔴 Red - Negative trends
- 🟣 Purple - Secondary metrics

## Business Insights

### What Admins Can Learn:

1. **Revenue Patterns**
   - Identify peak months/weeks
   - Spot seasonal trends
   - Track growth over time

2. **Car Performance**
   - Which cars generate most revenue
   - Booking frequency per car
   - ROI on different car categories

3. **Customer Behavior**
   - Repeat customer rate
   - Average bookings per customer
   - Customer lifetime value

4. **Payment Preferences**
   - Cash vs Card usage
   - Revenue per payment method
   - Payment trends

5. **Booking Status**
   - Conversion rates (pending → confirmed)
   - Cancellation rates
   - Completion rates

## Files Created/Modified

### New Files:
- `src/components/AnalyticsDashboard.tsx` - Main analytics component

### Modified Files:
- `server/routes/users.js` - Added `/analytics/charts` endpoint
- `src/pages/AdminPage.tsx` - Integrated Charts tab
- `package.json` - Added recharts dependency

## Usage

1. Navigate to **Admin Dashboard**
2. Click on **Charts** tab
3. View comprehensive analytics:
   - Scroll through different chart sections
   - Hover over charts for detailed tooltips
   - Analyze trends and patterns
4. Use insights to make business decisions:
   - Adjust pricing for profitable cars
   - Target repeat customers with promotions
   - Optimize inventory based on demand

## Future Enhancements

1. **Date Range Filters**
   - Custom date range selection
   - Compare different time periods
   - Year-over-year comparisons

2. **Export Functionality**
   - Export charts as images
   - Download data as CSV/Excel
   - Generate PDF reports

3. **Real-time Updates**
   - WebSocket integration
   - Live revenue counter
   - Real-time booking notifications

4. **Advanced Metrics**
   - Customer acquisition cost
   - Average booking value
   - Profit margins per car
   - Seasonal forecasting

5. **Drill-down Capabilities**
   - Click on chart elements for details
   - Filter by car category
   - Filter by customer segment

## Performance Considerations

- **Data Caching** - TanStack Query caches analytics data
- **Lazy Loading** - Charts load only when tab is active
- **Optimized Queries** - Database indexes on date fields
- **Responsive Charts** - Adapt to container size automatically

## Status: ✅ Complete and Ready to Use

All charts are functional with real data from the database. The dashboard provides actionable insights for business decision-making.
