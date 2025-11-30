import { useState } from 'react';
import { Mail, User, Search, Lock } from 'lucide-react';
import SectionHeader from '../components/ui/SectionHeader';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import TextArea from '../components/ui/TextArea';
import Table from '../components/ui/Table';
import StatusBadge from '../components/ui/StatusBadge';

// Sample data for table
interface SampleData {
  id: number;
  name: string;
  email: string;
  status: 'active' | 'inactive' | 'pending';
  role: string;
}

const sampleTableData: SampleData[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active', role: 'Volunteer' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'pending', role: 'Admin' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'active', role: 'Volunteer' },
  { id: 4, name: 'Alice Williams', email: 'alice@example.com', status: 'inactive', role: 'Coordinator' },
];

export default function UIComponents() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [message, setMessage] = useState('');

  return (
    <div className="min-h-screen bg-gray-50 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-4xl font-display font-bold text-gray-900 mb-4">
            UI Components Library
          </h1>
          <p className="text-lg text-gray-600">
            Complete design system for VIVA admin panels and volunteer management
          </p>
        </div>

        {/* Buttons Section */}
        <section className="mb-16">
          <SectionHeader
            title="Buttons"
            subtitle="Various button styles and sizes for different use cases"
          />
          <Card className="p-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Variants</h3>
                <div className="flex flex-wrap gap-4">
                  <Button variant="primary">Primary Button</Button>
                  <Button variant="secondary">Secondary Button</Button>
                  <Button variant="accent">Accent Button</Button>
                  <Button variant="ghost">Ghost Button</Button>
                  <Button variant="outline">Outline Button</Button>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Sizes</h3>
                <div className="flex flex-wrap items-center gap-4">
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-4">With Icons</h3>
                <div className="flex flex-wrap gap-4">
                  <Button icon={Mail} iconPosition="left">Send Email</Button>
                  <Button variant="accent" icon={User} iconPosition="right">
                    View Profile
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Badges Section */}
        <section className="mb-16">
          <SectionHeader
            title="Badges"
            subtitle="Status indicators and labels"
          />
          <Card className="p-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Badge Variants</h3>
                <div className="flex flex-wrap gap-3">
                  <Badge variant="default">Default</Badge>
                  <Badge variant="primary">Primary</Badge>
                  <Badge variant="accent">Accent</Badge>
                  <Badge variant="success">Success</Badge>
                  <Badge variant="warning">Warning</Badge>
                  <Badge variant="error">Error</Badge>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Status Badges</h3>
                <div className="flex flex-wrap gap-3">
                  <StatusBadge status="active" />
                  <StatusBadge status="inactive" />
                  <StatusBadge status="pending" />
                  <StatusBadge status="completed" />
                  <StatusBadge status="approved" />
                  <StatusBadge status="rejected" />
                  <StatusBadge status="cancelled" />
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Form Inputs Section */}
        <section className="mb-16">
          <SectionHeader
            title="Form Components"
            subtitle="Input fields, selects, and text areas for data entry"
          />
          <Card className="p-8">
            <div className="space-y-6 max-w-2xl">
              <Input
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                icon={Mail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                helperText="We'll never share your email"
                fullWidth
              />

              <Input
                label="Password"
                type="password"
                placeholder="Enter password"
                icon={Lock}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
              />

              <Input
                label="Search"
                type="text"
                placeholder="Search..."
                icon={Search}
                iconPosition="left"
                fullWidth
              />

              <Input
                label="Error State"
                type="text"
                error="This field is required"
                fullWidth
              />

              <Select
                label="Select Role"
                options={[
                  { value: 'volunteer', label: 'Volunteer' },
                  { value: 'coordinator', label: 'Coordinator' },
                  { value: 'admin', label: 'Admin' },
                ]}
                placeholder="Choose a role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                fullWidth
              />

              <TextArea
                label="Message"
                placeholder="Enter your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                helperText="Maximum 500 characters"
                fullWidth
              />
            </div>
          </Card>
        </section>

        {/* Table Section */}
        <section className="mb-16">
          <SectionHeader
            title="Data Tables"
            subtitle="Display and manage data in a structured format"
          />
          <Table
            data={sampleTableData}
            columns={[
              { header: 'ID', accessor: 'id', width: '60px' },
              { header: 'Name', accessor: 'name' },
              { header: 'Email', accessor: 'email' },
              {
                header: 'Status',
                accessor: (row) => <StatusBadge status={row.status} size="sm" />,
                align: 'center',
              },
              { header: 'Role', accessor: 'role' },
              {
                header: 'Actions',
                accessor: (row) => (
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost">Edit</Button>
                    <Button size="sm" variant="ghost">Delete</Button>
                  </div>
                ),
                align: 'right',
              },
            ]}
            hoverable
          />
        </section>

        {/* Cards Section */}
        <section className="mb-16">
          <SectionHeader
            title="Cards"
            subtitle="Container components with different styles"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card variant="default" className="p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Default Card</h3>
              <p className="text-sm text-gray-600">Standard white card with border</p>
            </Card>

            <Card variant="glass" className="p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Glass Card</h3>
              <p className="text-sm text-gray-600">Glassmorphism effect with blur</p>
            </Card>

            <Card variant="glass-strong" className="p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Glass Strong</h3>
              <p className="text-sm text-gray-600">More opaque glass effect</p>
            </Card>

            <Card variant="elevated" className="p-6" hover>
              <h3 className="font-semibold text-gray-900 mb-2">Elevated Card</h3>
              <p className="text-sm text-gray-600">With hover animation</p>
            </Card>
          </div>
        </section>

        {/* Color Palette */}
        <section className="mb-16">
          <SectionHeader
            title="Color Palette"
            subtitle="Unified color scheme matching Career Fair website"
          />
          <div className="space-y-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Primary (Blue)</h3>
              <div className="grid grid-cols-5 gap-4">
                <div className="space-y-2">
                  <div className="h-20 rounded-lg bg-primary-100"></div>
                  <p className="text-xs text-gray-600">100</p>
                </div>
                <div className="space-y-2">
                  <div className="h-20 rounded-lg bg-primary-300"></div>
                  <p className="text-xs text-gray-600">300</p>
                </div>
                <div className="space-y-2">
                  <div className="h-20 rounded-lg bg-primary-500"></div>
                  <p className="text-xs text-gray-600">500</p>
                </div>
                <div className="space-y-2">
                  <div className="h-20 rounded-lg bg-primary-700"></div>
                  <p className="text-xs text-gray-600">700</p>
                </div>
                <div className="space-y-2">
                  <div className="h-20 rounded-lg bg-primary-900"></div>
                  <p className="text-xs text-gray-600">900</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Accent (Purple)</h3>
              <div className="grid grid-cols-5 gap-4">
                <div className="space-y-2">
                  <div className="h-20 rounded-lg bg-accent-100"></div>
                  <p className="text-xs text-gray-600">100</p>
                </div>
                <div className="space-y-2">
                  <div className="h-20 rounded-lg bg-accent-300"></div>
                  <p className="text-xs text-gray-600">300</p>
                </div>
                <div className="space-y-2">
                  <div className="h-20 rounded-lg bg-accent-500"></div>
                  <p className="text-xs text-gray-600">500</p>
                </div>
                <div className="space-y-2">
                  <div className="h-20 rounded-lg bg-accent-700"></div>
                  <p className="text-xs text-gray-600">700</p>
                </div>
                <div className="space-y-2">
                  <div className="h-20 rounded-lg bg-accent-900"></div>
                  <p className="text-xs text-gray-600">900</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
