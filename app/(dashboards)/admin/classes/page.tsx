'use client';

import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  useCreateClassMutation,
  useGetAllLecturersQuery,
  useGetAllStudentsQuery,
  useGetClassesQuery,
  useGetCoursesQuery,
  useGetDepartmentsQuery,
  useGetFacultiesQuery,
  useGetLevelsQuery,
  useGetSemestersQuery,
} from '@/services/adminApi';

type PlannedClass = {
  name: string;
  code: string;
  studentCount: number;
  startIndex: number;
  endIndex: number;
};

const deriveDayTimeFromSchedule = (schedule: string): { day?: string; time?: string } => {
  const trimmed = schedule.trim();
  if (!trimmed) return {};

  const [firstToken] = trimmed.split(/\s+/);
  const timeMatch = trimmed.match(/\b([01]?\d|2[0-3]):[0-5]\d\b/);

  return {
    day: firstToken ? firstToken.toUpperCase() : undefined,
    time: timeMatch?.[0],
  };
};

export default function ClassesPage() {
  const [facultyId, setFacultyId] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [levelId, setLevelId] = useState('');
  const [semesterId, setSemesterId] = useState('');
  const [moduleId, setModuleId] = useState('');
  const [lecturerId, setLecturerId] = useState('');
  const [capacity, setCapacity] = useState(50);
  const [classPrefix, setClassPrefix] = useState('class');
  const [schedule, setSchedule] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: studentsResponse, isLoading: studentsLoading } = useGetAllStudentsQuery({ limit: 200 });
  const { data: classesResponse, isLoading: classesLoading, refetch } = useGetClassesQuery();
  const { data: facultiesResponse } = useGetFacultiesQuery();
  const { data: departmentsResponse } = useGetDepartmentsQuery();
  const { data: levelsResponse } = useGetLevelsQuery();
  const { data: semestersResponse } = useGetSemestersQuery();
  const { data: modulesResponse } = useGetCoursesQuery();
  const { data: lecturersResponse } = useGetAllLecturersQuery({ limit: 200 });
  const [createClass] = useCreateClassMutation();

  const students = studentsResponse?.data || [];
  const classes = classesResponse?.data || [];
  const faculties = facultiesResponse?.data || [];
  const departments = departmentsResponse?.data || [];
  const levels = levelsResponse?.data || [];
  const semesters = semestersResponse?.data || [];
  const modules = modulesResponse?.data || [];
  const lecturers = lecturersResponse?.data || [];

  const filteredDepartments = useMemo(() => {
    if (!facultyId) return departments;
    return departments.filter((department: any) => String(department.facultyId) === String(facultyId));
  }, [departments, facultyId]);

  const filteredLecturers = useMemo(() => {
    if (!departmentId) return lecturers;
    return lecturers.filter((lecturer: any) => {
      const lecturerDepartmentId = lecturer.departmentId || lecturer.deptId;
      return String(lecturerDepartmentId || '') === String(departmentId);
    });
  }, [lecturers, departmentId]);

  const eligibleStudents = useMemo(() => {
    return students.filter((student: any) => {
      const studentFacultyId = student.facultyId || student.faculty?.id;
      const studentDepartmentId = student.departmentId || student.deptId || student.department?.id;
      const studentLevelId = student.levelId || student.yearOfStudy;
      const studentSemesterId = student.semesterId || student.semester?.id;

      if (facultyId && String(studentFacultyId || '') !== String(facultyId)) return false;
      if (departmentId && String(studentDepartmentId || '') !== String(departmentId)) return false;
      if (levelId && String(studentLevelId || '') !== String(levelId)) return false;
      if (semesterId && String(studentSemesterId || '') !== String(semesterId)) return false;

      return true;
    });
  }, [students, facultyId, departmentId, levelId, semesterId]);

  const requiredClasses = useMemo(() => {
    if (capacity <= 0) return 0;
    return Math.ceil(eligibleStudents.length / capacity);
  }, [eligibleStudents.length, capacity]);

  const classPlan = useMemo<PlannedClass[]>(() => {
    if (requiredClasses < 1) return [];

    const safePrefix = classPrefix.trim() || 'class';
    const digits = Math.max(2, String(requiredClasses).length);

    return Array.from({ length: requiredClasses }, (_, index) => {
      const classNumber = String(index + 1).padStart(digits, '0');
      const startIndex = index * capacity + 1;
      const endIndex = Math.min((index + 1) * capacity, eligibleStudents.length);

      return {
        name: `${safePrefix}${classNumber}`,
        code: `${safePrefix.toUpperCase()}-${classNumber}`,
        studentCount: Math.max(0, endIndex - startIndex + 1),
        startIndex,
        endIndex,
      };
    });
  }, [requiredClasses, classPrefix, capacity, eligibleStudents.length]);

  const handleGenerateClasses = async () => {
    if (!moduleId || !semesterId) {
      toast.error('Select module and semester before generating classes.');
      return;
    }
    if (capacity < 1) {
      toast.error('Capacity must be at least 1.');
      return;
    }
    if (requiredClasses < 1) {
      toast.error('No classes needed for current filters.');
      return;
    }

    const { day, time } = deriveDayTimeFromSchedule(schedule);

    setIsGenerating(true);
    try {
      for (const plannedClass of classPlan) {
        await createClass({
          name: plannedClass.name,
          code: plannedClass.code,
          moduleId,
          courseId: moduleId,
          semesterId,
          lecturerId,
          schedule,
          day,
          time,
          capacity,
          academicYear: new Date().getFullYear().toString(),
        }).unwrap();
      }

      toast.success(`${classPlan.length} classes generated successfully.`);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to generate classes.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Class Allocation Planner</CardTitle>
          <CardDescription>
            Filter by semester, faculty, department, and year level to split students into classes by capacity.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div>
            <Label>Faculty</Label>
            <Select
              value={facultyId || 'all'}
              onValueChange={(value) => {
                const nextFacultyId = value === 'all' ? '' : value;
                setFacultyId(nextFacultyId);
                setDepartmentId('');
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select faculty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Faculties</SelectItem>
                {faculties.map((faculty: any) => (
                  <SelectItem key={String(faculty.id)} value={String(faculty.id)}>
                    {faculty.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Department</Label>
            <Select value={departmentId || 'all'} onValueChange={(value) => setDepartmentId(value === 'all' ? '' : value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {filteredDepartments.map((department: any) => (
                  <SelectItem key={String(department.id)} value={String(department.id)}>
                    {department.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Level / Year</Label>
            <Select value={levelId || 'all'} onValueChange={(value) => setLevelId(value === 'all' ? '' : value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                {levels.map((level: any) => (
                  <SelectItem key={String(level.id)} value={String(level.id)}>
                    {level.levelName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Semester</Label>
            <Select value={semesterId} onValueChange={setSemesterId}>
              <SelectTrigger>
                <SelectValue placeholder="Select semester" />
              </SelectTrigger>
              <SelectContent>
                {semesters.map((semester: any) => (
                  <SelectItem key={String(semester.id)} value={String(semester.id)}>
                    {semester.name || semester.semesterName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Module</Label>
            <Select value={moduleId} onValueChange={setModuleId}>
              <SelectTrigger>
                <SelectValue placeholder="Select module" />
              </SelectTrigger>
              <SelectContent>
                {modules.map((module: any) => (
                  <SelectItem key={String(module.id)} value={String(module.id)}>
                    {module.code} - {module.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Lecturer (Optional)</Label>
            <Select value={lecturerId || 'none'} onValueChange={(value) => setLecturerId(value === 'none' ? '' : value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select lecturer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Unassigned</SelectItem>
                {filteredLecturers.map((lecturer: any) => (
                  <SelectItem key={String(lecturer.id)} value={String(lecturer.id)}>
                    {lecturer.firstName} {lecturer.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Class Capacity</Label>
            <Input type="number" min={1} value={capacity} onChange={(e) => setCapacity(Number(e.target.value) || 0)} />
          </div>

          <div>
            <Label>Class Prefix</Label>
            <Input value={classPrefix} onChange={(e) => setClassPrefix(e.target.value || 'class')} placeholder="class" />
          </div>

          <div>
            <Label>Schedule (Optional)</Label>
            <Input value={schedule} onChange={(e) => setSchedule(e.target.value)} placeholder="MON 10:00" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Allocation Result</CardTitle>
          <CardDescription>
            Eligible students: {eligibleStudents.length}. Capacity per class: {capacity}. Required classes: {requiredClasses}.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {classPlan.length > 0 ? (
            <div className="grid gap-2 md:grid-cols-3">
              {classPlan.map((item) => (
                <div key={item.code} className="rounded border p-3 text-sm">
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-muted-foreground">{item.code}</p>
                  <p className="text-xs text-muted-foreground">
                    Students: {item.studentCount} ({item.startIndex} - {item.endIndex})
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No class plan yet. Choose criteria and set class capacity.</p>
          )}

          <Button onClick={handleGenerateClasses} disabled={isGenerating || requiredClasses < 1 || !moduleId || !semesterId}>
            {isGenerating ? 'Generating...' : `Generate ${requiredClasses} Classes`}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Classes</CardTitle>
          <CardDescription>Current classes already created in the system.</CardDescription>
        </CardHeader>
        <CardContent>
          {classesLoading || studentsLoading ? (
            <p>Loading...</p>
          ) : classes.length === 0 ? (
            <p className="text-sm text-muted-foreground">No classes found.</p>
          ) : (
            <div className="space-y-2">
              {classes.map((item: any) => (
                <div key={item.id} className="rounded border p-3">
                  <p className="font-semibold">{item.name || `Class ${item.id}`}</p>
                  <p className="text-sm text-muted-foreground">
                    Module: {item.code || item.courseId || item.moduleId} | Semester: {item.semester || item.semesterId}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
