import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Pencil, Filter } from "lucide-react";
import { adminService } from "../services/adminService";
import { useTable }     from "../hooks/useTable";
import PageHeader   from "../components/PageHeader";
import SearchInput  from "../components/SearchInput";
import DataTable    from "../components/DataTable";
import Pagination   from "../components/Pagination";
import Modal        from "../components/Modal";
import Card         from "../components/ui/Card";
import Badge        from "../components/ui/Badge";
import Button       from "../components/ui/Button";
import Input        from "../components/ui/Input";
import Select       from "../components/ui/Select";

const ROLE_OPTS   = [{ value: "CUSTOMER", label: "Customer" }, { value: "ADMIN", label: "Admin" }];
const STATUS_OPTS = [
  { value: "ACTIVE",   label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "PENDING",  label: "Pending" },
];

const fmtUSD = (v) => `$${Number(v).toLocaleString()}`;

export default function Users() {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState("");
  const [editing, setEditing] = useState(null);
  const [draft,   setDraft]   = useState(null);
  const [saving,  setSaving]  = useState(false);

  useEffect(() => { (async () => {
    setLoading(true);
    try { setUsers(await adminService.listUsers()); }
    catch (e) { toast.error(e.message || "Failed to load users"); }
    finally { setLoading(false); }
  })(); }, []);

  const filtered = roleFilter ? users.filter((u) => u.role === roleFilter) : users;

  const t = useTable(filtered, {
    searchKeys:  ["username", "email"],
    initialSort: { key: "joined", dir: "desc" },
    pageSize: 10,
  });

  const openEdit = (u) => { setEditing(u); setDraft({ ...u }); };

  const save = async () => {
    setSaving(true);
    try {
      const updated = await adminService.updateUser(editing.id, draft);
      setUsers((prev) => prev.map((u) => (u.id === editing.id ? { ...u, ...updated } : u)));
      toast.success("User updated");
      setEditing(null);
    } catch (e) {
      toast.error(e.message || "Could not update user");
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    {
      key: "username", header: "User", sortable: true,
      render: (r) => (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[--color-bronze-500] to-[--color-bronze-700] grid place-items-center text-[--color-onyx-900] text-xs font-semibold">
            {r.username[0].toUpperCase()}
          </div>
          <div>
            <p className="text-sm text-[--color-ivory]">{r.username}</p>
            <p className="text-[11px] text-[--color-stone]">{r.email}</p>
          </div>
        </div>
      ),
    },
    { key: "role",   header: "Role",   sortable: true, render: (r) => <Badge tone={r.role}>{r.role}</Badge> },
    { key: "status", header: "Status", sortable: true, render: (r) => <Badge tone={r.status}>{r.status}</Badge> },
    { key: "orders", header: "Orders", sortable: true, align: "right",
      render: (r) => <span className="tabular-nums">{r.orders}</span> },
    { key: "spend",  header: "Spend",  sortable: true, align: "right",
      render: (r) => <span className="tabular-nums">{fmtUSD(r.spend)}</span> },
    { key: "joined", header: "Joined", sortable: true,
      render: (r) => <span className="text-[--color-stone] text-sm">{r.joined}</span> },
    {
      key: "actions", header: "", align: "right",
      render: (r) => (
        <button
          onClick={(e) => { e.stopPropagation(); openEdit(r); }}
          className="grid place-items-center h-8 w-8 rounded-md text-[--color-stone] hover:text-[--color-bronze-300] hover:bg-[--color-onyx-700]"
          aria-label="Edit user"
        >
          <Pencil size={14} />
        </button>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        kicker="People"
        title="Users"
        subtitle={`${users.length} total — ${users.filter((u) => u.role === "ADMIN").length} admin · ${users.filter((u) => u.role === "CUSTOMER").length} customer`}
      />

      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 p-4 border-b border-[--color-onyx-700]">
          <SearchInput
            value={t.query}
            onChange={t.setQuery}
            placeholder="Search by username or email…"
            className="flex-1 min-w-[200px] max-w-md"
          />
          <div className="flex items-center gap-2 ml-auto">
            <Filter size={14} className="text-[--color-stone]" />
            <Select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="!h-9 min-w-[140px]"
              options={[{ value: "", label: "All roles" }, ...ROLE_OPTS]}
            />
          </div>
        </div>

        <DataTable
          columns={columns}
          rows={t.rows}
          sort={t.sort}
          onSort={t.toggleSort}
          loading={loading}
          onRowClick={openEdit}
          emptyMessage="No users match your filters"
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
        open={editing != null}
        onClose={() => setEditing(null)}
        title={`Edit ${editing?.username || ""}`}
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={save} disabled={saving}>{saving ? "Saving…" : "Save changes"}</Button>
          </>
        }
      >
        {draft && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Username" name="username"
              value={draft.username}
              onChange={(e) => setDraft((d) => ({ ...d, username: e.target.value }))}
            />
            <Input
              label="Email" name="email" type="email"
              value={draft.email}
              onChange={(e) => setDraft((d) => ({ ...d, email: e.target.value }))}
            />
            <Select
              label="Role" name="role"
              value={draft.role}
              onChange={(e) => setDraft((d) => ({ ...d, role: e.target.value }))}
              options={ROLE_OPTS}
            />
            <Select
              label="Status" name="status"
              value={draft.status}
              onChange={(e) => setDraft((d) => ({ ...d, status: e.target.value }))}
              options={STATUS_OPTS}
            />
          </div>
        )}
      </Modal>
    </>
  );
}
