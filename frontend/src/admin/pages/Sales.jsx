import { useEffect, useState } from "react";
import { DollarSign, ShoppingBag, TrendingUp, Receipt, Download } from "lucide-react";
import { adminService } from "../services/adminService";
import PageHeader from "../components/PageHeader";
import StatCard   from "../components/StatCard";
import Card, { CardHeader, CardBody } from "../components/ui/Card";
import AreaChart  from "../components/charts/AreaChart";
import BarChart   from "../components/charts/BarChart";
import DonutChart from "../components/charts/DonutChart";
import Button     from "../components/ui/Button";
import Select     from "../components/ui/Select";
import EmptyState from "../components/EmptyState";

const fmtUSD = (v) => `$${Number(v).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

const RANGE_OPTS = [
  { value: "year",  label: "Last 12 months" },
  { value: "180d",  label: "Last 6 months" },
  { value: "90d",   label: "Last 3 months" },
];

export default function Sales() {
  const [range, setRange]     = useState("year");
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const d = await adminService.salesOverview({ range });
        if (!cancelled) setData(d);
      } catch (e) {
        if (!cancelled) setError(e.message || "Failed to load sales");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [range]);

  if (loading) return <SalesSkeleton />;
  if (error)   return <EmptyState title="Could not load sales" hint={error} />;

  const monthly = data.monthlySales;
  const totalRev    = monthly.reduce((s, m) => s + m.revenue, 0);
  const totalOrders = monthly.reduce((s, m) => s + m.orders, 0);
  const aov         = Math.round(totalRev / totalOrders);
  const growth      = ((monthly.at(-1).revenue - monthly[0].revenue) / monthly[0].revenue) * 100;

  return (
    <>
      <PageHeader
        kicker="Reporting"
        title="Sales overview"
        subtitle="Long-range trends across revenue, orders and categories."
        actions={
          <>
            <Select
              value={range}
              onChange={(e) => setRange(e.target.value)}
              className="!h-9 min-w-[170px]"
              options={RANGE_OPTS}
            />
            <Button variant="outline">
              <Download size={14} /> Export
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard label="Total revenue" value={totalRev}    format={fmtUSD} icon={DollarSign} delta={growth} />
        <StatCard label="Total orders"  value={totalOrders} icon={ShoppingBag} delta={growth * 0.6} />
        <StatCard label="Avg. order"    value={aov}         format={fmtUSD} icon={Receipt} delta={growth * 0.3} />
        <StatCard label="Growth"        value={growth.toFixed(1) + "%"} icon={TrendingUp} delta={growth} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mt-5">
        <Card className="xl:col-span-2">
          <CardHeader title="Revenue over time" subtitle="Monthly performance" />
          <CardBody className="!pt-2">
            <AreaChart
              data={monthly.map((m) => ({ label: m.label, value: m.revenue }))}
              format={fmtUSD}
              height={300}
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Category mix" subtitle="By revenue share" />
          <CardBody>
            <DonutChart
              data={data.categoryShare}
              centerLabel="Total"
              centerValue={fmtUSD(totalRev)}
            />
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mt-5">
        <Card>
          <CardHeader title="Orders per month" />
          <CardBody className="!pt-2">
            <AreaChart
              data={monthly.map((m) => ({ label: m.label, value: m.orders }))}
              format={(v) => `${v}`}
              stroke="#74cabc"
              height={240}
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Category leaderboard" />
          <CardBody>
            <BarChart data={data.categoryShare} format={fmtUSD} />
          </CardBody>
        </Card>
      </div>
    </>
  );
}

function SalesSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-8 w-56 rounded skeleton-dark mb-2" />
      <div className="h-4 w-72 rounded skeleton-dark mb-8" />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-32 rounded-xl border border-[--color-onyx-700] skeleton-dark" />
        ))}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mt-5">
        <div className="xl:col-span-2 h-80 rounded-xl border border-[--color-onyx-700] skeleton-dark" />
        <div className="h-80 rounded-xl border border-[--color-onyx-700] skeleton-dark" />
      </div>
    </div>
  );
}
