"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminAlert } from "@/components/admin/admin-toast";
import { AdminPanel, AdminStat, AdminStatus, adminField, adminPrimary, adminTh } from "@/components/admin/admin-ui";
import { optionLabel } from "@/lib/cart-store";
import type { AdminOrder, OrderStats } from "@/lib/admin-orders";
import { formatPrice } from "@/lib/products";

const orderStatuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];
const paymentStatuses = ["pending", "paid", "failed"];

export function OrderManager({
  orders: initialOrders,
  stats,
  preview = false,
}: {
  orders: AdminOrder[];
  stats: OrderStats;
  preview?: boolean;
}) {
  const router = useRouter();
  const [orders, setOrders] = useState(initialOrders);
  const [selectedId, setSelectedId] = useState(orders[0]?.id ?? "");
  const [message, setMessage] = useState("");
  const { notify } = useAdminAlert();
  const [pending, setPending] = useState(false);
  const selected = orders.find((order) => order.id === selectedId) ?? orders[0];
  const viewStats = preview ? countStats(orders) : stats;

  async function update(kind: "status" | "payment" | "shipping" | "refund", body: Record<string, string>) {
    if (!selected) return;
    setPending(true);
    setMessage("");
    if (preview) {
      setOrders((current) => current.map((order) => (order.id === selected.id ? applySample(order, kind, body) : order)));
      setMessage("Sample order. A real checkout can be updated here.");
      notify({
        title: "Sample order only",
        detail: "A real checkout can be updated here.",
        tone: "warning",
      });
      setPending(false);
      return;
    }
    const path =
      kind === "status"
        ? `/api/admin/orders/${selected.id}/status`
        : kind === "payment"
          ? `/api/admin/orders/${selected.id}/payment`
          : kind === "shipping"
            ? `/api/admin/orders/${selected.id}/shipment`
            : `/api/admin/orders/${selected.id}/refund`;
    try {
      const response = await fetch(path, {
        method: kind === "refund" ? "POST" : kind === "shipping" ? "PUT" : "PATCH",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(body),
      });
      const payload = (await response.json()) as {
        message?: string;
        updatedAt?: string;
        error?: { message?: string };
        shipment?: { courierPartnerName?: string; trackingNumber?: string };
      };
      const saved =
        kind === "shipping"
          ? "Shipment details saved."
          : kind === "status"
            ? "Order status updated."
            : kind === "payment"
              ? "Payment status updated."
              : "Refund initiated.";
      setMessage(payload.error?.message ?? payload.message ?? (response.ok ? saved : "Could not update this order."));
      if (response.ok && kind === "shipping" && payload.shipment) {
        setOrders((current) =>
          current.map((order) =>
            order.id === selected.id
              ? {
                  ...order,
                  courier: payload.shipment?.courierPartnerName ?? order.courier,
                  trackingNumber: payload.shipment?.trackingNumber ?? order.trackingNumber,
                  updatedAt: payload.updatedAt ?? new Date().toISOString(),
                }
              : order,
          ),
        );
      }
      if (response.ok) {
        notify({
          title: saved.replace(/\.$/, ""),
          detail:
            kind === "shipping"
              ? "Courier and tracking are saved on this order."
              : "The order record is updated.",
        });
        router.refresh();
      } else {
        notify({
          title: "Order not updated",
          detail: payload.error?.message ?? payload.message ?? "Could not update this order.",
          tone: "error",
        });
      }
    } catch {
      setMessage("Order API is not running.");
      notify({ title: "Order API is not running", tone: "error" });
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStat featured label="Paid revenue" value={formatPrice(viewStats.revenue)} hint="Collected" />
        <AdminStat label="Orders" value={String(viewStats.totalOrders)} hint="All checkouts" />
        <AdminStat label="Processing" value={String(viewStats.byOrderStatus.processing ?? 0)} hint="In the studio" />
        <AdminStat label="Refunded" value={String(viewStats.byPaymentStatus.refunded ?? 0)} hint="Returned funds" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(22rem,0.85fr)]">
        <AdminPanel title="Checkouts" detail="Select a row to update it.">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <thead className="border-b border-[#eee6d8]">
              <tr>
                <th className={adminTh}>Order</th>
                <th className={adminTh}>Customer</th>
                <th className={adminTh}>Total</th>
                <th className={adminTh}>Payment</th>
                <th className={adminTh}>Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0eadf]">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-sm text-[#7a7164]">
                    No orders yet.
                  </td>
                </tr>
              ) : null}
              {orders.map((order) => {
                const active = order.id === selected?.id;
                return (
                  <tr
                    key={order.id}
                    className={active ? "bg-[#f3ead7]" : "cursor-pointer hover:bg-[#f3eee4]"}
                    onClick={() => {
                      setSelectedId(order.id);
                      setMessage("");
                    }}
                  >
                    <td className="px-5 py-3 font-medium">
                      {order.orderNumber}
                      <span className="mt-0.5 block text-xs font-normal text-[#7a7164]">
                        {dateLabel(order.createdAt)}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      {order.customer.fullName || order.address.fullName}
                      <span className="mt-0.5 block text-xs text-[#7a7164]">
                        {order.items.length} {order.items.length === 1 ? "item" : "items"}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-medium">{formatPrice(order.total)}</td>
                    <td className="px-5 py-3">
                      <AdminStatus value={order.paymentStatus} />
                    </td>
                    <td className="px-5 py-3">
                      <AdminStatus value={order.orderStatus} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        </AdminPanel>

        {selected ? (
          <OrderDetail
            key={selected.id + selected.updatedAt + selected.orderStatus + selected.paymentStatus}
            order={selected}
            pending={pending}
            message={message}
            onStatus={(orderStatus) => update("status", { orderStatus })}
            onPayment={(paymentStatus) => update("payment", { paymentStatus })}
            onShipping={(courier, trackingNumber) =>
              update("shipping", { courierPartnerName: courier, trackingNumber })
            }
            onRefund={(reason) => update("refund", { reason })}
          />
        ) : null}
      </div>
    </div>
  );
}

function OrderDetail({
  order,
  pending,
  message,
  onStatus,
  onPayment,
  onShipping,
  onRefund,
}: {
  order: AdminOrder;
  pending: boolean;
  message: string;
  onStatus: (status: string) => void;
  onPayment: (status: string) => void;
  onShipping: (courier: string, trackingNumber: string) => void;
  onRefund: (reason: string) => void;
}) {
  const [courier, setCourier] = useState(order.courier);
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber);
  const [reason, setReason] = useState(order.refund.reason);

  return (
    <section className="rounded-xl border border-[#ddd4c6] bg-[#fbf8f2] p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-medium tracking-[0.18em] text-[#c6a15a] uppercase">Order</p>
          <h2 className="mt-1 text-lg font-semibold">{order.orderNumber}</h2>
          <p className="mt-1 text-sm text-[#7a7164]">{order.paymentMethod}</p>
        </div>
        <div className="flex gap-2">
          <AdminStatus value={order.orderStatus} />
          <AdminStatus value={order.paymentStatus} />
        </div>
      </div>

      <ul className="mt-4 divide-y divide-[#eee6d8] rounded-md bg-[#f7f3eb] px-4">
        {order.items.map((item) => (
          <li key={`${item.name}-${item.watt || ""}-${item.lightColor || ""}`} className="flex items-center justify-between gap-3 py-3 text-sm">
            <span className="text-[#172033]">
              {item.name}
              {optionLabel(item) ? <span className="text-neutral-500"> · {optionLabel(item)}</span> : null}
              <span className="text-neutral-500"> × {item.quantity}</span>
            </span>
            <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
          </li>
        ))}
      </ul>

      <div className="mt-4 rounded-md border border-[#ddd4c6] px-4 py-3 text-sm">
        <p className="font-medium">{order.address.fullName}</p>
        <p className="mt-1 text-[#5c564c]">
          {order.address.line}, {order.address.city}, {order.address.state} {order.address.pin}
        </p>
        <p className="mt-1 text-[#7a7164]">{order.customer.email || order.address.phone}</p>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-[#172033]">
          Order status
          <select
            className={`${adminField} capitalize`}
            value={order.orderStatus}
            disabled={pending}
            onChange={(event) => onStatus(event.target.value)}
          >
            {orderStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium text-[#172033]">
          Payment
          <select
            className={`${adminField} capitalize`}
            value={order.paymentStatus}
            disabled={pending || order.paymentStatus === "refunded"}
            onChange={(event) => onPayment(event.target.value)}
          >
            {paymentStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
            {order.paymentStatus === "refunded" ? <option value="refunded">refunded</option> : null}
          </select>
        </label>
      </div>

      <form
        className="mt-4"
        onSubmit={(event) => {
          event.preventDefault();
          onShipping(courier, trackingNumber);
        }}
      >
        <p className="text-sm font-medium text-[#172033]">Shipping</p>
        <div className="mt-2 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
          <input
            className={`${adminField} mt-0`}
            value={courier}
            onChange={(event) => setCourier(event.target.value)}
            placeholder="Courier"
            maxLength={100}
            disabled={pending}
          />
          <input
            className={`${adminField} mt-0`}
            value={trackingNumber}
            onChange={(event) => setTrackingNumber(event.target.value)}
            placeholder="Tracking number"
            maxLength={100}
            disabled={pending}
          />
          <button
            type="submit"
            disabled={pending}
            className={adminPrimary}
          >
            Save
          </button>
        </div>
      </form>

      <form
        className="mt-4 space-y-3 border-t border-neutral-100 pt-4"
        onSubmit={(event) => {
          event.preventDefault();
          onRefund(reason);
        }}
      >
        <p className="text-sm font-medium text-[#172033]">Refund</p>
        <textarea
          className="min-h-20 w-full rounded-md border border-[#ddd4c6] bg-[#f7f3eb] px-3 py-2 text-sm outline-none focus:border-[#c6a15a]"
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          placeholder="Reason for the refund"
          disabled={pending || order.refund.status === "initiated"}
        />
        <button
          type="submit"
          disabled={pending || order.refund.status === "initiated" || order.paymentStatus !== "paid"}
          className="inline-flex h-9 w-full items-center justify-center rounded-md border border-[#141a22] text-xs font-semibold tracking-[0.12em] uppercase hover:bg-[#141a22] hover:text-[#f3ead7] disabled:opacity-60"
        >
          {order.refund.status === "initiated" ? "Refund initiated" : "Initiate refund"}
        </button>
      </form>

      {message ? <p className="mt-4 text-sm text-[#145860]">{message}</p> : null}
    </section>
  );
}

function dateLabel(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}

function applySample(order: AdminOrder, kind: "status" | "payment" | "shipping" | "refund", body: Record<string, string>): AdminOrder {
  if (kind === "status" && body.orderStatus) return { ...order, orderStatus: body.orderStatus };
  if (kind === "payment" && body.paymentStatus && order.paymentStatus !== "refunded") {
    return { ...order, paymentStatus: body.paymentStatus };
  }
  if (kind === "shipping") {
    return {
      ...order,
      courier: body.courierPartnerName ?? body.courier ?? "",
      trackingNumber: body.trackingNumber ?? "",
    };
  }
  if (kind === "refund" && order.paymentStatus === "paid" && order.refund.status !== "initiated") {
    return {
      ...order,
      paymentStatus: "refunded",
      refund: { status: "initiated", reason: body.reason ?? "", initiatedAt: new Date().toISOString() },
    };
  }
  return order;
}

function countStats(orders: AdminOrder[]): OrderStats {
  const byOrderStatus: Record<string, number> = {};
  const byPaymentStatus: Record<string, number> = {};
  let revenue = 0;
  for (const order of orders) {
    byOrderStatus[order.orderStatus] = (byOrderStatus[order.orderStatus] ?? 0) + 1;
    byPaymentStatus[order.paymentStatus] = (byPaymentStatus[order.paymentStatus] ?? 0) + 1;
    if (order.paymentStatus === "paid") revenue += order.total;
  }
  return { totalOrders: orders.length, revenue, byOrderStatus, byPaymentStatus };
}
