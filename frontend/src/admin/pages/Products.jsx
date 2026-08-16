import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Filter } from "lucide-react";
import { adminService } from "../services/adminService";
import { useTable }     from "../hooks/useTable";
import PageHeader       from "../components/PageHeader";
import SearchInput      from "../components/SearchInput";
import DataTable        from "../components/DataTable";
import Pagination       from "../components/Pagination";
import Modal            from "../components/Modal";
import Badge            from "../components/ui/Badge";
import Button           from "../components/ui/Button";
import Select           from "../components/ui/Select";
import Card             from "../components/ui/Card";

const fmtUSD = (v) => `$${Number(v).toLocaleString()}`;

export default function Products() {
  const navigate = useNavigate();
  const [products, setProducts]   = useState([]);
  const [loading,  setLoading]    = useState(true);
  const [category, setCategory]   = useState("");
  const [confirmId, setConfirmId] = useState(null);

  // Load
  useEffect(() => { (async () => {
    setLoading(true);
    try { setProducts(await adminService.listProducts()); }
    catch (e) { toast.error(e.message || "Failed to load products"); }
    finally { setLoading(false); }
  })(); }, []);

  // Categories — derived from data so it stays in sync
  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category))).sort(),
    [products]
  );

  const filtered = useMemo(
    () => (category ? products.filter((p) => p.category === category) : products),
    [products, category]
  );

  const t = useTable(filtered, {
    searchKeys:  ["name", "sku", "category"],
    initialSort: { key: "name", dir: "asc" },
    pageSize: 10,
  });

  const handleDelete = async () => {
    const id = confirmId;
    setConfirmId(null);
    try {
      await adminService.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Product deleted");
    } catch (e) {
      toast.error(e.message || "Could not delete");
    }
  };

  const columns = [
    {
      key: "name", header: "Product", sortable: true,
      render: (r) => (
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={r.image}
            alt=""
            loading="lazy"
            decoding="async"
            width="40"
            height="40"
            className="h-10 w-10 rounded-md object-cover bg-[--color-onyx-700]"
          />
          <div className="min-w-0">
            <p className="text-sm text-[--color-ivory] truncate max-w-[260px]">{r.name}</p>
            <p className="text-[11px] text-[--color-stone] font-mono">{r.sku}</p>
          </div>
        </div>
      ),
    },
    { key: "category", header: "Category", sortable: true,
      render: (r) => <span className="text-sm text-[--color-stone]">{r.category}</span> },
    { key: "price", header: "Price", sortable: true, align: "right",
      render: (r) => <span className="tabular-nums">{fmtUSD(r.price)}</span> },
    { key: "stock", header: "Stock", sortable: true, align: "right",
      render: (r) => <span className="tabular-nums">{r.stock}</span> },
    { key: "status", header: "Status",
      render: (r) => <Badge tone={r.status}>{r.status === "OOS" ? "Out of stock" : r.status === "LOW" ? "Low stock" : "Active"}</Badge> },
    {
      key: "actions", header: "", align: "right",
      render: (r) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={(e) => { e.stopPropagation(); navigate(`/admin/products/${r.id}/edit`); }}
            className="grid place-items-center h-8 w-8 rounded-md text-[--color-stone] hover:text-[--color-bronze-300] hover:bg-[--color-onyx-700]"
            aria-label="Edit"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setConfirmId(r.id); }}
            className="grid place-items-center h-8 w-8 rounded-md text-[--color-stone] hover:text-red-300 hover:bg-[--color-onyx-700]"
            aria-label="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        kicker="Catalogue"
        title="Products"
        subtitle={`${products.length} products across ${categories.length} categories.`}
        actions={
          <Button onClick={() => navigate("/admin/products/new")}>
            <Plus size={14} /> Add product
          </Button>
        }
      />

      <Card className="overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 p-4 border-b border-[--color-onyx-700]">
          <SearchInput
            value={t.query}
            onChange={t.setQuery}
            placeholder="Search by name, SKU, category…"
            className="flex-1 min-w-[200px] max-w-md"
          />
          <div className="flex items-center gap-2 ml-auto">
            <Filter size={14} className="text-[--color-stone]" />
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="!h-9 min-w-[160px]"
              options={[{ value: "", label: "All categories" }, ...categories.map((c) => ({ value: c, label: c }))]}
            />
          </div>
        </div>

        <DataTable
          columns={columns}
          rows={t.rows}
          sort={t.sort}
          onSort={t.toggleSort}
          loading={loading}
          onRowClick={(r) => navigate(`/admin/products/${r.id}/edit`)}
          emptyMessage="No products match your filters"
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

      <Modal
        open={confirmId != null}
        onClose={() => setConfirmId(null)}
        title="Delete product?"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmId(null)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete}>Delete</Button>
          </>
        }
      >
        <p className="text-sm text-[--color-stone]">
          This will permanently remove the product from the catalogue. Existing orders that
          reference it keep their line-item snapshots.
        </p>
      </Modal>
    </>
  );
}
