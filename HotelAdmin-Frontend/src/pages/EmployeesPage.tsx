import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  status: 'active' | 'inactive';
}

const EmployeesPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([
    { id: '1', name: 'John Doe', email: 'john@hotel.com', phone: '555-0101', position: 'Manager', department: 'admin', status: 'active' },
    { id: '2', name: 'Jane Smith', email: 'jane@hotel.com', phone: '555-0102', position: 'Housekeeper', department: 'housekeeping', status: 'active' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    department: 'admin',
  });

  const handleAddEmployee = () => {
    const newEmployee: Employee = {
      id: Date.now().toString(),
      ...formData,
      status: 'active',
    };
    setEmployees([...employees, newEmployee]);
    setFormData({ name: '', email: '', phone: '', position: '', department: 'admin' });
    setIsModalOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Layout title="Employees">
      <div className="space-y-6">
        <div className="flex justify-end">
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            Add Employee
          </Button>
        </div>

        <Modal
          isOpen={isModalOpen}
          title="Add New Employee"
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleAddEmployee}
          confirmText="Add Employee"
        >
          <div className="space-y-4">
            <Input
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full name"
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="employee@hotel.com"
            />
            <Input
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1-555-0000"
            />
            <Input
              label="Position"
              name="position"
              value={formData.position}
              onChange={handleChange}
              placeholder="e.g., Manager"
            />
            <Select
              label="Department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              options={[
                { value: 'admin', label: 'Administration' },
                { value: 'housekeeping', label: 'Housekeeping' },
                { value: 'reception', label: 'Reception' },
                { value: 'maintenance', label: 'Maintenance' },
                { value: 'kitchen', label: 'Kitchen' },
              ]}
            />
          </div>
        </Modal>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-700 dark:bg-slate-800">
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">Position</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">Department</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id} className="border-b border-slate-700 hover:bg-slate-800 transition">
                  <td className="px-6 py-4 text-white">{emp.name}</td>
                  <td className="px-6 py-4 text-slate-300">{emp.email}</td>
                  <td className="px-6 py-4 text-slate-300">{emp.position}</td>
                  <td className="px-6 py-4 text-slate-300 capitalize">{emp.department}</td>
                  <td className="px-6 py-4">
                    <Badge status={emp.status} />
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <Button size="sm" variant="secondary">
                      Edit
                    </Button>
                    <Button size="sm" variant="danger">
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default EmployeesPage;
