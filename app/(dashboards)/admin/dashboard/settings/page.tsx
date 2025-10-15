import { Settings, Users, Shield, Database, Mail, Globe, Save } from "lucide-react"

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">System Settings</h1>
        <p className="text-gray-500">Manage system-wide configurations and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border shadow-sm">
            <div className="p-4">
              <h3 className="font-medium mb-4">Settings</h3>
              <nav className="space-y-2">
                <SettingsNavItem icon={<Settings size={16} />} label="General" active />
                <SettingsNavItem icon={<Users size={16} />} label="User Management" />
                <SettingsNavItem icon={<Shield size={16} />} label="Security" />
                <SettingsNavItem icon={<Database size={16} />} label="System" />
                <SettingsNavItem icon={<Mail size={16} />} label="Email" />
                <SettingsNavItem icon={<Globe size={16} />} label="Localization" />
              </nav>
            </div>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* General Settings */}
          <div className="bg-white rounded-lg border shadow-sm">
            <div className="p-6 border-b">
              <h2 className="text-lg font-medium">General Settings</h2>
              <p className="text-sm text-gray-500">Basic system configuration</p>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Institution Name</label>
                  <input
                    type="text"
                    defaultValue="Afrivas University"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Academic Year</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>2024-2025</option>
                    <option>2025-2026</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Semester</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>Spring 2025</option>
                    <option>Summer 2025</option>
                    <option>Fall 2025</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time Zone</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>UTC</option>
                    <option>Eastern Time (ET)</option>
                    <option>Central Time (CT)</option>
                    <option>Pacific Time (PT)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* User Management Settings */}
          <div className="bg-white rounded-lg border shadow-sm">
            <div className="p-6 border-b">
              <h2 className="text-lg font-medium">User Management</h2>
              <p className="text-sm text-gray-500">Configure user registration and access controls</p>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <SystemSetting
                  title="Allow Student Self-Registration"
                  description="Students can create their own accounts"
                  defaultChecked={true}
                />
                <SystemSetting
                  title="Require Email Verification"
                  description="Users must verify their email before accessing the system"
                  defaultChecked={true}
                />
                <SystemSetting
                  title="Enable Two-Factor Authentication"
                  description="Require 2FA for all admin accounts"
                  defaultChecked={false}
                />
                <SystemSetting
                  title="Auto-Archive Inactive Users"
                  description="Automatically archive users inactive for 6 months"
                  defaultChecked={true}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Default User Role</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>Student</option>
                    <option>Teacher</option>
                    <option>Staff</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password Policy</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>Standard (8+ characters)</option>
                    <option>Strong (12+ characters, mixed case)</option>
                    <option>Very Strong (16+ characters, symbols)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* System Settings */}
          <div className="bg-white rounded-lg border shadow-sm">
            <div className="p-6 border-b">
              <h2 className="text-lg font-medium">System Configuration</h2>
              <p className="text-sm text-gray-500">Advanced system settings</p>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <SystemSetting
                  title="Maintenance Mode"
                  description="Put the system in maintenance mode"
                  defaultChecked={false}
                />
                <SystemSetting title="Debug Mode" description="Enable detailed error logging" defaultChecked={false} />
                <SystemSetting
                  title="Auto Backup"
                  description="Automatically backup data daily"
                  defaultChecked={true}
                />
                <SystemSetting title="API Access" description="Allow external API access" defaultChecked={true} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max File Upload Size</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>10 MB</option>
                    <option>25 MB</option>
                    <option>50 MB</option>
                    <option>100 MB</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>30 minutes</option>
                    <option>1 hour</option>
                    <option>2 hours</option>
                    <option>4 hours</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Email Settings */}
          <div className="bg-white rounded-lg border shadow-sm">
            <div className="p-6 border-b">
              <h2 className="text-lg font-medium">Email Configuration</h2>
              <p className="text-sm text-gray-500">Configure email server and notifications</p>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Server</label>
                  <input
                    type="text"
                    defaultValue="smtp.university.edu"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Port</label>
                  <input
                    type="number"
                    defaultValue="587"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">From Email</label>
                  <input
                    type="email"
                    defaultValue="noreply@university.edu"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">From Name</label>
                  <input
                    type="text"
                    defaultValue="Afrivas University"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button className="px-6 py-2 bg-blue-600 text-white rounded-md font-medium flex items-center gap-2 hover:bg-blue-700">
              <Save size={16} />
              Save All Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function SettingsNavItem({ icon, label, active = false }) {
  return (
    <button
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        active ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600" : "text-gray-700 hover:bg-gray-50"
      }`}
    >
      {icon}
      {label}
    </button>
  )
}

function SystemSetting({ title, description, defaultChecked = false }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h4 className="text-sm font-medium text-gray-900">{title}</h4>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" className="sr-only peer" defaultChecked={defaultChecked} />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
      </label>
    </div>
  )
}
