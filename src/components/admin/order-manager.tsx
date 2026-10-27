"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { optionLabel } from "@/lib/cart-store";
import type { AdminOrder, OrderStats } from "@/lib/admin-orders";
import { formatPrice } from "@/lib/products";

const orderStatuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];
const paymentStatuses = ["pending", "paid", "failed"];

const statusTone: Record<string, string> = {
  pending: "bg-[#eef2f6] text-[#3d4d63]",
  confirmed: "bg-[#e5f6f4] text-[#145860]",
  processing: "bg-[#e7f0ff] text-[#1d4f91]",
  shipped: "bg-[#e8f4ea] text-[#1f6b3a]",
  delivered: "bg-[#e5f6f4] text-[#145860]",
  cancelled: "bg-[#fdecec] text-[#8a3030]",
};

const paymentTone: Record<string, string> = {
  pending: "bg-[#eef2f6] text-[#3d4d63]",
  paid: "bg-[#e5f6f4] text-[#145860]",
  failed: "bg-[#fdecec] text-[#8a3030]",
  refunded: "bg-[#fff4e8] text-[#9a4d12]",
};

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
      if (response.ok) router.refresh();
    } catch {
      setMessage("Order API is not running.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Orders" value={String(viewStats.totalOrders)} />
        <Stat label="Paid revenue" value={formatPrice(viewStats.revenue)} />
        <Stat label="Processing" value={String(viewStats.byOrderStatus.processing ?? 0)} />
        <Stat label="Refunded" value={String(viewStats.byPaymentStatus.refunded ?? 0)} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(22rem,0.85fr)]">
        <div className="overflow-x-auto rounded-2xl border border-[#d5e2ea] bg-white">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <thead className="border-b border-neutral-100 text-neutral-500">
              <tr>
                <th className="px-5 py-3 font-medium">Order</th>
                <th className="px-5 py-3 font-medium">Customer</th>
                <th className="px-5 py-3 font-medium">Total</th>
                <th className="px-5 py-3 font-medium">Payment</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-sm text-neutral-500">
                    No orders yet.
                  </td>
                </tr>
              ) : null}
              {orders.map((order) => {
                const active = order.id === selected?.id;
                return (
                  <tr
                    key={order.id}
                    className={active ? "bg-[#e5f6f4]" : "cursor-pointer hover:bg-[#f4f8fb]"}
                    onClick={() => {
                      setSelectedId(order.id);
                      setMessage("");
                    }}
                  >
                    <td className="px-5 py-3 font-medium text-[#172033]">
                      {order.orderNumber}
                      <span className="mt-0.5 block text-xs font-normal text-neutral-500">
                        {dateLabel(order.createdAt)}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      {order.customer.fullName || order.address.fullName}
                      <span className="mt-0.5 block text-xs text-neutral-500">
                        {order.items.length} {order.items.length === 1 ? "item" : "items"}
                      </span>
                    </td>
                    <td className="px-5 py-3">{formatPrice(order.total)}</td>
                    <td className="px-5 py-3">
                      <Badge value={order.paymentStatus} tone={paymentTone} />
                    </td>
                    <td className="px-5 py-3">
                      <Badge value={order.orderStatus} tone={statusTone} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

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
    <section className="rounded-2xl border border-[#d5e2ea] bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-[0.16em] text-[#1a6d78] uppercase">Order</p>
          <h2 className="mt-1 text-lg font-semibold text-[#172033]">{order.orderNumber}</h2>
          <p className="mt-1 text-sm text-neutral-500">{order.paymentMethod}</p>
        </div>
        <div className="flex gap-2">
          <Badge value={order.orderStatus} tone={statusTone} />
          <Badge value={order.paymentStatus} tone={paymentTone} />
        </div>
      </div>

      <ul className="mt-4 divide-y divide-neutral-100 rounded-xl bg-[#f4f8fb] px-4">
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

      <div className="mt-4 rounded-xl border border-[#d5e2ea] px-4 py-3 text-sm">
        <p className="font-medium text-[#172033]">{order.address.fullName}</p>
        <p className="mt-1 text-neutral-600">
          {order.address.line}, {order.address.city}, {order.address.state} {order.address.pin}
        </p>
        <p className="mt-1 text-neutral-500">{order.customer.email || order.address.phone}</p>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-[#172033]">
          Order status
          <select
            className="mt-2 h-11 w-full rounded-lg border border-[#d5e2ea] bg-white px-3 text-sm capitalize"
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
            className="mt-2 h-11 w-full rounded-lg border border-[#d5e2ea] bg-white px-3 text-sm capitalize"
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
            className="h-11 rounded-lg border border-[#d5e2ea] px-3 text-sm"
            value={courier}
            onChange={(event) => setCourier(event.target.value)}
            placeholder="Courier"
            maxLength={100}
            disabled={pending}
          />
          <input
            className="h-11 rounded-lg border border-[#d5e2ea] px-3 text-sm"
            value={trackingNumber}
            onChange={(event) => setTrackingNumber(event.target.value)}
            placeholder="Tracking number"
            maxLength={100}
            disabled={pending}
          />
          <button
            type="submit"
            disabled={pending}
            className="h-11 rounded-lg bg-[#172033] px-4 text-sm font-semibold text-[#b7f3ea] hover:bg-[#24344a] disabled:opacity-60"
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
          className="min-h-20 w-full rounded-lg border border-[#d5e2ea] px-3 py-2 text-sm"
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          placeholder="Reason for the refund"
          disabled={pending || order.refund.status === "initiated"}
        />
        <button
          type="submit"
          disabled={pending || order.refund.status === "initiated" || order.paymentStatus !== "paid"}
          className="h-11 w-full rounded-lg border border-[#172033] text-sm font-semibold text-[#172033] hover:bg-[#172033] hover:text-[#b7f3ea] disabled:opacity-60"
        >
          {order.refund.status === "initiated" ? "Refund initiated" : "Initiate refund"}
        </button>
      </form>

      {message ? <p className="mt-4 text-sm text-[#145860]">{message}</p> : null}
    </section>
  );
}

function Badge({ value, tone }: { value: string; tone: Record<string, string> }) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${tone[value] ?? tone.pending}`}>
      {value}
    </span>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[#d5e2ea] bg-white p-5">
      <p className="text-sm text-neutral-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-[#172033]">{value}</p>
    </div>
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
