const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Initialize data files if they don't exist
const initializeDataFiles = () => {
  const files = {
    'rooms.json': [
      {
        id: 1,
        name: "Deluxe Suite",
        description: "Spacious suite with city view, king bed, and luxury amenities",
        price: 299,
        image: "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800",
        amenities: ["Free WiFi", "Room Service", "Air Conditioning", "Minibar"],
        available: true
      },
      {
        id: 2,
        name: "Ocean View Room",
        description: "Beautiful ocean view with queen bed and private balcony",
        price: 199,
        image: "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800",
        amenities: ["Free WiFi", "Ocean View", "Balcony", "Coffee Maker"],
        available: true
      },
      {
        id: 3,
        name: "Standard Room",
        description: "Comfortable room with modern amenities and cozy atmosphere",
        price: 149,
        image: "https://images.pexels.com/photos/271619/pexels-photo-271619.jpeg?auto=compress&cs=tinysrgb&w=800",
        amenities: ["Free WiFi", "Air Conditioning", "TV", "Private Bathroom"],
        available: true
      },
      {
        id: 4,
        name: "Presidential Suite",
        description: "Ultimate luxury with panoramic views, separate living area",
        price: 599,
        image: "https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg?auto=compress&cs=tinysrgb&w=800",
        amenities: ["Free WiFi", "Butler Service", "Jacuzzi", "Dining Area"],
        available: true
      }
    ],
    'bookings.json': [],
    'services.json': [
      {
        id: 1,
        name: "Room Service",
        description: "24/7 in-room dining service",
        price: 25,
        category: "food"
      },
      {
        id: 2,
        name: "Spa Treatment",
        description: "Relaxing full-body massage",
        price: 120,
        category: "spa"
      },
      {
        id: 3,
        name: "Laundry Service",
        description: "Professional laundry and dry cleaning",
        price: 30,
        category: "laundry"
      }
    ]
  };

  Object.keys(files).forEach(filename => {
    const filePath = path.join(dataDir, filename);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(files[filename], null, 2));
    }
  });
};

initializeDataFiles();

// Helper functions
const readDataFile = (filename) => {
  try {
    const data = fs.readFileSync(path.join(dataDir, filename), 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return [];
  }
};

const writeDataFile = (filename, data) => {
  try {
    fs.writeFileSync(path.join(dataDir, filename), JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    return false;
  }
};

// Routes

// Get all rooms
app.get('/api/rooms', (req, res) => {
  const rooms = readDataFile('rooms.json');
  res.json(rooms);
});

// Get all services
app.get('/api/services', (req, res) => {
  const services = readDataFile('services.json');
  res.json(services);
});

// Create new booking
app.post('/api/bookings', (req, res) => {
  const bookings = readDataFile('bookings.json');
  const newBooking = {
    id: Date.now(),
    ...req.body,
    status: 'confirmed',
    createdAt: new Date().toISOString()
  };
  
  bookings.push(newBooking);
  
  if (writeDataFile('bookings.json', bookings)) {
    res.status(201).json({ success: true, booking: newBooking });
  } else {
    res.status(500).json({ success: false, message: 'Failed to save booking' });
  }
});

// Get all bookings (for admin dashboard)
app.get('/api/bookings', (req, res) => {
  const bookings = readDataFile('bookings.json');
  res.json(bookings);
});

// Update booking status
app.put('/api/bookings/:id', (req, res) => {
  const bookings = readDataFile('bookings.json');
  const bookingId = parseInt(req.params.id);
  const bookingIndex = bookings.findIndex(b => b.id === bookingId);
  
  if (bookingIndex !== -1) {
    bookings[bookingIndex] = { ...bookings[bookingIndex], ...req.body };
    
    if (writeDataFile('bookings.json', bookings)) {
      res.json({ success: true, booking: bookings[bookingIndex] });
    } else {
      res.status(500).json({ success: false, message: 'Failed to update booking' });
    }
  } else {
    res.status(404).json({ success: false, message: 'Booking not found' });
  }
});

// Get dashboard stats
app.get('/api/dashboard', (req, res) => {
  const bookings = readDataFile('bookings.json');
  const rooms = readDataFile('rooms.json');
  
  const today = new Date().toISOString().split('T')[0];
  const todayBookings = bookings.filter(b => b.createdAt.startsWith(today));
  const todayRevenue = todayBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  
  const stats = {
    totalBookings: bookings.length,
    roomsAvailable: rooms.filter(r => r.available).length,
    revenueToday: todayRevenue,
    recentBookings: bookings.slice(-5).reverse()
  };
  
  res.json(stats);
});

// Start server
app.listen(PORT, () => {
  console.log(`LIMRA Hotel Management Server running on port ${PORT}`);
});