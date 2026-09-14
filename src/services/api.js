import axios from 'axios'

// Single Axios instance used by the whole app.
// The base URL comes from the VITE_API_URL environment variable (.env / .env.example).
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
})

const unwrap = (response) => response.data

// Doctors
export function getDoctors() {
  return api.get('/doctors').then(unwrap)
}

export function getDoctorById(id) {
  return api.get(`/doctors/${id}`).then(unwrap)
}

// Appointments
export function getAppointments() {
  return api.get('/appointments').then(unwrap)
}

export function getAppointmentById(id) {
  return api.get(`/appointments/${id}`).then(unwrap)
}

export function createAppointment(appointment) {
  return api.post('/appointments', appointment).then(unwrap)
}

export function updateAppointment(id, appointment) {
  return api.put(`/appointments/${id}`, appointment).then(unwrap)
}

export function deleteAppointment(id) {
  return api.delete(`/appointments/${id}`).then(unwrap)
}
