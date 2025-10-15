'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Users, GraduationCap, Shield, Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useSignupUserMutation, type SignupUserRequest } from '@/services/authServices';

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [signupUser, { isLoading, error }] = useSignupUserMutation();

  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    gender: '',
    dob: '',
    role: '',
    username: '',
    password: '',
    year: '',
    semester: '',
    faculty: '',
    department: '',
  });

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async () => {
    // Client-side validation
    const nameParts = formData.fullname.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
    const errors: string[] = [];
    const newFieldErrors: Record<string, string> = {};

    // General validations
    if (!firstName) {
      errors.push('First name is required');
      newFieldErrors.fullname = 'First name is required';
    }
    if (!lastName) {
      errors.push('Last name is required');
      newFieldErrors.fullname = newFieldErrors.fullname || 'Last name is required';
    }
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.push('Valid email is required');
      newFieldErrors.email = 'Valid email is required';
    }
    if (formData.password.length < 8) {
      errors.push('Password must be at least 8 characters long');
      newFieldErrors.password = 'Password must be at least 8 characters long';
    }
    if (!['MALE', 'FEMALE', 'OTHER'].includes(formData.gender)) {
      errors.push('Gender must be Male, Female, or Other');
      newFieldErrors.gender = 'Gender is required';
    }
    if (!formData.dob || !/^\d{4}-\d{2}-\d{2}$/.test(formData.dob)) {
      errors.push('Valid date of birth (YYYY-MM-DD) is required');
      newFieldErrors.dob = 'Valid date is required';
    }
    if (!['student', 'lecturer'].includes(formData.role)) {
      errors.push('Role must be Student or Lecturer');
      newFieldErrors.role = 'Role is required';
    }
    if (!formData.faculty) {
      errors.push('Faculty is required');
      newFieldErrors.faculty = 'Faculty is required';
    }
    if (!formData.department) {
      errors.push('Department is required');
      newFieldErrors.department = 'Department is required';
    }

    // Student-specific validations
    if (formData.role === 'student') {
      if (!['1', '2', '3', '4'].includes(formData.year)) {
        errors.push('Year must be 1, 2, 3, or 4');
        newFieldErrors.year = 'Year is required';
      }
      if (!['1', '2'].includes(formData.semester)) {
        errors.push('Semester must be 1 or 2');
        newFieldErrors.semester = 'Semester is required';
      }
    }

    if (errors.length > 0) {
      setFieldErrors(newFieldErrors);
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: errors.join(', '),
      });
      return;
    }

    try {
      const userData: SignupUserRequest = {
        firstName,
        lastName,
        email: formData.email,
        password: formData.password,
        gender: formData.gender,
        dob: new Date(formData.dob).toISOString(),
        role: formData.role.toUpperCase() as 'STUDENT' | 'LECTURER',
        year: formData.role === 'student' ? formData.year : undefined,
        semester: formData.role === 'student' ? formData.semester : undefined,
        faculty: formData.faculty,
        department: formData.department,
        institutionId: '550e8400-e29b-41d4-a716-446655440000',
      };

      console.log('Sending userData:', JSON.stringify(userData, null, 2));

      const userResult = await signupUser(userData).unwrap();
      if (!userResult.success) {
        throw new Error(userResult.message || 'User registration failed');
      }

      toast({
        title: 'Registration Successful',
        description: 'Your account and profile have been created successfully.',
      });
      setTimeout(() => router.push('/auth'), 2000);
    } catch (err: any) {
      console.error('Signup error:', err);
      const errorMessage = err?.data?.message || err.message || 'An unexpected error occurred.';
      const errorDetails = err?.data?.errors
        ? err.data.errors.map((e: { field: string; message: string }) => `${e.field}: ${e.message}`).join(', ')
        : '';
      setFieldErrors(
        err?.data?.errors
          ? err.data.errors.reduce((acc: Record<string, string>, e: { field: string; message: string }) => {
              acc[e.field] = e.message;
              return acc;
            }, {})
          : {}
      );
      toast({
        variant: 'destructive',
        title: 'Error',
        description: errorDetails ? `${errorMessage} (${errorDetails})` : errorMessage,
      });
    }
  };

  const progressValue = (step / 3) * 100;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-600/50 rounded-lg flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-50 to-teal-100 p-12 flex-col justify-between rounded-lg">
        <div>
          <div className="flex items-center gap-2 mb-12">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Afrivas</span>
          </div>
          <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-900 leading-tight">Join Our Academic Community</h1>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Easy Course Management</h3>
                  <p className="text-gray-600 text-sm">Streamline your academic journey with our intuitive course management system.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Users className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Connect with Peers</h3>
                  <p className="text-gray-600 text-sm">Build meaningful connections with students and faculty across departments.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Shield className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Secure & Private</h3>
                  <p className="text-gray-600 text-sm">Your academic data is protected with enterprise-grade security measures.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="text-sm text-gray-500">© 2025 Afrivas • Privacy & Terms</div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 dark:text-white">Get started with Afrivas</h2>
            <p className="text-gray-600 dark:text-gray-300">Create your account to access our platform</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-500 mb-2 dark:text-gray-300">
              <span>Step {step} of 3</span>
              <span>{Math.round(progressValue)}% complete</span>
            </div>
            <Progress value={progressValue} className="h-2" />
          </div>

          {/* Step 1: Personal Details */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 dark:text-white">Personal Information</h3>
                <div className="space-y-4">
                  <div>
                    <Input
                      name="fullname"
                      placeholder="Full Name"
                      value={formData.fullname}
                      onChange={handleChange}
                      className="h-12"
                    />
                    {fieldErrors.fullname && <div className="text-red-600 text-sm">{fieldErrors.fullname}</div>}
                  </div>
                  <div>
                    <Input
                      name="email"
                      type="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={handleChange}
                      className="h-12"
                    />
                    {fieldErrors.email && <div className="text-red-600 text-sm">{fieldErrors.email}</div>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Select onValueChange={(value) => handleSelectChange('gender', value)}>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MALE">Male</SelectItem>
                          <SelectItem value="FEMALE">Female</SelectItem>
                          <SelectItem value="OTHER">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      {fieldErrors.gender && <div className="text-red-600 text-sm">{fieldErrors.gender}</div>}
                    </div>
                    <div>
                      <Input name="dob" type="date" value={formData.dob} onChange={handleChange} className="h-12" />
                      {fieldErrors.dob && <div className="text-red-600 text-sm">{fieldErrors.dob}</div>}
                    </div>
                  </div>
                  <div>
                    <Select onValueChange={(value) => handleSelectChange('role', value)}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="lecturer">Lecturer</SelectItem>
                      </SelectContent>
                    </Select>
                    {fieldErrors.role && <div className="text-red-600 text-sm">{fieldErrors.role}</div>}
                  </div>
                </div>
              </div>
              <Button
                onClick={handleNext}
                className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-medium"
                disabled={!formData.fullname || !formData.email || !formData.gender || !formData.dob || !formData.role}
              >
                Continue
              </Button>
            </div>
          )}

          {/* Step 2: Account Setup */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 dark:text-white">Account Setup</h3>
                <div className="space-y-4">
                  <div>
                    <Input
                      name="username"
                      placeholder="Choose a username"
                      value={formData.username}
                      onChange={handleChange}
                      className="h-12"
                    />
                    {fieldErrors.username && <div className="text-red-600 text-sm">{fieldErrors.username}</div>}
                  </div>
                  <div>
                    <Input
                      name="password"
                      type="password"
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={handleChange}
                      className="h-12"
                    />
                    {fieldErrors.password && <div className="text-red-600 text-sm">{fieldErrors.password}</div>}
                    <div className="text-xs text-gray-500">
                      Password should be at least 8 characters long and include numbers and special characters.
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <Button onClick={handleBack} variant="outline" className="flex-1 h-12">
                  Back
                </Button>
                <Button
                  onClick={handleNext}
                  className="flex-1 h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-medium"
                  disabled={!formData.username || !formData.password}
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Academic Details */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 dark:text-white">
                  {formData.role === 'student' ? 'Academic Information' : 'Professional Information'}
                </h3>
                <div className="space-y-4">
                  {formData.role === 'student' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Select onValueChange={(value) => handleSelectChange('year', value)}>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Year" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Year 1</SelectItem>
                            <SelectItem value="2">Year 2</SelectItem>
                            <SelectItem value="3">Year 3</SelectItem>
                            <SelectItem value="4">Year 4</SelectItem>
                          </SelectContent>
                        </Select>
                        {fieldErrors.year && <div className="text-red-600 text-sm">{fieldErrors.year}</div>}
                      </div>
                      <div>
                        <Select onValueChange={(value) => handleSelectChange('semester', value)}>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Semester" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Semester 1</SelectItem>
                            <SelectItem value="2">Semester 2</SelectItem>
                          </SelectContent>
                        </Select>
                        {fieldErrors.semester && <div className="text-red-600 text-sm">{fieldErrors.semester}</div>}
                      </div>
                    </div>
                  )}
                  <div>
                    <Select onValueChange={(value) => handleSelectChange('faculty', value)}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select Faculty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FICT">Faculty of Information and Communication Technology</SelectItem>
                        <SelectItem value="FMBA">Faculty of Management and Business Administration</SelectItem>
                        <SelectItem value="BSEM">Business School of Engineering and Management</SelectItem>
                      </SelectContent>
                    </Select>
                    {fieldErrors.faculty && <div className="text-red-600 text-sm">{fieldErrors.faculty}</div>}
                  </div>
                  <div>
                    <Select onValueChange={(value) => handleSelectChange('department', value)}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select Department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CS">Computer Science</SelectItem>
                        <SelectItem value="EE">Electrical Engineering</SelectItem>
                        <SelectItem value="ME">Mechanical Engineering</SelectItem>
                        <SelectItem value="BA">Business Administration</SelectItem>
                        <SelectItem value="IT">Information Technology</SelectItem>
                      </SelectContent>
                    </Select>
                    {fieldErrors.department && <div className="text-red-600 text-sm">{fieldErrors.department}</div>}
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <Button onClick={handleBack} variant="outline" className="flex-1 h-12" disabled={isLoading}>
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="flex-1 h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-medium"
                  disabled={
                    isLoading ||
                    !formData.faculty ||
                    !formData.department ||
                    (formData.role === 'student' && (!formData.year || !formData.semester))
                  }
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="text-center mt-4 text-sm text-red-600">
              {((error as any).data as { message?: string })?.message || 'An error occurred during signup.'}
            </div>
          )}

          {/* Login Link */}
          <div className="text-center mt-6">
            <span className="text-sm text-gray-600 dark:text-gray-300">Already have an account? </span>
            <button
              onClick={() => router.push('/auth')}
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}