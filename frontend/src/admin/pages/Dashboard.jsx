import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DollarSign, ShoppingBag, Users, ArrowUpRight, Plus } from "lucide-react";
import { adminService } from "../services/adminService";
import PageHeader  from "../components/PageHeader";
import StatCard    from "../components/StatCard";
import Card, { CardHeader, CardBody } from "../components/ui/Card";
import Button      from "../components/ui/Button";
import AreaChart   from "../components/charts/AreaChart";
import DonutChart  from "../components/charts/DonutChart";
import EmptyState  from "../components/EmptyState";

const fmtUSD = (v) => `$${Number(v).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const d = await adminService.dashboard();
        if (!cancelled) setData(d);
      } catch (e) {
        if (!cancelled) setError(e.message || "Failed to load dashboard");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (loading) return <DashboardSkeleton />;
  if (error)   return <EmptyState title="Could not load dashboard" hint={error} />;

  const monthly = data.monthlySales;
  const latest  = monthly.at(-1);
  const prev    = monthly.at(-2);
  const series  = monthly.map((m) => m.revenue);
  const orderS  = monthly.map((m) => m.orders);

  const revDelta   = prev ? ((latest.revenue - prev.revenue) / prev.revenue) * 100 : 0;
  const orderDelta = prev ? ((latest.orders  - prev.orders)  / prev.orders ) * 100 : 0;

  return (
    <>
      <PageHeader
        kicker="Overview"
        title="Dashboard"
        subtitle="A snapshot of revenue, orders and inventory health."
        actions={
          <Button onClick={() => navigate("/admin/products/new")} variant="primary">
            <Plus size={14} /> Add product
          </Button>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard
          label="Revenue (this month)"
          value={latest.revenue}
          format={fmtUSD}
          delta={revDelta}
          icon={DollarSign}
          series={series}
        />
        <StatCard
          label="Orders (this month)"
          value={latest.orders}
          delta={orderDelta}
          icon={ShoppingBag}
          series={orderS}
        />
        <StatCard
          label="Avg. order value"
          value={Math.round(latest.revenue / latest.orders)}
          format={fmtUSD}
          delta={revDelta - orderDelta}
          icon={DollarSign}
        />
        <StatCard
          label="Active customers"
          value={1283}
          delta={4.2}
          icon={Users}
        />
      </div>

      {/* Revenue chart + Category donut */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mt-5">
        <Card className="xl:col-span-2">
          <CardHeader
            title="Revenue trend"
            subtitle="Last 12 months"
            action={<span className="eyebrow !text-[--color-bronze-300]">USD</span>}
          />
          <CardBody className="!pt-2">
            <AreaChart
              data={monthly.map((m) => ({ label: m.label, value: m.revenue }))}
              format={fmtUSD}
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Category share" subtitle="By revenue" />
          <CardBody>
            <DonutChart
              data={data.categoryShare}
              centerLabel="Categories"
              centerValue={data.categoryShare.length}
            />
          </CardBody>
        </Card>
      </div>

      {/* Top sellers */}
      <Card className="mt-5">
        <CardHeader
          title="Top sellers"
          subtitle="Highest-grossing products this period"
          action={
            <Link to="/admin/products" className="text-[12px] text-[--color-bronze-300] hover:text-[--color-bronze-200] inline-flex items-center gap-1">
              View all <ArrowUpRight size={12} />
            </Link>
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-y border-[--color-onyx-700]">
                {["Product", "Category", "Units sold", "Revenue"].map((h, i) => (
                  <th
                    key={h}
                    className={`px-5 py-3 text-[11px] tracking-[0.18em] uppercase text-[--color-stone] font-medium ${i >= 2 ? "text-right" : "text-left"}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.topSellers.map((p, i) => (
                <tr key={p.id} className="border-b border-[--color-onyx-700]/60 last:border-0">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <span className="h-7 w-7 grid place-items-center rounded-md bg-[--color-onyx-700] text-[--color-stone] text-[12px] tabular-nums">
                        {i + 1}
                      </span>
                      <div>
                        <p className="text-sm text-[--color-ivory]">{p.name}</p>
                        <p className="text-[11px] text-[--color-stone]">ID #{p.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-[--color-stone]">{p.category}</td>
                  <td className="px-5 py-3.5 text-sm text-[--color-ivory] text-right tabular-nums">{p.sold}</td>
                  <td className="px-5 py-3.5 text-sm text-[--color-ivory] text-right tabular-nums">{fmtUSD(p.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}

function DashboardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-8 w-48 rounded skeleton-dark mb-2" />
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
