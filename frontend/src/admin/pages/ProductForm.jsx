import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { adminService } from "../services/adminService";
import PageHeader from "../components/PageHeader";
import Modal      from "../components/Modal";
import Card, { CardBody } from "../components/ui/Card";
import Button     from "../components/ui/Button";
import Input      from "../components/ui/Input";
import Textarea   from "../components/ui/Textarea";
import Select     from "../components/ui/Select";

const CATEGORIES = ["Shirts", "Pants", "Watches", "Jewellery", "Accessories"];
const STATUSES   = [
  { value: "ACTIVE", label: "Active" },
  { value: "LOW",    label: "Low stock" },
  { value: "OOS",    label: "Out of stock" },
];

const emptyForm = {
  name: "", sku: "", category: "Shirts", price: "", stock: "",
  status: "ACTIVE", image: "", description: "",
};

export default function ProductForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [form, setForm]       = useState(emptyForm);
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving]   = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    let cancelled = false;
    (async () => {
      try {
        const p = await adminService.getProduct(id);
        if (cancelled) return;
        if (!p) { toast.error("Product not found"); navigate("/admin/products"); return; }
        setForm({
          name: p.name || "", sku: p.sku || "",
          category: p.category || "Shirts",
          price: p.price ?? "", stock: p.stock ?? "",
          status: p.status || "ACTIVE",
          image: p.image || "", description: p.description || "",
        });
      } catch (e) {
        toast.error(e.message || "Failed to load product");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id, isEdit, navigate]);

  const onChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrors((er) => ({ ...er, [e.target.name]: null }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())                    e.name  = "Name is required";
    if (!form.sku.trim())                     e.sku   = "SKU is required";
    if (form.price === "" || Number(form.price) < 0) e.price = "Enter a valid price";
    if (form.stock === "" || Number(form.stock) < 0) e.stock = "Enter a valid stock";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
    };
    try {
      if (isEdit) {
        await adminService.updateProduct(id, payload);
        toast.success("Product updated");
      } else {
        await adminService.createProduct(payload);
        toast.success("Product created");
      }
      navigate("/admin/products");
    } catch (err) {
      toast.error(err.message || "Could not save product");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    setConfirmDel(false);
    try {
      await adminService.deleteProduct(id);
      toast.success("Product deleted");
      navigate("/admin/products");
    } catch (e) {
      toast.error(e.message || "Could not delete");
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 w-72 rounded skeleton-dark mb-2" />
        <div className="h-4 w-48 rounded skeleton-dark mb-8" />
        <div className="h-[420px] rounded-xl border border-[--color-onyx-700] skeleton-dark" />
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <Link to="/admin/products" className="inline-flex items-center gap-1.5 text-[11px] tracking-[0.18em] uppercase text-[--color-stone] hover:text-[--color-bronze-300]">
          <ArrowLeft size={13} /> Back to products
        </Link>
      </div>

      <PageHeader
        kicker={isEdit ? "Edit product" : "New product"}
        title={isEdit ? form.name || "Edit product" : "Add a new product"}
        subtitle={isEdit ? `SKU ${form.sku}` : "Fill in the details to add a product to your catalogue."}
        actions={
          isEdit && (
            <Button variant="danger" onClick={() => setConfirmDel(true)}>
              <Trash2 size={14} /> Delete
            </Button>
          )
        }
      />

      <form onSubmit={onSubmit} className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">
        {/* Main column */}
        <div className="flex flex-col gap-5">
          <Card>
            <CardBody className="flex flex-col gap-5">
              <Input
                label="Product name"
                name="name"
                placeholder="e.g. Oxford Blue Shirt"
                value={form.name}
                onChange={onChange}
                error={errors.name}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="SKU"
                  name="sku"
                  placeholder="MX-SHR-002"
                  value={form.sku}
                  onChange={onChange}
                  error={errors.sku}
                />
                <Select
                  label="Category"
                  name="category"
                  value={form.category}
                  onChange={onChange}
                  options={CATEGORIES.map((c) => ({ value: c, label: c }))}
                />
              </div>

              <Textarea
                label="Description"
                name="description"
                placeholder="Short merchandise copy customers will read on the product page."
                rows={5}
                value={form.description}
                onChange={onChange}
              />
            </CardBody>
          </Card>

          <Card>
            <CardBody className="flex flex-col gap-5">
              <p className="text-[11px] tracking-[0.18em] uppercase text-[--color-bronze-300]">Pricing & inventory</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label="Price (USD)"
                  type="number" step="0.01" min="0"
                  name="price"
                  placeholder="0.00"
                  value={form.price}
                  onChange={onChange}
                  error={errors.price}
                />
                <Input
                  label="Stock"
                  type="number" min="0"
                  name="stock"
                  placeholder="0"
                  value={form.stock}
                  onChange={onChange}
                  error={errors.stock}
                />
                <Select
                  label="Status"
                  name="status"
                  value={form.status}
                  onChange={onChange}
                  options={STATUSES}
                />
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Side column — image + actions */}
        <div className="flex flex-col gap-5">
          <Card>
            <CardBody className="flex flex-col gap-4">
              <p className="text-[11px] tracking-[0.18em] uppercase text-[--color-bronze-300]">Media</p>
              <div className="aspect-[4/5] rounded-md overflow-hidden bg-[--color-onyx-700] border border-[--color-onyx-600] grid place-items-center">
                {form.image ? (
                  <img src={form.image} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-[11px] tracking-[0.18em] uppercase text-[--color-onyx-500]">No image</span>
                )}
              </div>
              <Input
                label="Image URL"
                name="image"
                placeholder="https://…"
                value={form.image}
                onChange={onChange}
              />
            </CardBody>
          </Card>

          <Card>
            <CardBody className="flex flex-col gap-3">
              <Button type="submit" size="lg" disabled={saving} className="w-full">
                <Save size={14} /> {saving ? "Saving…" : isEdit ? "Save changes" : "Create product"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate("/admin/products")}
                className="w-full"
              >
                Cancel
              </Button>
            </CardBody>
          </Card>
        </div>
      </form>

      <Modal
        open={confirmDel}
        onClose={() => setConfirmDel(false)}
        title="Delete this product?"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmDel(false)}>Cancel</Button>
            <Button variant="danger" onClick={onDelete}>Delete product</Button>
          </>
        }
      >
        <p className="text-sm text-[--color-stone]">
          The product will be removed from the catalogue. Existing orders keep their line-item snapshots.
        </p>
      </Modal>
    </>
  );
}
