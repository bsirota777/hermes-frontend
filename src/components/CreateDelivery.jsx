import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "./Brand";

const API_BASE_URL = import.meta.env.VITE_DELIVERY_SERVICE_URL || "http://localhost:8084";

const emptyAddress = {
    streetNumber: "",
    streetName: "",
    suburb: "",
    state: "",
    postcode: "",
};

const emptyParcel = () => ({
    key: crypto.randomUUID(),
    description: "",
    lengthCm: "",
    widthCm: "",
    heightCm: "",
    weightKg: "",
    declaredValue: "",
    insured: false,
    insuredValue: "",
});

function AddressFields({ label, value, onChange }) {
    const set = (field) => (e) => onChange({ ...value, [field]: e.target.value });

    return (
        <fieldset className="space-y-3">
            <legend className="text-sm font-semibold mb-1" style={{ color: 'var(--ink)' }}>{label}</legend>
            <div className="grid grid-cols-2 gap-3">
                <input
                    className="input col-span-1"
                    placeholder="Street number"
                    value={value.streetNumber}
                    onChange={set("streetNumber")}
                    required
                />
                <input
                    className="input col-span-1"
                    placeholder="Street name"
                    value={value.streetName}
                    onChange={set("streetName")}
                    required
                />
            </div>
            <div className="grid grid-cols-3 gap-3">
                <input
                    className="input"
                    placeholder="Suburb"
                    value={value.suburb}
                    onChange={set("suburb")}
                    required
                />
                <input
                    className="input"
                    placeholder="State"
                    value={value.state}
                    onChange={set("state")}
                    required
                />
                <input
                    className="input"
                    placeholder="Postcode"
                    value={value.postcode}
                    onChange={set("postcode")}
                    required
                />
            </div>
        </fieldset>
    );
}

function ParcelRow({ parcel, onChange, onRemove, removable }) {
    const set = (field) => (e) => {
        const raw = e.target.value;
        const val = e.target.type === "checkbox" ? e.target.checked : raw;
        onChange({ ...parcel, [field]: val });
    };

    return (
        <div className="card p-4 space-y-3 relative">
            {removable && (
                <button
                    type="button"
                    onClick={onRemove}
                    className="absolute top-3 right-3 text-sm font-medium"
                    style={{ color: 'var(--ink-faint)' }}
                >
                    Remove
                </button>
            )}
            <input
                className="input"
                placeholder="Description"
                value={parcel.description}
                onChange={set("description")}
                required
            />
            <div className="grid grid-cols-4 gap-3">
                <input className="input" type="number" step="0.01" min="0.01" placeholder="Length (cm)" value={parcel.lengthCm} onChange={set("lengthCm")} required />
                <input className="input" type="number" step="0.01" min="0.01" placeholder="Width (cm)" value={parcel.widthCm} onChange={set("widthCm")} required />
                <input className="input" type="number" step="0.01" min="0.01" placeholder="Height (cm)" value={parcel.heightCm} onChange={set("heightCm")} required />
                <input className="input" type="number" step="0.01" min="0.01" max="10" placeholder="Weight (kg)" value={parcel.weightKg} onChange={set("weightKg")} required />
            </div>
            <div className="grid grid-cols-2 gap-3 items-center">
                <input className="input" type="number" step="0.01" min="0" placeholder="Declared value ($)" value={parcel.declaredValue} onChange={set("declaredValue")} required />
                <label className="flex items-center gap-2 text-sm" style={{ color: 'var(--ink-soft)' }}>
                    <input type="checkbox" checked={parcel.insured} onChange={set("insured")} style={{ accentColor: 'var(--accent)' }} />
                    Insure this parcel
                </label>
            </div>
            {parcel.insured && (
                <input
                    className="input"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Insured value ($)"
                    value={parcel.insuredValue}
                    onChange={set("insuredValue")}
                    required
                />
            )}
        </div>
    );
}

