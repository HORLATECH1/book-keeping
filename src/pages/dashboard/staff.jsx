import { useState } from "react";
import { FiRefreshCw, FiChevronDown, FiX, FiSearch, FiEdit2, FiTrash2 } from "react-icons/fi";

const initialEmployees = [
  {
    id: 1,
    initials: "AO",
    color: "bg-blue-500",
    name: "Adaeze Obi",
    email: "adaeze@acme.ng",
    position: "CEO / Owner",
    department: "Executive",
    salary: "—",
    joined: "Jan 2021",
  },
  {
    id: 2,
    initials: "EN",
    color: "bg-orange-500",
    name: "Emeka Nwosu",
    email: "emeka@acme.ng",
    position: "Senior Accountant",
    department: "Finance",
    salary: "₦450,000",
    joined: "Mar 2022",
  },
  {
    id: 3,
    initials: "FB",
    color: "bg-emerald-500",
    name: "Fatima Bello",
    email: "fatima@acme.ng",
    position: "HR Manager",
    department: "HR",
    salary: "₦380,000",
    joined: "Jul 2022",
  },
  {
    id: 4,
    initials: "CO",
    color: "bg-violet-500",
    name: "Chidi Okeke",
    email: "chidi@acme.ng",
    position: "Software Engineer",
    department: "Technology",
    salary: "₦520,000",
    joined: "Nov 2022",
  },
  {
    id: 5,
    initials: "NE",
    color: "bg-teal-500",
    name: "Ngozi Eze",
    email: "ngozi@acme.ng",
    position: "Sales Executive",
    department: "Sales",
    salary: "₦310,000",
    joined: "Feb 2023",
  },
  {
    id: 6,
    initials: "TA",
    color: "bg-cyan-500",
    name: "Tunde Adesanya",
    email: "tunde@acme.ng",
    position: "Operations Lead",
    department: "Operations",
    salary: "₦420,000",
    joined: "May 2023",
  },
];

