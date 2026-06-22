import React, { useState } from "react";

const Staff = () => {
  const [showModal, setShowModal] = useState(false);

  const [staffList, setStaffList] = useState([
    {
      employee: "John Doe",
      position: "Manager",
      department: "Finance",
      salary: "5000",
      joined: "2025-01-10",
      status: "Active",
    },
    {
      employee: "Sarah Johnson",
      position: "Developer",
      department: "Tech",
      salary: "4500",
      joined: "2025-02-15",
      status: "Active",
    },
    {
      employee: "Michael Brown",
      position: "UI/UX Designer",
      department: "Tech",
      salary: "4000",
      joined: "2025-03-05",
      status: "Inactive",
    },
    {
      employee: "David Wilson",
      position: "Accountant",
      department: "Finance",
      salary: "3800",
      joined: "2025-01-20",
      status: "Active",
    },
    {
      employee: "Emily Davis",
      position: "HR Officer",
      department: "Human Resources",
      salary: "3500",
      joined: "2025-04-01",
      status: "Active",
    },
    {
      employee: "James Smith",
      position: "System Admin",
      department: "Tech",
      salary: "4800",
      joined: "2025-02-25",
      status: "Active",
    },
    {
      employee: "Sophia Taylor",
      position: "Marketing Lead",
      department: "Marketing",
      salary: "4200",
      joined: "2025-03-12",
      status: "Inactive",
    },
  ]);

  const [formData, setFormData] = useState({
    employee: "",
    position: "",
    department: "",
    salary: "",
    joined: "",
    status: "Active",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setStaffList([...staffList, formData]);

    setFormData({
      employee: "",
      position: "",
      department: "",
      salary: "",
      joined: "",
      status: "Active",
    });

    setShowModal(false);
  };

  const deleteStaff = (index) => {
    setStaffList(staffList.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-[#0A192F] via-[#112240] to-[#0F172A]">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent">
          Staff Management
        </h1>

        <button
          onClick={() => setShowModal(true)}
          className="bg-teal-600 hover:bg-teal-500 text-white px-5 py-3 rounded-xl shadow-lg shadow-teal-500/20 transition duration-300"
        >
          + Add Staff
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-3xl backdrop-blur-lg bg-[#112240]/40 border border-teal-500/20 shadow-[0_0_40px_rgba(20,184,166,0.15)]">
        <table className="w-full">
          <thead className="bg-[#112240]/90 text-white">
            <tr>
              <th className="p-4">Employee</th>
              <th className="p-4">Position</th>
              <th className="p-4">Department</th>
              <th className="p-4">Monthly Salary</th>
              <th className="p-4">Joined</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {staffList.map((staff, index) => (
              <tr
                key={index}
                className="text-center border-b border-white/10 text-white hover:bg-teal-500/5 transition"
              >
                <td className="p-4">{staff.employee}</td>
                <td className="p-4">{staff.position}</td>
                <td className="p-4">{staff.department}</td>
                <td className="p-4 font-semibold text-teal-300">
                  ${staff.salary}
                </td>
                <td className="p-4">{staff.joined}</td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      staff.status === "Active"
                        ? "bg-teal-500 text-white"
                        : "bg-slate-600 text-gray-200"
                    }`}
                  >
                    {staff.status}
                  </span>
                </td>

                <td className="p-4">
                  <button
                    onClick={() => deleteStaff(index)}
                    className="bg-[#1E293B] hover:bg-[#334155] border border-teal-500/20 px-3 py-2 rounded-lg text-white transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center">
          <div className="bg-[#112240]/95 backdrop-blur-xl border border-teal-500/20 p-6 rounded-3xl w-[450px] text-white shadow-[0_0_40px_rgba(20,184,166,0.15)]">
            <h2 className="text-2xl font-bold mb-5 text-teal-300">
              Add New Staff
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="employee"
                placeholder="Employee Name"
                value={formData.employee}
                onChange={handleChange}
                className="w-full p-3 rounded-xl bg-[#0A192F]/80 border border-teal-500/30 text-white focus:outline-none focus:border-teal-400"
                required
              />

              <input
                type="text"
                name="position"
                placeholder="Position"
                value={formData.position}
                onChange={handleChange}
                className="w-full p-3 rounded-xl bg-[#0A192F]/80 border border-teal-500/30 text-white focus:outline-none focus:border-teal-400"
                required
              />

              <input
                type="text"
                name="department"
                placeholder="Department"
                value={formData.department}
                onChange={handleChange}
                className="w-full p-3 rounded-xl bg-[#0A192F]/80 border border-teal-500/30 text-white focus:outline-none focus:border-teal-400"
                required
              />

              <input
                type="number"
                name="salary"
                placeholder="Monthly Salary"
                value={formData.salary}
                onChange={handleChange}
                className="w-full p-3 rounded-xl bg-[#0A192F]/80 border border-teal-500/30 text-white focus:outline-none focus:border-teal-400"
                required
              />

              <input
                type="date"
                name="joined"
                value={formData.joined}
                onChange={handleChange}
                className="w-full p-3 rounded-xl bg-[#0A192F]/80 border border-teal-500/30 text-white focus:outline-none focus:border-teal-400"
                required
              />

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-3 rounded-xl bg-[#0A192F]/80 border border-teal-500/30 text-white focus:outline-none focus:border-teal-400"
              >
                <option className="text-black">Active</option>
                <option className="text-black">Inactive</option>
     np         </select>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-teal-600 hover:bg-teal-500 py-3 rounded-xl font-semibold transition"
                >
                  Save
                </button>

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 py-3 rounded-xl font-semibold transition"
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
};

export default Staff;