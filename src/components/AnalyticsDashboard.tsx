import { useQuery } from "@tanstack/react-query";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, DollarSign, Car, Users, CreditCard } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { api } from "@/lib/api";

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const AnalyticsDashboard = () => {
  const { t } = useLanguage();

  const { data: chartData, isLoading } = useQuery({
    queryKey: ["analytics-charts"],
    queryFn: () => api("/users/analytics/charts"),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!chartData) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">{t('admin.noAnalyticsData')}</p>
      </div>
    );
  }

  const revenueTrend = chartData?.revenueTrend || [];
  const profitableCars = chartData?.profitableCars || [];
  const bookingsByStatus = chartData?.bookingsByStatus || [];
  const bookingsTrend = chartData?.bookingsTrend || [];
  const customerRetention = chartData?.customerRetention || [];
  const paymentMethods = chartData?.paymentMethods || [];
  const weeklyRevenue = chartData?.weeklyRevenue || [];

  // Calculate metrics
  const totalRetentionRevenue = customerRetention.reduce((sum: number, c: any) => sum + c.total_spent, 0);
  const repeatCustomers = customerRetention.length;
  const avgBookingsPerCustomer = repeatCustomers > 0 
    ? (customerRetention.reduce((sum: number, c: any) => sum + c.booking_count, 0) / repeatCustomers).toFixed(1)
    : 0;

  // Revenue growth calculation
  const recentMonths = revenueTrend.slice(-2);
  const revenueGrowth = recentMonths.length === 2
    ? (((recentMonths[1].revenue - recentMonths[0].revenue) / (recentMonths[0].revenue || 1)) * 100).toFixed(1)
    : 0;

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="glass-card p-4 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{t('admin.revenueGrowth')}</p>
            {Number(revenueGrowth) >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </div>
          <p className="text-2xl font-bold">{revenueGrowth}%</p>
          <p className="text-xs text-muted-foreground">{t('admin.vsLastMonth')}</p>
        </div>

        <div className="glass-card p-4 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{t('admin.repeatCustomers')}</p>
            <Users className="h-4 w-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold">{repeatCustomers}</p>
          <p className="text-xs text-muted-foreground">{avgBookingsPerCustomer} {t('admin.avgBookings')}</p>
        </div>

        <div className="glass-card p-4 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{t('admin.retentionRevenue')}</p>
            <DollarSign className="h-4 w-4 text-green-500" />
          </div>
          <p className="text-2xl font-bold">{totalRetentionRevenue.toFixed(0)} {t('currency')}</p>
          <p className="text-xs text-muted-foreground">{t('admin.fromRepeatCustomers')}</p>
        </div>

        <div className="glass-card p-4 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{t('admin.topCarRevenue')}</p>
            <Car className="h-4 w-4 text-purple-500" />
          </div>
          <p className="text-2xl font-bold">{profitableCars[0]?.total_revenue || 0} {t('currency')}</p>
          <p className="text-xs text-muted-foreground truncate">{profitableCars[0]?.brand} {profitableCars[0]?.name}</p>
        </div>
      </div>

      {/* Revenue Trend Chart */}
      <div className="glass-card p-6 space-y-4">
        <h3 className="font-display text-lg font-semibold">{t('admin.revenueTrend')}</h3>
        {revenueTrend.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="month" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                labelStyle={{ color: '#fff' }}
              />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} name={`${t('admin.total')} (${t('currency')})`} />
              <Line type="monotone" dataKey="bookings" stroke="#10b981" strokeWidth={2} name={t('admin.bookingsColumn')} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            {t('admin.noRevenueData')}
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Weekly Revenue */}
        <div className="glass-card p-6 space-y-4">
          <h3 className="font-display text-lg font-semibold">{t('admin.weeklyRevenue')}</h3>
          {weeklyRevenue.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weeklyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="week" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Bar dataKey="revenue" fill="#3b82f6" name={`${t('admin.total')} (${t('currency')})`} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-muted-foreground">
              {t('admin.noWeeklyData')}
            </div>
          )}
        </div>

        {/* Bookings by Status */}
        <div className="glass-card p-6 space-y-4">
          <h3 className="font-display text-lg font-semibold">{t('admin.bookingsByStatus')}</h3>
          {bookingsByStatus.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={bookingsByStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ status, count }) => `${status}: ${count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {bookingsByStatus.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-muted-foreground">
              {t('admin.noBookingStatusData')}
            </div>
          )}
        </div>
      </div>

      {/* Most Profitable Cars */}
      <div className="glass-card p-6 space-y-4">
        <h3 className="font-display text-lg font-semibold">{t('admin.mostProfitableCars')}</h3>
        {profitableCars.length > 0 ? (
          <div className="space-y-3">
            {profitableCars.slice(0, 5).map((car: any, index: number) => (
              <div key={car.id} className="flex items-center gap-4 p-3 rounded-lg bg-secondary/30">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary font-bold">
                  {index + 1}
                </div>
                {car.image_url && (
                  <img src={car.image_url} alt={car.name} className="w-16 h-12 object-cover rounded" />
                )}
                <div className="flex-1">
                  <p className="font-medium">{car.brand} {car.name}</p>
                  <p className="text-sm text-muted-foreground">{car.booking_count} {t('admin.bookingsColumn').toLowerCase()}</p>
                </div>
                <div className="text-right">
                  <p className="font-display font-bold text-primary">{car.total_revenue} {t('currency')}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            {t('admin.noCarBookingData')}
          </div>
        )}
      </div>

      {/* Payment Methods Distribution */}
      <div className="glass-card p-6 space-y-4">
        <h3 className="font-display text-lg font-semibold">{t('admin.paymentMethods')}</h3>
        {paymentMethods.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {paymentMethods.map((method: any) => (
              <div key={method.payment_method} className="flex items-center gap-4 p-4 rounded-lg bg-secondary/30">
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium capitalize">{method.payment_method}</p>
                  <p className="text-sm text-muted-foreground">{method.count} {t('admin.bookingsColumn').toLowerCase()}</p>
                </div>
                <div className="text-right">
                  <p className="font-display font-bold">{method.revenue} {t('currency')}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            {t('admin.noPaymentData')}
          </div>
        )}
      </div>

      {/* Top Repeat Customers */}
      <div className="glass-card p-6 space-y-4">
        <h3 className="font-display text-lg font-semibold">{t('admin.topRepeatCustomers')}</h3>
        {customerRetention.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">{t('admin.customer')}</th>
                  <th className="text-center py-3 px-2 text-sm font-medium text-muted-foreground">{t('admin.bookingsColumn')}</th>
                  <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">{t('admin.totalSpentColumn')}</th>
                </tr>
              </thead>
              <tbody>
                {customerRetention.slice(0, 10).map((customer: any) => (
                  <tr key={customer.user_id} className="border-b border-border/30">
                    <td className="py-3 px-2 text-sm">{customer.customer_email}</td>
                    <td className="py-3 px-2 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary font-bold text-sm">
                        {customer.booking_count}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right font-display font-semibold text-primary">
                      {customer.total_spent} {t('currency')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            {t('admin.noRepeatCustomers')}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
