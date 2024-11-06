// Room class
class Room {
    constructor(number, capacity) {
        this.number = number;
        this.capacity = capacity;
        this.reservations = [];
    }

    isAvailable(startTime, duration) {
        const endTime = this.calculateEndTime(startTime, duration);
        return !this.reservations.some(reservation => {
            const resEndTime = this.calculateEndTime(reservation.startTime, reservation.duration);
            return startTime < resEndTime && reservation.startTime < endTime;
        });
    }

    addReservation(reservation) {
        this.reservations.push(reservation);
    }

    calculateEndTime(startTime, duration) {
        const [hours, minutes] = startTime.split(':');
        const end = new Date();
        end.setHours(parseInt(hours) + duration, parseInt(minutes));
        return `${end.getHours()}:${end.getMinutes()}`;
    }
}

// Reservation class
class Reservation {
    constructor(name, roomNumber, date, startTime, duration) {
        this.name = name;
        this.roomNumber = roomNumber;
        this.date = date;
        this.startTime = startTime;
        this.duration = duration;
    }
}

// Data storage
const rooms = [
    new Room(101, 30),
    new Room(102, 25),
    new Room(103, 20)
];
const reservations = [];

// Display rooms
function displayRooms() {
    const roomsTable = document.getElementById('roomsTable').getElementsByTagName('tbody')[0];
    roomsTable.innerHTML = '';
    rooms.forEach(room => {
        const row = roomsTable.insertRow();
        row.insertCell(0).innerText = room.number;
        row.insertCell(1).innerText = room.capacity;
        row.insertCell(2).innerText = room.reservations.length ? 'Reserved' : 'Available';
    });
}

// Display reservations
function displayReservations() {
    const reservationsTable = document.getElementById('reservationsTable').getElementsByTagName('tbody')[0];
    reservationsTable.innerHTML = '';
    reservations.forEach((reservation, index) => {
        const row = reservationsTable.insertRow();
        row.insertCell(0).innerText = reservation.name;
        row.insertCell(1).innerText = reservation.roomNumber;
        row.insertCell(2).innerText = reservation.date;
        row.insertCell(3).innerText = reservation.startTime;
        row.insertCell(4).innerText = reservation.duration;
        const cancelBtn = document.createElement('button');
        cancelBtn.innerText = 'Cancel';
        cancelBtn.onclick = () => cancelReservation(index);
        row.insertCell(5).appendChild(cancelBtn);
    });
}

// Reserve room
document.getElementById('reservationForm').onsubmit = function(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const roomNumber = parseInt(document.getElementById('roomNumber').value);
    const date = document.getElementById('date').value;
    const startTime = document.getElementById('startTime').value;
    const duration = parseInt(document.getElementById('duration').value);

    const room = rooms.find(r => r.number === roomNumber);
    if (room && room.isAvailable(startTime, duration)) {
        const reservation = new Reservation(name, roomNumber, date, startTime, duration);
        room.addReservation(reservation);
        reservations.push(reservation);
        displayRooms();
        displayReservations();
    } else {
        alert('Room not available for the selected time');
    }
};

// Cancel reservation
function cancelReservation(index) {
    const reservation = reservations.splice(index, 1)[0];
    const room = rooms.find(r => r.number === reservation.roomNumber);
    if (room) {
        room.reservations = room.reservations.filter(r => r !== reservation);
    }
    displayRooms();
    displayReservations();
}

// Initialize
displayRooms();
displayReservations();
