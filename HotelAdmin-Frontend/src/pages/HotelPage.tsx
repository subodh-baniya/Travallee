import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const HotelPage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [hotel, setHotel] = useState({
    name: 'Paradise Hotel',
    description: 'A luxurious hotel with modern amenities',
    address: '123 Main Street',
    city: 'New York',
    country: 'USA',
    phone: '+1-555-0123',
    email: 'info@paradisehotel.com',
    website: 'www.paradisehotel.com',
    rating: 4.5,
  });

  const [formData, setFormData] = useState(hotel);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setHotel(formData);
    setIsEditing(false);
  };

  return (
    <Layout title="Hotel Data">
      <div className="max-w-4xl">
        <Card className="mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Hotel Information</h2>
            <Button variant={isEditing ? 'secondary' : 'primary'} onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? 'Cancel' : 'Edit'}
            </Button>
          </div>

          {!isEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-slate-400 text-sm">Hotel Name</p>
                <p className="text-white font-medium mt-1">{hotel.name}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Rating</p>
                <p className="text-yellow-400 font-medium mt-1">★ {hotel.rating}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-slate-400 text-sm">Description</p>
                <p className="text-slate-200 mt-1">{hotel.description}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Address</p>
                <p className="text-white font-medium mt-1">{hotel.address}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">City</p>
                <p className="text-white font-medium mt-1">{hotel.city}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Country</p>
                <p className="text-white font-medium mt-1">{hotel.country}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Phone</p>
                <p className="text-white font-medium mt-1">{hotel.phone}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Email</p>
                <p className="text-white font-medium mt-1">{hotel.email}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Website</p>
                <p className="text-blue-400 font-medium mt-1">{hotel.website}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Hotel Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
                <Input
                  label="Rating"
                  name="rating"
                  type="number"
                  step="0.1"
                  value={formData.rating}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 bg-slate-700 dark:bg-slate-800 text-white border border-slate-600 rounded-lg focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
                <Input label="City" name="city" value={formData.city} onChange={handleChange} />
                <Input
                  label="Country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                />
                <Input label="Phone" name="phone" value={formData.phone} onChange={handleChange} />
                <Input label="Email" name="email" type="email" value={formData.email} onChange={handleChange} />
                <Input
                  label="Website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                />
              </div>

              <Button fullWidth onClick={handleSave} variant="primary">
                Save Changes
              </Button>
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
};

export default HotelPage;
