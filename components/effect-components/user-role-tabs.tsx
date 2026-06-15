import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { Users, BookOpen, Shield } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface TabContent {
  badge: string;
  title: string;
  description: string;
  buttonText: string;
  imageSrc: string;
  imageAlt: string;
}

interface Tab {
  value: string;
  icon: React.ReactNode;
  label: string;
  content: TabContent;
}

interface Feature108Props {
  badge?: string;
  heading?: string;
  description?: string;
  tabs?: Tab[];
}

const Feature108 = ({
  badge = "Afrivas",
  heading = "Tailored for Everyone to be involved in the Education Process",
  description = "Afrivas provides specialized features for each role in the educational ecosystem.",
  tabs = [
    {
      value: "tab-1",
      icon: <Users className="h-auto w-4 shrink-0" />,
      label: "Students",
      content: {
        badge: "Student Features",
        title: "For Students",
        description:
          "Access all your courses, assignments, and grades in one place. Stay organized and connected with your teachers and peers. Track your academic progress in real-time, submit assignments and receive feedback, access learning resources anytime, anywhere, communicate with teachers and classmates, and get notified about important deadlines.",
        buttonText: "Sign Up as Student",
        imageSrc: "/landing -page-slider-imgs/magnific_black-sierra-leonean-coll_2901335271.png",
        imageAlt: "Student dashboard",
      },
    },
    {
      value: "tab-2",
      icon: <BookOpen className="h-auto w-4 shrink-0" />,
      label: "Teachers",
      content: {
        badge: "Teacher Tools",
        title: "For Teachers",
        description:
          "Manage your classes, track student performance, and communicate with students and parents efficiently. Create and manage assignments and assessments, track student attendance and participation, communicate with students and parents, share learning resources and materials, and generate performance reports and analytics.",
        buttonText: "Sign Up as Teacher",
        imageSrc: "/images/DASHBOARD.png",
        imageAlt: "Teacher dashboard",
      },
    },
    {
      value: "tab-3",
      icon: <Shield className="h-auto w-4 shrink-0" />,
      label: "Parents",
      content: {
        badge: "Parent Portal",
        title: "For Parents",
        description:
          "Stay informed about your child's education. Monitor progress, communicate with teachers, and support learning. Monitor your child's academic progress, view attendance and assignment completion, communicate directly with teachers, receive notifications about important events, and access school announcements and updates.",
        buttonText: "Sign Up as Parent",
        imageSrc: "/landing -page-slider-imgs/magnific_create-an-image-of-a-joyf_2901352897.png",
        imageAlt: "Afrivas diverse Sierra Leonean professionals collaboration",
      },
    },
  ],
}: Feature108Props) => {
  return (
    <section className="py-20 bg-white dark:bg-gray-900/50">
      <div className="container mx-auto">
        <div className="flex flex-col items-center gap-4 text-center">
          <Badge variant="outline" className="bg-secondary-300/25 border border-secondary-300">{badge}</Badge>
          <h1 className="max-w-2xl text-3xl font-semibold md:text-4xl text-secondary-200 dark:text-primary-100">
            {heading}
          </h1>
          <p className="text-muted-foreground text-lg">{description}</p>
        </div>
        <Tabs defaultValue={tabs[0].value} className="mt-8 w-full max-w-4xl mx-auto">
          <TabsList className="container flex flex-col items-center justify-center gap-4 sm:flex-row md:gap-10 grid w-full grid-cols-3 mb-8">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-muted-foreground data-[state=active]:bg-muted data-[state=active]:text-lemon-200 data-[state=active]:dark:text-lemon-100"
              >
                {tab.icon} {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="mx-auto mt-8 max-w-screen-xl rounded-2xl bg-muted/70 p-6 lg:p-16">
            {tabs.map((tab) => (
              <TabsContent
                key={tab.value}
                value={tab.value}
                className="grid place-items-center gap-20 lg:grid-cols-2 lg:gap-10 mt-4"
              >
                <div className="flex flex-col gap-5">
                  <Badge variant="outline" className="w-fit bg-background">
                    {tab.content.badge}
                  </Badge>
                  <h3 className="text-3xl font-semibold lg:text-5xl text-gray-900 dark:text-gray-100">
                    {tab.content.title}
                  </h3>
                  <p className="text-muted-foreground lg:text-lg">
                    {tab.content.description}
                  </p>
                  <Button className="mt-2.5 w-fit gap-2" size="lg" asChild>
                    <a href="/login">
                      {tab.content.buttonText}
                    </a>
                  </Button>
                </div>
                <div className="relative mx-auto">
                  <div className="relative rounded-2xl overflow-hidden border-8 border-gray-800 shadow-xl max-w-xs mx-auto">
                    <img
                      src={tab.content.imageSrc}
                      alt={tab.content.imageAlt}
                      className="w-full rounded-xl"
                    />
                  </div>
                </div>
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    </section>
  );
};

export { Feature108 };