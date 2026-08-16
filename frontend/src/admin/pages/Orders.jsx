import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Filter, ShoppingBag, CircleDollarSign, Clock, PackageCheck } from "lucide-react";
import { adminService } from "../services/adminService";
import { useTable }     from "../hooks/useTable";
import PageHeader  from "../components/PageHeader";
import SearchInput from "../components/SearchInput";
import DataTable   from "../components/DataTable";
import Pagination  from "../components/Pagination";
import Modal       from "../components/Modal";
import StatCard    from "../components/StatCard";
import Card        from "../components/ui/Card";
import Badge       from "../components/ui/Badge";
import Button      from "../components/ui/Button";
import Select      from "../components/ui/Select";

const STATUS_OPTS = [
  { value: "PENDING",   label: "Pending" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "SHIPPED",   label: "Shipped" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" },
];

const fmtUSD = (v) => `$${Number(v).toLocaleString()}`;

export default function Orders() {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [active, setActive]   = useState(null);          // order being viewed
  const [draftStatus, setDraftStatus] = useState("");
  const [saving, setSaving]   = useState(false);

  useEffect(() => { (async () => {
    setLoading(true);
    try { setOrders(await adminService.listOrders()); }
    catch (e) { toast.error(e.message || "Failed to load orders"); }
    finally { setLoading(false); }
  })(); }, []);

  const filtered = statusFilter
    ? orders.filter((o) => o.status === statusFilter)
    : orders;

  const t = useTable(filtered, {
    searchKeys:  ["id", "customer", "email"],
    initialSort: { key: "placedAt", dir: "desc" },
    pageSize: 10,
  });

  // KPI tallies — useMemo so this is cheap on re-renders
  const kpis = useMemo(() => ({
    total:     orders.length,
    revenue:   orders.filter((o) => o.paymentStatus === "PAID").reduce((s, o) => s + o.total, 0),
    pending:   orders.filter((o) => o.status === "PENDING").length,
    delivered: orders.filter((o) => o.status === "DELIVERED").length,
  }), [orders]);

  const openOrder = (o) => { setActive(o); setDraftStatus(o.status); };

  const saveStatus = async () => {
    setSaving(true);
    try {
      await adminService.updateOrderStatus(active.id, draftStatus);
      setOrders((prev) => prev.map((o) => o.id === active.id ? { ...o, status: draftStatus } : o));
      toast.success(`Order ${active.id} → ${draftStatus}`);
      setActive(null);
    } catch (e) {
      toast.error(e.message || "Could not update status");
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    { key: "id",       header: "Order #", sortable: true,
      render: (r) => <span className="font-mono text-sm text-[--color-ivory]">{r.id}</span> },
    { key: "customer", header: "Customer", sortable: true,
      render: (r) => (
        <div>
          <p className="text-sm text-[--color-ivory]">{r.customer}</p>
          <p className="text-[11px] text-[--color-stone]">{r.email}</p>
        </div>
      ) },
    { key: "items",   header: "Items", sortable: true, align: "right",
      render: (r) => <span className="tabular-nums">{r.items}</span> },
    { key: "total",   header: "Total", sortable: true, align: "right",
      render: (r) => <span className="tabular-nums">{fmtUSD(r.total)}</span> },
    { key: "paymentStatus", header: "Payment",
      render: (r) => <Badge tone={r.paymentStatus}>{r.paymentStatus}</Badge> },
    { key: "status", header: "Status",
      render: (r) => <Badge tone={r.status}>{r.status}</Badge> },
    { key: "placedAt", header: "Placed", sortable: true,
      render: (r) => <span className="text-[--color-stone] text-sm">{r.placedAt}</span> },
  ];

  return (
    <>
      <PageHeader
        kicker="Fulfilment"
        title="Orders"
        subtitle="Track payment, fulfilment and delivery in one place."
      />

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-5 mb-5">
        <StatCard label="Total orders"     value={kpis.total}     icon={ShoppingBag} />
        <StatCard label="Paid revenue"     value={kpis.revenue}   format={fmtUSD} icon={CircleDollarSign} />
        <StatCard label="Pending"          value={kpis.pending}   icon={Clock} />
        <StatCard label="Delivered"        value={kpis.delivered} icon={PackageCheck} />
      </div>

      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 p-4 border-b border-[--color-onyx-700]">
          <SearchInput
            value={t.query}
            onChange={t.setQuery}
            placeholder="Search by order #, customer, email…"
            className="flex-1 min-w-[200px] max-w-md"
          />
          <div className="flex items-center gap-2 ml-auto">
            <Filter size={14} className="text-[--color-stone]" />
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="!h-9 min-w-[160px]"
              options={[{ value: "", label: "All statuses" }, ...STATUS_OPTS]}
            />
          </div>
        </div>

        <DataTable
          columns={columns}
          rows={t.rows}
          sort={t.sort}
          onSort={t.toggleSort}
          loading={loading}
          onRowClick={openOrder}
          emptyMessage="No orders match your filters"
        />

        <Pagination
          page={t.page}
          totalPages={t.totalPages}
          onChange={t.setPage}
          total={t.total}
          pageSize={t.pageSize}
          onPageSize={t.setPageSize}
        />
      </Card>

      {/* Order detail / status update */}
      <Modal
        open={active != null}
        onClose={() => setActive(null)}
        title={`Order ${active?.id || ""}`}
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setActive(null)}>Close</Button>
            <Button onClick={saveStatus} disabled={saving || draftStatus === active?.status}>
              {saving ? "Updating…" : "Update status"}
            </Button>
          </>
        }
      >
        {active && (
          <div className="flex flex-col gap-5">
            <dl className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm">
              <Row label="Customer" value={active.customer} />
              <Row label="Email"    value={active.email} />
              <Row label="Items"    value={active.items} />
              <Row label="Total"    value={fmtUSD(active.total)} />
              <Row label="Placed"   value={active.placedAt} />
              <Row label="Payment"  value={<Badge tone={active.paymentStatus}>{active.paymentStatus}</Badge>} />
            </dl>

            <div className="pt-5 border-t border-[--color-onyx-700]">
              <Select
                label="Order status"
                value={draftStatus}
                onChange={(e) => setDraftStatus(e.target.value)}
                options={STATUS_OPTS}
              />
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}

function Row({ label, value }) {
  return (
    <div>
      <dt className="text-[11px] tracking-[0.18em] uppercase text-[--color-stone]">{label}</dt>
      <dd className="text-sm text-[--color-ivory] mt-0.5">{value}</dd>
    </div>
  );
}
