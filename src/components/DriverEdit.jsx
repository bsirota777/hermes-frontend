import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const emptyAddress = {
    streetNumber: "",
    streetName: "",
    suburb: "",
    state: "",
    postcode: "",
};

export default function DriverEdit() {
    const navigate = useNavigate();

    const [address, setAddress] = useState(emptyAddress);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [licenceNumber, setLicenceNumber] = useState("");
    const [vehiclePlate, setVehiclePlate] = useState("");

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("hermes_token");

        fetch(`${API_BASE_URL}/users/me/driver-profile`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(async (res) => {
                if (!res.ok) {
                    const message = await res.text();
                    throw new Error(message || `Request failed with status ${res.status}`);
                }
                return res.json();
            })
            .then((data) => {
                setAddress(data.address ?? emptyAddress);
                setPhoneNumber(data.phoneNumber ?? "");
                setLicenceNumber(data.licenceNumber ?? "");
                setVehiclePlate(data.vehiclePlate ?? "");
            })
            .catch((err) => setError(err.message || "Couldn't load your driver profile."))
            .finally(() => setLoading(false));
    }, []);

    const setAddressField = (field) => (e) =>
        setAddress((prev) => ({ ...prev, [field]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);

        try {
            const token = localStorage.getItem("hermes_token");
            const res = await fetch(`${API_BASE_URL}/users/me/driver-profile`, {
                method: "PATCH",
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
            setError(err.message || "Something went wrong updating your driver details.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="max-w-2xl mx-auto py-8 px-4 text-slate-500">Loading...</div>;
    }

    return (
        <div className="max-w-2xl mx-auto py-8 px-4">
            <Link
                to="/dashboard"
                className="inline-block text-sm font-medium text-slate-500 hover:text-slate-800 mb-4"
            >
                &larr; Back to dashboard
            </Link>

            <h1 className="text-2xl font-bold text-slate-900 mb-1">Driver details</h1>
            <p className="text-slate-500 mb-6">
                Update your address, licence, and vehicle details.
            </p>

            <form onSubmit={handleSubmit} className="space-y-8">
                <fieldset className="space-y-3">
                    <legend className="text-sm font-semibold text-slate-700">Address</legend>
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
                    <legend className="text-sm font-semibold text-slate-700">Contact & licence</legend>
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

                {error && (
                    <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-slate-900 text-white rounded-lg py-2.5 font-medium hover:bg-slate-800 disabled:opacity-50"
                >
                    {submitting ? "Saving..." : "Save changes"}
                </button>
            </form>
        </div>
    );
}