export default function CreateDelivery() {
    const navigate = useNavigate();

    const [recipientEmail, setRecipientEmail] = useState("");
    const [senderPhoneNumber, setSenderPhoneNumber] = useState("");
    const [recipientPhoneNumber, setRecipientPhoneNumber] = useState("");
    const [pickUpAddress, setPickUpAddress] = useState(emptyAddress);
    const [dropOffAddress, setDropOffAddress] = useState(emptyAddress);
    const [parcels, setParcels] = useState([emptyParcel()]);

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const updateParcel = (key, updated) =>
        setParcels((prev) => prev.map((p) => (p.key === key ? updated : p)));

    const removeParcel = (key) =>
        setParcels((prev) => prev.filter((p) => p.key !== key));

    const addParcel = () => setParcels((prev) => [...prev, emptyParcel()]);

    const toNumber = (v) => (v === "" ? null : Number(v));

    const buildPayload = () => ({
        recipientEmail,
        senderPhoneNumber,
        recipientPhoneNumber,
        pickUpAddress,
        dropOffAddress,
        parcels: parcels.map((p) => ({
            description: p.description,
            lengthCm: toNumber(p.lengthCm),
            widthCm: toNumber(p.widthCm),
            heightCm: toNumber(p.heightCm),
            weightKg: toNumber(p.weightKg),
            declaredValue: toNumber(p.declaredValue),
            insured: p.insured,
            insuredValue: p.insured ? toNumber(p.insuredValue) : 0,
        })),
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);

        try {
            const token = localStorage.getItem("hermes_token");
            const res = await fetch(`${API_BASE_URL}/deliveries`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(buildPayload()),
            });

            if (!res.ok) {
                const message = await res.text();
                throw new Error(message || `Request failed with status ${res.status}`);
            }

            const created = await res.json();
            navigate(`/dashboard`, { state: { createdDeliveryId: created.id } });
        } catch (err) {
            setError(err.message || "Something went wrong creating the delivery.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col">
            <PageHeader backTo="/dashboard" />
            <div className="page-shell">
                <h1 className="text-3xl mb-1">Create a delivery</h1>
                <p className="mb-6" style={{ color: 'var(--ink-soft)' }}>
                    Enter the pickup and dropoff details, then add each parcel you're sending.
                </p>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <fieldset className="space-y-3">
                        <legend className="text-sm font-semibold mb-1" style={{ color: 'var(--ink)' }}>Recipient</legend>
                        <input
                            className="input"
                            type="email"
                            placeholder="Recipient email"
                            value={recipientEmail}
                            onChange={(e) => setRecipientEmail(e.target.value)}
                            required
                        />
                        <div className="grid grid-cols-2 gap-3">
                            <input
                                className="input"
                                placeholder="Your phone number"
                                value={senderPhoneNumber}
                                onChange={(e) => setSenderPhoneNumber(e.target.value)}
                                required
                            />
                            <input
                                className="input"
                                placeholder="Recipient phone number"
                                value={recipientPhoneNumber}
                                onChange={(e) => setRecipientPhoneNumber(e.target.value)}
                                required
                            />
                        </div>
                    </fieldset>

                    <AddressFields label="Pickup address" value={pickUpAddress} onChange={setPickUpAddress} />
                    <AddressFields label="Dropoff address" value={dropOffAddress} onChange={setDropOffAddress} />

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <legend className="text-sm font-semibold" style={{ color: 'var(--ink)' }}>Parcels</legend>
                            <button
                                type="button"
                                onClick={addParcel}
                                className="text-sm font-medium"
                                style={{ color: 'var(--accent)' }}
                            >
                                + Add another parcel
                            </button>
                        </div>
                        {parcels.map((parcel) => (
                            <ParcelRow
                                key={parcel.key}
                                parcel={parcel}
                                onChange={(updated) => updateParcel(parcel.key, updated)}
                                onRemove={() => removeParcel(parcel.key)}
                                removable={parcels.length > 1}
                            />
                        ))}
                    </div>

                    {error && <div className="banner banner-error">{error}</div>}

                    <button type="submit" disabled={submitting} className="btn btn-primary w-full">
                        {submitting ? "Creating delivery..." : "Create delivery"}
                    </button>
                </form>
            </div>
        </div>
    );
}