export default function EmployeeDashboard() {
  const [employees, setEmployees] = useState(initialEmployees);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    position: "",
    department: "",
    salary: "",
    joined: "",
  });

  const openEditModal = (employee) => {
    setEditingId(employee.id);
    setFormData({
      name: employee.name,
      email: employee.email,
      position: employee.position,
      department: employee.department,
      salary: employee.salary,
      joined: employee.joined,
    });
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setEmployees((prev) =>
      prev.map((employee) =>
        employee.id === editingId ? { ...employee, ...formData } : employee
      )
    );
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleDelete = (id) => {
    setEmployees((prev) => prev.filter((employee) => employee.id !== id));
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 font-sans">
      {/* Top Actions - hide non-essential on mobile */}
      <div className="mb-6 flex flex-wrap justify-end gap-2 sm:gap-3">
        <button className="hidden sm:flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50">
          <FiRefreshCw size={18} />
        </button>

        <button className="hidden sm:flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600">
          Copy
          <FiChevronDown size={16} />
        </button>

        <button className="rounded-xl bg-slate-900 px-4 sm:px-5 py-2 sm:py-2.5 text-sm font-semibold text-white shadow-sm touch-target">
          Publish
        </button>

        <button className="hidden sm:flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50">
          <FiX size={18} />
        </button>
      </div>

      {/* Search + Filters */}
      <div className="mb-6 flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            placeholder="Search staff..."
            className="h-12 sm:h-14 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-sm outline-none placeholder:text-slate-400 focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
          />
        </div>

        <div className="flex gap-2 sm:gap-3 overflow-x-auto">
          <button className="rounded-xl bg-teal-500 px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-white shadow-sm whitespace-nowrap touch-target">
            All
          </button>

          <button className="rounded-xl border border-slate-200 bg-white px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-slate-600 whitespace-nowrap touch-target">
            Active
          </button>

          <button className="rounded-xl border border-slate-200 bg-white px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-slate-600 whitespace-nowrap touch-target">
            Inactive
          </button>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                {[
                  "EMPLOYEE",
                  "POSITION",
                  "DEPARTMENT",
                  "MONTHLY SALARY",
                  "JOINED",
                  "ACTIONS",
                ].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-5 text-left text-xs font-bold tracking-wider text-slate-500"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {employees.map((employee) => (
                <tr
                  key={employee.id}
                  className="border-b border-slate-100 last:border-0"
                >
                  {/* Employee */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold text-white ${employee.color}`}
                      >
                        {employee.initials}
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold text-slate-800">
                          {employee.name}
                        </h3>

                        <p className="mt-1 text-xs text-slate-400">
                          {employee.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Position */}
                  <td className="px-6 py-5 text-sm text-slate-700">
                    {employee.position}
                  </td>

                  {/* Department */}
                  <td className="px-6 py-5">
                    <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-medium text-slate-500">
                      {employee.department}
                    </span>
                  </td>

                  {/* Salary */}
                  <td className="px-6 py-5 text-sm font-semibold text-slate-800">
                    {employee.salary}
                  </td>

                  {/* Joined */}
                  <td className="px-6 py-5 text-sm text-slate-600">
                    {employee.joined}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-5">
                    <div className="flex gap-3">
                      <button
                        onClick={() => openEditModal(employee)}
                        className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-50 touch-target"
                      >
                        <FiEdit2 className="text-orange-400" />
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(employee.id)}
                        className="flex items-center gap-2 rounded-xl bg-red-100 px-4 py-3 text-sm font-medium text-red-500 transition hover:bg-red-200 touch-target"
                      >
                        <FiTrash2 />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {employees.map((employee) => (
          <div
            key={employee.id}
            className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm"
          >
            <div className="flex items-start gap-3 mb-4">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold text-white flex-shrink-0 ${employee.color}`}
              >
                {employee.initials}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-slate-800 truncate">
                  {employee.name}
                </h3>

                <p className="mt-1 text-xs text-slate-400 truncate">
                  {employee.email}
                </p>
              </div>
            </div>

            <div className="space-y-3 mb-4 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Position</span>
                <span className="font-medium text-slate-800 text-right">
                  {employee.position}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">Department</span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
                  {employee.department}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">Salary</span>
                <span className="font-semibold text-slate-800">
                  {employee.salary}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">Joined</span>
                <span className="text-slate-700">
                  {employee.joined}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => openEditModal(employee)}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 text-xs font-medium text-slate-700 transition hover:bg-slate-50 touch-target"
              >
                <FiEdit2 className="text-orange-400" />
                Edit
              </button>

              <button
                onClick={() => handleDelete(employee.id)}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-red-100 py-3 text-xs font-medium text-red-500 transition hover:bg-red-200 touch-target"
              >
                <FiTrash2 />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-slate-900/60 px-3 sm:px-4 pb-4">
          <div className="w-full max-w-2xl rounded-3xl md:rounded-3xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-slate-900">Edit Employee</h2>
                <p className="text-xs sm:text-sm text-slate-500">Update the selected employee details.</p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-100 flex-shrink-0 touch-target"
              >
                <FiX size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Name"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-teal-400 focus:bg-white focus:ring-1 focus:ring-teal-400 touch-target"
                  required
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-teal-400 focus:bg-white focus:ring-1 focus:ring-teal-400 touch-target"
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  placeholder="Position"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-teal-400 focus:bg-white focus:ring-1 focus:ring-teal-400 touch-target"
                  required
                />
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="Department"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-teal-400 focus:bg-white focus:ring-1 focus:ring-teal-400 touch-target"
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  type="text"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  placeholder="Monthly Salary"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-teal-400 focus:bg-white focus:ring-1 focus:ring-teal-400 touch-target"
                  required
                />
                <input
                  type="text"
                  name="joined"
                  value={formData.joined}
                  onChange={handleChange}
                  placeholder="Joined"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-teal-400 focus:bg-white focus:ring-1 focus:ring-teal-400 touch-target"
                  required
                />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  className="flex-1 rounded-2xl bg-teal-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-600 touch-target"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 touch-target"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}