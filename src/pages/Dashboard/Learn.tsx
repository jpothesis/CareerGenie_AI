import { useState, useMemo } from "react";
import learnBg from "../../assets/background.png";
import { Card, CardContent } from "../../components/Card";
import { Button } from "../../components/ui/button"; // ✅ This is inside ui
import Progress from "../../components/ui/progress";


type Course = {
  id: number;
  title: string;
  description: string;
  progress: number;
  completed: boolean;
};

const Learn = () => {
  const [courses, setCourses] = useState<Course[]>([
    {
      id: 1,
      title: "Resume Mastery",
      description: "Learn how to create an ATS-friendly resume.",
      progress: 80,
      completed: false,
    },
    {
      id: 2,
      title: "AI Interview Prep",
      description: "Boost your confidence with AI-powered mock interviews.",
      progress: 50,
      completed: false,
    },
    {
      id: 3,
      title: "Career Roadmap",
      description: "Plan your career path with guided modules.",
      progress: 100,
      completed: true,
    },
  ]);

  // 📊 Calculate Summary
  const { total, completed, percentage } = useMemo(() => {
    const total = courses.length;
    const completed = courses.filter((c) => c.completed).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, percentage };
  }, [courses]);

  const markAsComplete = (id: number) => {
    setCourses((prev) =>
      prev.map((course) =>
        course.id === id ? { ...course, completed: true, progress: 100 } : course
      )
    );
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat px-6 py-8 text-white"
      style={{
        backgroundImage: `url(${learnBg})`,
        backgroundColor: "rgba(0,0,0,0.75)",
        backgroundBlendMode: "overlay",
      }}
    >
      <div className="max-w-6xl mx-auto backdrop-blur-sm p-6 rounded-xl">
        {/* 🔥 Summary Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-[#111827] border border-neutral-700 rounded-xl p-4 flex flex-col items-center">
            <p className="text-sm text-neutral-400">Total Courses</p>
            <h2 className="text-2xl font-bold text-yellow-400">{total}</h2>
          </div>
          <div className="bg-[#111827] border border-neutral-700 rounded-xl p-4 flex flex-col items-center">
            <p className="text-sm text-neutral-400">Completed</p>
            <h2 className="text-2xl font-bold text-green-400">{completed}</h2>
          </div>
          <div className="bg-[#111827] border border-neutral-700 rounded-xl p-4 flex flex-col items-center">
            <p className="text-sm text-neutral-400">Learning Progress</p>
            <h2 className="text-2xl font-bold text-orange-400">{percentage}%</h2>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 text-transparent bg-clip-text">
          📚 Continue Learning
        </h1>

        {/* Course Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card
              key={course.id}
              className="bg-[#111827] border border-neutral-700 rounded-2xl shadow-lg hover:shadow-yellow-500/30 transition"
            >
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-yellow-300 mb-2">
                  {course.title}
                </h2>
                <p className="text-sm text-neutral-300 mb-4">{course.description}</p>

                <Progress
                  value={course.progress}
                  className="h-2 bg-neutral-700"
                />

                <div className="flex items-center justify-between mt-4">
                  <span className="text-xs text-neutral-400">
                    {course.completed
                      ? "✅ Completed"
                      : `${course.progress}% Progress`}
                  </span>
                  {!course.completed && (
                    <Button
                      onClick={() => markAsComplete(course.id)}
                      className="bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 text-black font-semibold px-4 py-1 rounded-lg hover:opacity-90 transition"
                    >
                      Mark Complete
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Learn;
