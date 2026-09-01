import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "./Brand";

const API_BASE_URL = import.meta.env.VITE_USER_SERVICE_URL || "http://localhost:8081";

const emptyAddress = {
    streetNumber: "",
    streetName: "",
    suburb: "",
    state: "",
    postcode: "",
};

export default function DriverRegistration() {
    const navigate = useNavigate();

    const [address, setAddress] = useState(emptyAddress);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [licenceNumber, setLicenceNumber] = useState("");
    const [vehiclePlate, setVehiclePlate] = useState("");

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const setAddressField = (field) => (e) =>
        setAddress((prev) => ({ ...prev, [field]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);

        try {
            const token = localStorage.getItem("hermes_token");
            const res = await fetch(`${API_BASE_URL}/users/me/driver-profile`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ address, phoneNumber, licenceNumber, vehiclePlate }),
            });

            if (!res.ok) {
                const message = await res.text();
                throw new Error(message || `Request failed with status ${res.status}`);
            }

            navigate("/dashboard");
        } catch (err) {
            setError(err.message || "Something went wrong registering as a driver.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col">
            <PageHeader backTo="/dashboard" />
            <div className="page-shell">
                <h1 className="text-3xl mb-1">Register as a driver</h1>
                <p className="mb-6" style={{ color: 'var(--ink-soft)' }}>
                    Add your licence and vehicle details to start accepting deliveries.
                </p>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <fieldset className="space-y-3">
                        <legend className="text-sm font-semibold mb-1" style={{ color: 'var(--ink)' }}>Address</legend>
                        <div className="grid grid-cols-2 gap-3">
                            <input
                                className="input"
                                placeholder="Street number"
                                value={address.streetNumber}
                                onChange={setAddressField("streetNumber")}
                                required
                            />
                            <input
                                className="input"
                                placeholder="Street name"
                                value={address.streetName}
                                onChange={setAddressField("streetName")}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            <input
                                className="input"
                                placeholder="Suburb"
                                value={address.suburb}
                                onChange={setAddressField("suburb")}
                                required
                            />
                            <input
                                className="input"
                                placeholder="State"
                                value={address.state}
                                onChange={setAddressField("state")}
                                required
                            />
                            <input
                                className="input"
                                placeholder="Postcode"
                                value={address.postcode}
                                onChange={setAddressField("postcode")}
                                required
                            />
                        </div>
                    </fieldset>

                    <fieldset className="space-y-3">
                        <legend className="text-sm font-semibold mb-1" style={{ color: 'var(--ink)' }}>Contact &amp; licence</legend>
                        <input
                            className="input"
                            placeholder="Phone number"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                        />
                        <input
                            className="input"
                            placeholder="Licence number"
                            value={licenceNumber}
                            onChange={(e) => setLicenceNumber(e.target.value)}
                            required
                        />
                        <input
                            className="input"
                            placeholder="Vehicle plate"
                            value={vehiclePlate}
                            onChange={(e) => setVehiclePlate(e.target.value)}
                            required
                        />
                    </fieldset>

                    {error && <div className="banner banner-error">{error}</div>}

                    <button type="submit" disabled={submitting} className="btn btn-primary w-full">
                        {submitting ? "Registering..." : "Register as a driver"}
                    </button>
                </form>
            </div>
        </div>
    );
}
