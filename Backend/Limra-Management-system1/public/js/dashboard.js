// ------------------- Dashboard Class -------------------
class Dashboard {
    constructor() {
        this.bookings = [
            {
                id: 1,
                guestEmail: "john@example.com",
                guestPhone: "+91 9876543210",
                checkinDate: "2025-10-04",
                checkoutDate: "2025-10-05",
                totalAmount: 120,
                status: "Confirmed"
            },
            {
                id: 2,
                guestEmail: "maria@example.com",
                guestPhone: "+91 9123456789",
                checkinDate: "2025-10-10",
                checkoutDate: "2025-10-12",
                totalAmount: 240,
                status: "Pending"
            }
        ];
    }

    // ------------------- Render Bookings Table -------------------
    renderBookingsTable() {
        const tableBody = document.getElementById("bookings-table-body");
        if (!tableBody) return;

        tableBody.innerHTML = "";
        this.bookings.forEach(b => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td class="p-2 border">${b.id}</td>
                <td class="p-2 border">${b.guestEmail}</td>
                <td class="p-2 border">${b.guestPhone}</td>
                <td class="p-2 border">${b.checkinDate}</td>
                <td class="p-2 border">${b.checkoutDate}</td>
                <td class="p-2 border">$${b.totalAmount}</td>
                <td class="p-2 border">
                    <span class="status ${b.status.toLowerCase()}">${b.status}</span>
                </td>
                <td class="p-2 border">
                    <button onclick="dashboard.updateBookingStatus(${b.id}, 'Confirmed')" class="px-2 py-1 bg-green-500 text-white rounded">Confirm</button>
                    <button onclick="dashboard.updateBookingStatus(${b.id}, 'Cancelled')" class="px-2 py-1 bg-red-500 text-white rounded">Cancel</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    // ------------------- Update Booking Status -------------------
    updateBookingStatus(id, status) {
        const booking = this.bookings.find(b => b.id === id);
        if (booking) {
            booking.status = status;
            this.renderBookingsTable();
        }
    }

    // ------------------- Currency Calculator -------------------
    convertToINR() {
        const usdInput = document.getElementById("usd-input");
        const result = document.getElementById("inr-result");
        if (!usdInput || !result) return;

        const usd = parseFloat(usdInput.value);
        if (isNaN(usd)) {
            result.innerText = "Please enter a valid amount";
            return;
        }

        const rate = 83; // Example USD → INR conversion rate
        const inr = usd * rate;
        result.innerText = `${usd} USD = ₹${inr.toFixed(2)} INR`;
    }

    // ------------------- Download Bookings CSV -------------------
    downloadBookingsCSV() {
        const data = this.bookings;
        const csv = [
            ["ID","Email","Phone","Checkin","Checkout","Amount","Status"],
            ...data.map(b => [b.id, b.guestEmail, b.guestPhone, b.checkinDate, b.checkoutDate, b.totalAmount, b.status])
        ].map(e => e.join(",")).join("\n");

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "bookings.csv";
        a.click();
        URL.revokeObjectURL(url);
    }
}

// ------------------- Initialize Dashboard -------------------
const dashboard = new Dashboard();
document.addEventListener("DOMContentLoaded", () => {
    dashboard.renderBookingsTable();
});
