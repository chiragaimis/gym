export type RecordItem = { id: string; [key: string]: any }

export const today = () => new Date().toISOString().slice(0, 10)
export const shiftDate = (days: number) => {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

export const plans: RecordItem[] = [
  { id: 'PLN-01', name: 'Monthly Plan', description: 'Flexible full gym access', duration: 1, price: 1500, discount: 0, finalPrice: 1500, benefits: 'Gym access, Locker', access: 'Standard', status: 'Active' },
  { id: 'PLN-02', name: 'Quarterly Plan', description: 'Best for new members', duration: 3, price: 4500, discount: 500, finalPrice: 4000, benefits: 'Gym access, 1 assessment', access: 'Standard', status: 'Active' },
  { id: 'PLN-03', name: 'Half-Yearly Plan', description: 'Build a lasting routine', duration: 6, price: 8000, discount: 1000, finalPrice: 7000, benefits: 'Gym access, Diet consultation', access: 'Standard', status: 'Active' },
  { id: 'PLN-04', name: 'Yearly Plan', description: 'Our best-value membership', duration: 12, price: 15000, discount: 3000, finalPrice: 12000, benefits: 'Gym access, Classes, Locker', access: 'All access', status: 'Active' },
  { id: 'PLN-05', name: 'Premium Plan', description: 'Complete fitness experience', duration: 12, price: 20000, discount: 2000, finalPrice: 18000, benefits: 'All access, Classes, Sauna, Nutrition', access: 'Premium', status: 'Active' },
  { id: 'PLN-06', name: 'Personal Training', description: 'One-on-one coaching package', duration: 1, price: 5000, discount: 0, finalPrice: 5000, benefits: '12 PT sessions, Assessment', access: 'Personal training', status: 'Active' },
]

const names = ['Aarav Shah', 'Diya Patel', 'Rohan Mehta', 'Ananya Desai', 'Vivaan Joshi', 'Isha Trivedi', 'Arjun Rao', 'Kavya Nair', 'Reyansh Kapoor', 'Meera Iyer', 'Aditya Verma', 'Saanvi Singh', 'Krish Malhotra', 'Nisha Bhat', 'Dev Patel', 'Riya Soni', 'Kabir Khan', 'Myra Dave', 'Yash Thakkar', 'Tara Menon', 'Neel Purohit', 'Aditi Mishra', 'Parth Gandhi', 'Zoya Sheikh', 'Dhruv Bhatt']
const trainerNames = ['Vikram Solanki', 'Neha Sharma', 'Kunal Das', 'Priya Kulkarni', 'Manav Sethi']

export const trainers: RecordItem[] = trainerNames.map((name, i) => ({
  id: `TRN-${String(i + 1).padStart(3, '0')}`, name, mobile: `98${String(70001000 + i * 113)}`, email: `${name.toLowerCase().replace(' ', '.')}@fitzone.in`,
  specialization: ['Strength & Conditioning', 'Yoga & Mobility', 'Weight Management', 'Functional Fitness', 'Bodybuilding'][i],
  joiningDate: shiftDate(-500 + i * 70), salary: 28000 + i * 3500, status: i === 4 ? 'On Leave' : 'Active',
}))

export const members: RecordItem[] = names.map((name, i) => {
  const plan = plans[i % plans.length]
  const endOffset = [-18, -3, 4, 8, 14, 32, 65, 120][i % 8]
  const status = endOffset < 0 ? 'Expired' : i % 11 === 0 ? 'Pending' : i % 13 === 0 ? 'Inactive' : 'Active'
  const total = plan.finalPrice
  const pending = i % 5 === 0 ? Math.round(total * .3) : 0
  return {
    id: `MEM-${String(1001 + i)}`, name, mobile: `9${String(870001000 + i * 137)}`, email: `${name.toLowerCase().replace(' ', '.')}@example.com`,
    gender: i % 3 === 0 ? 'Female' : 'Male', dob: `19${85 + (i % 14)}-${String((i % 12) + 1).padStart(2, '0')}-12`,
    address: `${18 + i}, ${['Alkapuri', 'Gotri', 'Manjalpur', 'Akota', 'Karelibaug'][i % 5]}, Vadodara`,
    joiningDate: shiftDate(-(30 + i * 17)), emergency: `9${String(760008000 + i * 97)}`, trainer: trainerNames[i % 5],
    plan: plan.name, startDate: shiftDate(endOffset - plan.duration * 30), endDate: shiftDate(endOffset), status,
    totalPaid: total - pending, pending, notes: i % 4 === 0 ? 'Prefers evening sessions' : '',
  }
})

export const payments: RecordItem[] = members.slice(0, 15).map((m, i) => {
  const amount = plans.find(p => p.name === m.plan)?.finalPrice || 1500
  const paid = i % 4 === 0 ? Math.round(amount * .7) : amount
  return {
    id: `PAY-${String(2401 + i)}`, memberId: m.id, member: m.name, membershipId: `MS-${m.id.slice(4)}`,
    date: shiftDate(-(i * 5)), total: amount, discount: 0, paid, pending: amount - paid,
    method: ['UPI', 'Cash', 'Credit Card', 'Bank Transfer'][i % 4], status: paid < amount ? 'Partially Paid' : 'Paid',
    reference: `TXN${938100 + i * 71}`, notes: '',
  }
})

const leadNames = ['Rahul Parmar', 'Sneha Chauhan', 'Mohit Yadav', 'Pooja Raval', 'Nitin Goel', 'Simran Kaur', 'Harsh Vora', 'Jinal Shah', 'Om Prakash', 'Mahi Patel']
export const leads: RecordItem[] = leadNames.map((name, i) => ({
  id: `LEAD-${301 + i}`, name, mobile: `9${String(820005000 + i * 163)}`, email: `${name.toLowerCase().replace(' ', '.')}@mail.com`,
  gender: i % 2 ? 'Female' : 'Male', age: 22 + i, plan: plans[i % 6].name,
  source: ['Walk-in', 'Instagram', 'Website', 'Referral', 'Google Ads'][i % 5], enquiryDate: shiftDate(-i * 3),
  followUpDate: shiftDate((i % 6) - 2), staff: trainerNames[i % 5],
  status: ['New', 'Contacted', 'Interested', 'Trial Scheduled', 'Converted', 'Not Interested', 'Lost'][i % 7],
  notes: 'Asked for membership details', history: [{ date: shiftDate(-i), note: 'Initial enquiry recorded' }],
}))

export const expenses: RecordItem[] = [
  ['Rent', 'Monthly facility rent', 85000, 'Sapphire Properties'],
  ['Electricity', 'Electricity bill', 18500, 'MGVCL'],
  ['Staff Salaries', 'Trainer salaries', 142000, 'Staff payroll'],
  ['Equipment Purchases', 'Dumbbell set', 32000, 'Pro Fitness'],
  ['Equipment Maintenance', 'Treadmill service', 8500, 'GymTech'],
  ['Marketing Expenses', 'Social media campaign', 12000, 'Pixel Media'],
  ['Cleaning Expenses', 'Cleaning supplies', 4800, 'CleanMart'],
  ['Other Expenses', 'Water dispenser service', 2200, 'Aqua Care'],
].map((e, i) => ({ id: `EXP-${501 + i}`, category: e[0], description: e[1], amount: e[2], date: shiftDate(-i * 7), method: i % 2 ? 'UPI' : 'Bank Transfer', vendor: e[3], receipt: '', notes: '' }))

export const attendance: RecordItem[] = Array.from({ length: 30 }, (_, i) => ({
  id: `ATT-${701 + i}`, memberId: members[i % 18].id, member: members[i % 18].name,
  date: shiftDate(-Math.floor(i / 4)), checkIn: `${String(6 + (i % 12)).padStart(2, '0')}:${i % 2 ? '30' : '05'}`,
  checkOut: i % 7 === 0 ? '' : `${String(7 + (i % 12)).padStart(2, '0')}:${i % 2 ? '35' : '15'}`,
}))

export const renewals: RecordItem[] = members.slice(3, 11).map((m, i) => ({
  id: `REN-${801 + i}`, memberId: m.id, member: m.name, oldPlan: m.plan, newPlan: m.plan,
  startDate: shiftDate(-(120 + i * 11)), endDate: shiftDate(-(30 + i * 7)), amount: plans[i % 6].finalPrice,
  discount: i % 3 === 0 ? 500 : 0, status: 'Completed',
}))

export const initialData = {
  members, plans, payments, leads, trainers, expenses, attendance, renewals,
  income: [
    { id: 'INC-01', category: 'Personal Training Income', description: 'PT package', amount: 5000, date: shiftDate(-4), method: 'UPI', reference: 'PT-203' },
    { id: 'INC-02', category: 'Other Income', description: 'Protein bar sales', amount: 2800, date: shiftDate(-10), method: 'Cash', reference: 'POS-82' },
  ] as RecordItem[],
  notifications: [
    { id: 'NOT-1', title: 'Membership expiring soon', message: 'Ananya Desai expires in 4 days', type: 'warning', read: false, date: today() },
    { id: 'NOT-2', title: 'Payment received', message: '₹4,000 received from Diya Patel', type: 'success', read: false, date: today() },
    { id: 'NOT-3', title: 'New lead assigned', message: 'Rahul Parmar was assigned to Vikram', type: 'info', read: false, date: shiftDate(-1) },
    { id: 'NOT-4', title: 'Pending payment', message: 'Follow up on outstanding member dues', type: 'danger', read: true, date: shiftDate(-2) },
  ] as RecordItem[],
  settings: { gymName: 'FitZone Fitness Club', location: 'Vadodara, Gujarat, India', phone: '+91 265 410 2200', email: 'hello@fitzone.in', currency: 'INR (₹)', gst: 18, expiryReminders: true, paymentReminders: true },
}
