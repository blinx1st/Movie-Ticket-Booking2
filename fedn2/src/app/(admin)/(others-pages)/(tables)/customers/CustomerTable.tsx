'use client';
import { useEffect, useState } from 'react';
import { CustomerService } from '@/services/CustomerService';
import { useRouter } from 'next/navigation';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address?: string;
}

export default function CustomerTable() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();


  // Load customers
  const loadCustomers = async () => {
    setLoading(true);
    try {
      const data = await CustomerService.list();
      setCustomers(Array.isArray(data) ? data : data?.data || []);
    } catch (error) {
      console.error('Failed to load customers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleDelete = async (id: number) => {
    const confirmed = confirm('Are you sure you want to delete this customer?');
    if (!confirmed) return;

    try {
      await CustomerService.remove(id);
      alert('Customer deleted successfully.');
      loadCustomers(); // Refresh the table
    } catch (error) {
      console.error('Failed to delete customer:', error);
      alert('Error deleting customer.');
    }
  };
  

  if (loading) return <p className="p-4">Loading customers...</p>;

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full text-left text-sm font-medium text-gray-600">
        <thead className="bg-gray-50 text-gray-700">
          <tr>
            <th className="px-6 py-3">Name</th>
            <th className="px-6 py-3">Email</th>
            <th className="px-6 py-3">Phone</th>
            <th className="px-6 py-3">Address</th>
            <th className="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {customers.map((customer) => (
            <tr key={customer.id} className="hover:bg-gray-50">
              <td className="px-6 py-3 text-gray-900">{customer.name}</td>
              <td className="px-6 py-3">{customer.email}</td>
              <td className="px-6 py-3">{customer.phone}</td>
              <td className="px-6 py-3">{customer.address || '-'}</td>
              <td className="px-6 py-3 flex gap-2">
                <button className="text-blue-600 hover:underline"
                onClick={()=>router.push(`/customers/${customer.id}/edit`)}>Edit</button>
                <button className="text-red-600 hover:underline"
                onClick={()=> handleDelete(customer.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {customers.length === 0 && (
        <p className="p-4 text-center text-gray-500">No customers found.</p>
      )}
    </div>
  );
}
