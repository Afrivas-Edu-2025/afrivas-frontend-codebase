import Image from "next/image"
import { Camera } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-gray-500">Manage your account settings and preferences.</p>
      </div>

      <div className="bg-white border rounded-lg overflow-hidden">
        <div className="flex border-b">
          <button className="px-6 py-3 text-sm font-medium border-b-2 border-blue-500 text-blue-600">Profile</button>
          <button className="px-6 py-3 text-sm font-medium text-gray-500 hover:text-gray-700">System</button>
          <button className="px-6 py-3 text-sm font-medium text-gray-500 hover:text-gray-700">Notifications</button>
          <button className="px-6 py-3 text-sm font-medium text-gray-500 hover:text-gray-700">Security</button>
          <button className="px-6 py-3 text-sm font-medium text-gray-500 hover:text-gray-700">Integrations</button>
          <button className="px-6 py-3 text-sm font-medium text-gray-500 hover:text-gray-700">Activation</button>
        </div>

        <div className="p-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-lg font-medium mb-6">Profile Information</h2>
            <p className="text-sm text-gray-500 mb-6">Update your personal information and profile settings.</p>

            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100">
                  <Image
                    src="/placeholder.svg?height=96&width=96"
                    width={96}
                    height={96}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full">
                  <Camera size={16} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-1">
                Job Title
              </label>
              <input
                type="text"
                id="jobTitle"
                defaultValue="System Administrator"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <input
                type="text"
                id="department"
                defaultValue="Administration"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                id="bio"
                rows={4}
                defaultValue="System administrator responsible for managing the AFRIVAS educational platform."
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Cancel
              </button>
              <button className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
